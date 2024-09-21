import { useAtomValue, useSetAtom } from 'jotai';
import {
  LotteryInfo,
  LotteryStages,
  getLotteryListAtom,
  setLotteryAtom,
  web3ServiceInitedAtom,
} from '../../../atoms/web3';
import LotteryItem from './LotteryItem';
import { useCallback, useEffect, useState } from 'react';
import { SwapDetail, Web3Service } from '../../../services/web3';
import { useLottery } from '../../../hooks/lottery';
import AnimationWindow from './AnimationWindow';
import { isMobileWeb } from '../../../utils/env';

const MaxListSize = 3;

interface ProcessingLotteriesProps {
  swapDetail: SwapDetail | null;
}

const ProcessingLotteries: React.FC<ProcessingLotteriesProps> = ({
  swapDetail,
}) => {
  const lotteryList = useAtomValue(getLotteryListAtom);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const setLottery = useSetAtom(setLotteryAtom);
  const { waitForLotteryResult } = useLottery();
  const [showAnimationItem, setShowAnimationItem] = useState(0);
  const [triggerAnimation, setTriggerAnimation] = useState(0);

  const length = lotteryList.length;

  // load unfinished lotteries
  const fetchRequests = useCallback(async () => {
    if (isWeb3ServiceInited && swapDetail) {
      const validRequests = await Web3Service.service.getValidRequests();
      const currentBlock = await Web3Service.service.getCurrentBlockNumber();
      const lotteryInfos: LotteryInfo[] = validRequests.map((request) => ({
        requestId: request.id,
        startTime: Date.now(),
        stage: LotteryStages.WaitingForResult,
        startAtBlock: currentBlock,
        transactionHash: request.status.transactionHash,
      }));
      setLottery(lotteryInfos);
      lotteryInfos.forEach((lotteryInfo) => {
        waitForLotteryResult(lotteryInfo, swapDetail!, lotteryInfo.requestId!);
      });
    }
  }, [isWeb3ServiceInited, setLottery, swapDetail, waitForLotteryResult]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (!swapDetail) return null;

  return (
    <>
      <ul className="fixed right-0 top-[180px] z-10 flex flex-col items-end">
        {lotteryList.map((lotteryInfo, index) => (
          <LotteryItem
            openWindow={() => {
              if (
                lotteryInfo.stage !== LotteryStages.Fulfilled &&
                lotteryInfo.stage !== LotteryStages.Failed
              ) {
                setShowAnimationItem(index),
                  setTriggerAnimation((prev) => prev + 1);
              }
            }}
            swapDetail={swapDetail}
            key={
              lotteryInfo.requestId?.toString() ??
              lotteryInfo.transactionHash ??
              index
            }
            lotteryInfo={lotteryInfo}
            autoFade={
              length > MaxListSize &&
              index === 0 &&
              lotteryInfo.stage === LotteryStages.Fulfilled
            }
          />
        ))}
      </ul>
      <ul className="absolute left-1/2 top-[100px] flex items-center justify-center">
        {!isMobileWeb &&
          lotteryList.map((lotteryInfo, index) => (
            <AnimationWindow
              key={
                lotteryInfo.requestId?.toString() ??
                lotteryInfo.transactionHash ??
                index
              }
              lotteryInfo={lotteryInfo}
              showAnimationItem={showAnimationItem}
              index={index}
              triggerAnimation={triggerAnimation}
            />
          ))}
      </ul>
    </>
  );
};

export default ProcessingLotteries;
