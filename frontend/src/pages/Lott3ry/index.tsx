import CongratulationsPopup from './Congratulations';
import Jackpot from './Jackpot';
import ProcessingLotteries from './ProcessingLotteries';
import BetPanel from './BetPanel';
import { useSwapId } from '../../hooks/pool';
import { useCallback, useEffect, useState } from 'react';
import { SwapDetail, Web3Service } from '../../services/web3';
import { web3ServiceInitedAtom } from '../../atoms/web3';
import { useAtomValue } from 'jotai';

import rewardBgWBTC from '../../assets/images/rewards/bg-wbtc.svg';
import rewardBgSatoshi from '../../assets/images/rewards/bg-satoshi.svg';
import rewardBgTaiko from '../../assets/images/rewards/bg-taiko.svg';
import rewardBgExp from '../../assets/images/rewards/bg-exp.svg';

import { chainAtom } from '../../atoms/chain';

const Lott3ryPage = () => {
  const swapId = useSwapId();
  const [swapDetail, setSwapDetail] = useState<SwapDetail | null>(null);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const chainId = useAtomValue(chainAtom);

  const fetchSwap = useCallback(async () => {
    if (!isWeb3ServiceInited || !chainId) return;
    try {
      const swap = await Web3Service.service.getSwap(swapId);
      setSwapDetail(swap);
    } catch (error) {
      console.log('error', error);
    }
  }, [isWeb3ServiceInited, swapId, chainId]);

  // preload images
  useEffect(() => {
    const imgs = [rewardBgExp, rewardBgSatoshi, rewardBgTaiko, rewardBgWBTC];
    Promise.all(
      imgs.map(
        (img) =>
          new Promise((resolve) => {
            const image = new Image();
            image.src = img;
            image.onload = resolve;
            image.onerror = resolve;
          })
      )
    );
  }, []);

  useEffect(() => {
    fetchSwap();
  }, [fetchSwap]);

  return (
    <div className="min-h-[calc(100svh-300px)] bg-white pb-16 pt-10 text-center max-sm:px-4 max-sm:pb-5 max-sm:pt-0">
      <div className="mx-auto flex w-[1070px] flex-col overflow-x-hidden max-sm:w-full">
        <Jackpot swapDetail={swapDetail} />
        <div className="my-5 sm:mb-10">
          <BetPanel swapDetail={swapDetail} />
          <ProcessingLotteries swapDetail={swapDetail} />
        </div>
      </div>
      <CongratulationsPopup />
    </div>
  );
};

export default Lott3ryPage;
