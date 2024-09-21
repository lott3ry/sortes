import { BigNumber } from 'ethers';
import { parseUnits, formatUnits } from 'ethers/lib/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  LotteryStages,
  setLotteryAtom,
  LotteryInfo,
  congratulationAtom,
} from '../atoms/web3';
import {
  FulfilledLotteryResult,
  Lott3ryCurrency,
  parseReward,
} from '../utils/reward';
import { SwapDetail, Web3Service } from '../services/web3';
import { Event } from '@ethersproject/contracts';
import { sleep } from '../utils/helper';
import { useCallback } from 'react';
import { showError } from '../utils/notify';
import { useSwapId } from './pool';
import { currentChainInfo, isMainnet } from '../utils/env';
import { saveInvalidRequestIds } from '../services/persist';
import { chainAtom } from '../atoms/chain';

const LotteryPollingInterval = 2000;
const LotteryTimeout = 10 * 60 * 1000;

export const useLottery = () => {
  const setLotteryInfo = useSetAtom(setLotteryAtom);
  const [congratulation, setCongratulation] = useAtom(congratulationAtom);
  const chainId = useAtomValue(chainAtom);
  const swapId = useSwapId();

  const handleLotteryFailed = useCallback(
    (lotteryInfo: LotteryInfo, e: unknown) => {
      lotteryInfo.stage = LotteryStages.Failed;
      setLotteryInfo([lotteryInfo]);
      if (lotteryInfo.requestId) {
        saveInvalidRequestIds([lotteryInfo.requestId.toString()]);
      }

      if (e instanceof Error) showError(e.message);
      else if (typeof e === 'string') showError(e);
      else showError('Unknown error');
    },
    [setLotteryInfo]
  );

  const parseStaus = useCallback(
    (
      lotteryInfo: LotteryInfo,
      swapDetail: SwapDetail,
      requestId: BigNumber,
      status: any
    ) => {
      const tokens = Web3Service.service.tokens;
      lotteryInfo.requestId = requestId;

      const { jkptOut, jkptTicket, rewardLevels } = status;
      console.log(status, 'status');

      const jkptTicketValue = parseFloat(
        formatUnits(jkptTicket, tokens?.jkpt?.decimal)
      );

      const jkptAmount = parseFloat(
        formatUnits(jkptOut, tokens?.jkpt?.decimal)
      );
      const rewards = parseReward(
        jkptAmount,
        jkptTicketValue,
        rewardLevels.map((level: BigNumber) => level?.toString()),
        swapDetail
      );

      lotteryInfo.stage = LotteryStages.Fulfilled;
      lotteryInfo.rewards = rewards;
      setLotteryInfo([lotteryInfo]);

      // show congratulation only if it's not shown and the chain is the same
      // prevent overwriting the previous result which user may still want to check
      // prevent showing congratulation of previous chain
      if (!congratulation.show && lotteryInfo.chainId === chainId) {
        setTimeout(() => {
          setCongratulation({
            rewards,
            show: true,
          });
        }, 3000); // 3秒延迟
      }
    },
    [chainId, congratulation.show, setCongratulation, setLotteryInfo]
  );

  const waitForLotteryResult = useCallback(
    async (
      lotteryInfo: LotteryInfo,
      swapDetail: SwapDetail,
      requestId: BigNumber
    ) => {
      try {
        const web3 = Web3Service.service;
        const { contracts } = web3;
        const { xbit } = contracts!;
        const status: FulfilledLotteryResult = await Promise.race([
          (async () => {
            let status;
            while (!status || !status.fulfilled) {
              status = await xbit!.getRequestStatusById(requestId);
              console.log(status.randomWord.toHexString(), 'status');
              if (status.fulfilled) return status;
              else await sleep(LotteryPollingInterval);
            }
          })(),
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Lott3ry request timeout'));
            }, LotteryTimeout);
          }),
        ]);

        lotteryInfo.requestId = requestId;
        lotteryInfo.randomness = status.randomWord.toHexString();

        parseStaus(lotteryInfo, swapDetail, requestId, status);
      } catch (e: unknown) {
        handleLotteryFailed(lotteryInfo, e);
      }
    },
    [handleLotteryFailed, parseStaus]
  );

  const lottery = useCallback(
    async (
      value: string,
      swapDetail: SwapDetail,
      currency: Lott3ryCurrency = Lott3ryCurrency.USDT
    ) => {
      const web3 = Web3Service.service;
      const { tokens } = web3;
      const { usdt, xbit } = web3.contracts!;
      const transferNum = parseUnits(value, tokens?.usdt.decimal);
      const lotteryInfo: LotteryInfo = {
        startTime: 0,
        stage: LotteryStages.WaitingForTrx,
        startAtBlock: 0,
      };

      try {
        if (currency === Lott3ryCurrency.USDT) {
          const allowance = await web3.usdtAllowance();
          if (allowance.lt(transferNum)) {
            // not enough allowance, need to approve
            if (isMainnet() && allowance.gt(0)) {
              // mainnet must reset non-zero allowance to 0 and wait one block
              await (await usdt!.approve(xbit!.address, 0)).wait();
            }
            await usdt!.approve(xbit!.address, transferNum);
          }
        } else if (currency === Lott3ryCurrency.USDC) {
          const allowance = await web3.usdcAllowance();
          if (allowance.lt(transferNum)) {
            // not enough allowance, need to approve
            await web3.contracts?.usdc!.approve(xbit!.address, transferNum);
          }
        } else {
          throw new Error('Invalid currency');
        }

        const trxPromise = xbit!.playSwap(
          transferNum,
          currency,
          parseUnits(swapId, 0),
          { gasLimit: currentChainInfo().playGasLimit(Number(value)) }
        );

        const startBlockNumber = await web3.getCurrentBlockNumber();

        Object.assign(lotteryInfo, {
          startTime: Date.now(),
          trxPromise: trxPromise,
          startAtBlock: startBlockNumber,
        });

        setLotteryInfo([lotteryInfo]);
        const trx = await trxPromise;

        lotteryInfo.stage = LotteryStages.WaitingForRecipt;
        lotteryInfo.transactionHash = trx.hash;
        setLotteryInfo([lotteryInfo]);
        const receipt = await trx.wait();

        lotteryInfo.stage = LotteryStages.RequestingRandomness;
        setLotteryInfo([lotteryInfo]);

        const events = receipt.events;
        const { reqId } = events.filter(
          (e: Event) => e.event === 'RequestedRandomness'
        )[0].args;

        // a fake stage
        setTimeout(() => {
          if (lotteryInfo.stage === LotteryStages.RequestingRandomness) {
            lotteryInfo.stage = LotteryStages.WaitingForResult;
            setLotteryInfo([lotteryInfo]);
          }
        }, 15000);
        await waitForLotteryResult(lotteryInfo, swapDetail, reqId);
      } catch (e: unknown) {
        handleLotteryFailed(lotteryInfo, e);
      }
    },
    [handleLotteryFailed, setLotteryInfo, swapId, waitForLotteryResult]
  );

  return {
    lottery,
    waitForLotteryResult,
  };
};
