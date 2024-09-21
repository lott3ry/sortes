import { useSetAtom } from 'jotai';
import {
  LotteryInfo,
  LotteryStages,
  congratulationAtom,
  removeLotteryAtom,
} from '../../../atoms/web3';
import { readableAddr, transactionHash2Url } from '../../../utils/format';
import BlockProgress from './BlockProgress';
import Spin from '../../../components/Spin';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SwapDetail } from '../../../services/web3';
import { Link } from 'react-router-dom';
import { AnimationDuration } from '../../../utils/env';

interface LotteryItemProps {
  lotteryInfo: LotteryInfo;
  swapDetail: SwapDetail;
  autoFade: boolean;
  openWindow: () => void;
}

const wordingMap = {
  [LotteryStages.WaitingForTrx]: 'Waiting For Transaction',
  [LotteryStages.WaitingForRecipt]: 'Waiting For Receipt',
  [LotteryStages.RequestingRandomness]: 'Requesting Randomness',
  [LotteryStages.WaitingForResult]: 'Waiting For Result',
  [LotteryStages.Fulfilled]: 'Completed',
  [LotteryStages.Failed]: 'Transaction Failed',
};
const TotalDisplayBlocks = 8;
const InitialProgress = 25;
const MidProgress = 50;
const LateProgress = 75;

const ItemHeight = 115;
const FadeAfterTime = 10000;

const LotteryItem: React.FC<LotteryItemProps> = ({
  lotteryInfo,
  autoFade,
  openWindow,
}) => {
  const [collapsCard, setCollapsCard] = useState(false);
  const [visible, setVisible] = useState(true);
  const lotteryItemRef = useRef<HTMLLIElement>(null);
  const removeLottery = useSetAtom(removeLotteryAtom);
  const setCongratulation = useSetAtom(congratulationAtom);

  const [progress, setProgress] = useState(InitialProgress);
  const startTs = useMemo(() => Date.now(), []);

  const { transactionHash, stage, rewards } = lotteryInfo;

  const url = transactionHash ? transactionHash2Url(transactionHash) : null;
  const tip = wordingMap[stage];
  const isFulfilled = stage === LotteryStages.Fulfilled;
  const isFailed = stage === LotteryStages.Failed;

  const collapseCls = collapsCard
    ? 'animate-[collapseLotteryCardOut_0.2s_ease-in] w-0'
    : 'animate-[collapseLotteryCardIn_0.2s_ease-in] w-48';

  useEffect(() => {
    if (!lotteryItemRef.current || !transactionHash) return;
    if (!autoFade) return;

    let start = 0;
    let prevTs = 0;
    let done = false;

    function fadeOut(ts: number) {
      if (start === 0) start = ts;
      const elapsed = ts - start;
      if (prevTs !== ts) {
        // 使用 DICE_ROLLING 作为最长的动画持续时间
        const progress = Math.min(elapsed / AnimationDuration.DICE_ROLLING, 1);
        const opacity = 1 - progress;
        const marginTop = Math.floor(ItemHeight * progress);

        lotteryItemRef.current!.style.opacity = `${opacity}`;
        lotteryItemRef.current!.style.marginTop = `${-marginTop}px`;

        if (progress === 1) {
          done = true;
          removeLottery(transactionHash as string);
        }
      }

      if (!done) {
        prevTs = ts;
        requestAnimationFrame(fadeOut);
      }
    }
    setTimeout(() => requestAnimationFrame(fadeOut), FadeAfterTime);
  }, [autoFade, removeLottery, transactionHash]);

  useEffect(() => {
    if (isFulfilled || isFailed) return;

    const updateProgress = () => {
      const elapsed = Date.now() - startTs;
      if (elapsed < AnimationDuration.DICE_ROLLING) {
        setProgress(InitialProgress);
      } else if (
        elapsed <
        AnimationDuration.DICE_ROLLING + AnimationDuration.BALL_DROPPING
      ) {
        setProgress(MidProgress);
      } else if (
        elapsed <
        AnimationDuration.DICE_ROLLING +
          AnimationDuration.BALL_DROPPING +
          AnimationDuration.RESULT_DISPLAY
      ) {
        setProgress(LateProgress);
      }
    };

    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [isFulfilled, isFailed, startTs]);

  if (!visible) return null;

  return (
    <li
      onClick={() => openWindow()}
      ref={lotteryItemRef}
      className="group relative mb-3 flex h-[104px] w-max items-center rounded-l-lg bg-[#93DC08] px-3 py-2 text-white"
    >
      <span className="cursor-pointer px-2 py-6 text-xl">
        {(() => {
          if ((isFulfilled || isFailed) && !collapsCard) {
            return (
              <span
                className="absolute -left-2.5 -top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#93DC08]"
                onClick={(e) => {
                  e.stopPropagation();
                  setVisible(false);
                  if (transactionHash) removeLottery(transactionHash);
                }}
              >
                <i className="iconfont icon-close text-[12px] font-bold text-white" />
              </span>
            );
          }
          return (
            <span
              onClick={() => setCollapsCard(!collapsCard)}
              className="absolute left-2 top-9"
            >
              {collapsCard ? '<' : '>'}
            </span>
          );
        })()}
      </span>
      <div className={'flex flex-col overflow-hidden text-left ' + collapseCls}>
        <div className="flex flex-row items-center text-base">
          {isFulfilled && (
            <span
              className="flex-1 hover:cursor-pointer"
              onClick={() =>
                setCongratulation({ rewards: rewards || [], show: true })
              }
            >{`Details >`}</span>
          )}
          {!isFulfilled && !isFailed && (
            <span className="flex-1">{`${progress.toFixed(0)} %`}</span>
          )}
          {isFailed && <span className="flex-1">Failed</span>}
          {transactionHash && (
            <span className="rounded-[4px] bg-white px-1 text-sm font-normal text-[#93DC08]">
              <Link to={url as string} target="_blank" rel="noreferrer">
                {readableAddr(transactionHash, 4)}
              </Link>
            </span>
          )}
        </div>
        <BlockProgress
          confirmed={
            isFulfilled
              ? TotalDisplayBlocks
              : Math.round((progress / 100) * TotalDisplayBlocks)
          }
          total={TotalDisplayBlocks}
        />
        <span
          className={
            'flex flex-row items-center text-sm font-normal' +
            (isFulfilled ? '' : ' text-white/65')
          }
        >
          <span className="flex flex-1">{tip}</span>
          {!isFulfilled && !isFailed && <Spin className="ml-2 h-4 w-4" />}
        </span>
      </div>
    </li>
  );
};

export default LotteryItem;
