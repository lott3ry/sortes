import React, { useEffect, useState, useRef } from 'react';
import sortesDark from '../../../assets/svg/lott/sortes-dark.svg';
import wave from '../../../assets/svg/lott/wave.svg';
import wave2 from '../../../assets/svg/lott/wave2.svg';
import dice from '../../../assets/svg/lott/dice.svg';
import hook from '../../../assets/svg/lott/hook.svg';
import hook2 from '../../../assets/svg/lott/hook2.svg';
import coordinate from '../../../assets/svg/lott/coordinate.png';
import { RandomnessIcon } from '../RandomnessIcon';
import {
  LotteryAnimationStages,
  LotteryInfo,
  LotteryStages,
} from '../../../atoms/web3';
import { readableAddr } from '../../../utils/format';
import { AnimationDuration } from '../../../utils/env';
interface AnimationWindowProps {
  lotteryInfo: LotteryInfo;
  index: number;
  showAnimationItem: number;
  triggerAnimation: number;
}

// 添加语义化的常量定义
const AnimationPhase = {
  WAITING: -1,
  DICE_ROLLING: 0,
  BALL_DROPPING: 1,
  RESULT_SETTLING: 2,
  COMPLETED: 3,
};

const PROGRESS_PER_PHASE = 25.0;

const AnimationWindow: React.FC<AnimationWindowProps> = (props) => {
  const { lotteryInfo, index, showAnimationItem, triggerAnimation } = props;
  const { stage } = lotteryInfo;
  const [currentPhase, setCurrentPhase] = useState(AnimationPhase.WAITING);
  const [zIndex, setZIndex] = useState(1);
  const [shouldHide, setShouldHide] = useState(false);
  const mountedRef = useRef(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (stage === LotteryStages.WaitingForRecipt) {
      setCurrentPhase(AnimationPhase.DICE_ROLLING);

      const diceRollingTimer = setTimeout(() => {
        setCurrentPhase(AnimationPhase.BALL_DROPPING);

        const ballDroppingTimer = setTimeout(() => {
          setCurrentPhase(AnimationPhase.RESULT_SETTLING);
        }, AnimationDuration.BALL_DROPPING);

        return () => clearTimeout(ballDroppingTimer);
      }, AnimationDuration.DICE_ROLLING);

      return () => clearTimeout(diceRollingTimer);
    } else if (stage === LotteryStages.Fulfilled) {
      const hideTimer = setTimeout(() => {
        setZIndex(-1);
      }, AnimationDuration.RESULT_DISPLAY);

      return () => clearTimeout(hideTimer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === LotteryStages.Fulfilled) {
      setCurrentPhase(AnimationPhase.COMPLETED);
    }
  }, [stage]);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    if (showAnimationItem === index) {
      setZIndex(1);
    } else {
      setZIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAnimationItem, triggerAnimation]);

  const handleClose = () => {
    setZIndex(-1);
  };

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (stage === LotteryStages.Fulfilled || stage === LotteryStages.Failed) {
        const hideTimer = setTimeout(() => {
          setShouldHide(true);
        }, AnimationDuration.RESULT_DISPLAY);

        return () => clearTimeout(hideTimer);
      }
    }
  }, [stage]);

  // 如果状态为失败，立即返回 null
  if (stage === LotteryStages.Failed) {
    return null;
  }

  if (shouldHide) return null;

  const calculateProgress = () => {
    if (stage === LotteryStages.Fulfilled) {
      return 100.0;
    }
    const progress = (currentPhase + 1) * PROGRESS_PER_PHASE;
    return Number(progress.toFixed(1));
  };

  return (
    <li
      // 适配1440x900  适配1720之上的h为1080的情况
      className="absolute -top-[8rem] left-1/2 h-[1000px] w-[700px] -translate-x-1/2 scale-[0.65] transform rounded-[32px] bg-white shadow-[4px_4px_8px_10px_rgba(0,0,0,0.20)] transition-opacity duration-300 3xl:-top-[3rem] 3xl:scale-[0.8]"
      style={{
        zIndex: zIndex,
      }}
    >
      <i
        onClick={handleClose}
        className="iconfont icon-close-outlined absolute right-[15px] top-[15px] cursor-pointer text-4xl"
      ></i>
      {(currentPhase === AnimationPhase.WAITING ||
        currentPhase === AnimationPhase.DICE_ROLLING) && (
        <div className="relative ml-[90px] mt-[132px] h-[533px] w-[615px]">
          <div className="flex">
            <img
              src={sortesDark}
              alt="Sortes"
              className="mr-[10px] h-[60px] w-[282px]"
            />
            <img
              className="animate-price-wave mr-5 mt-2 h-12"
              src={wave}
              alt=""
              style={{
                animation: ' WaveToLeft 1s ease-out infinite',
              }}
            />
          </div>

          {/* hook */}
          <img className="absolute right-24 top-9" src={hook} alt="" />
          <img className="absolute left-2 top-[5.2rem]" src={hook2} alt="" />

          {/* 色子 */}
          <img
            className="ml-[115px] mt-[54px]"
            style={{
              animation:
                currentPhase === AnimationPhase.DICE_ROLLING
                  ? 'spin 4s linear infinite'
                  : 'none',
            }}
            src={dice}
            alt=""
          />
          {/* 球 */}
          <div
            className="absolute bottom-[40px] left-[200px] flex size-10 items-center justify-center rounded-full bg-[#FF4D6C] text-lg"
            style={{
              animation:
                currentPhase === AnimationPhase.DICE_ROLLING
                  ? 'moveCircle 9s linear forwards'
                  : 'none',
            }}
          >
            r
          </div>
          <div className="absolute right-10 mt-5 flex">
            <img
              className="animate-price-wave mr-5 mt-2 h-12"
              src={wave2}
              alt=""
              style={{
                animation: ' WaveToRight 1s ease-out infinite',
              }}
            />
            <RandomnessIcon className="h-20 w-[250px] object-contain" />
          </div>
        </div>
      )}
      {(currentPhase === AnimationPhase.BALL_DROPPING ||
        currentPhase === AnimationPhase.RESULT_SETTLING ||
        currentPhase === AnimationPhase.COMPLETED) && (
        <div className="relative">
          <img
            className="ml-4 mt-[151px] h-[533px] w-[655px]"
            src={coordinate}
          />
          <div
            className="absolute left-[300px] top-[110px] flex size-10 items-center justify-center rounded-full bg-[#FF4D6C] text-lg"
            style={{
              animation:
                currentPhase === AnimationPhase.COMPLETED
                  ? 'none'
                  : 'dropCircle 3s linear forwards',
            }}
          >
            r
          </div>
        </div>
      )}

      <div className="mt-[110px] px-[75px]">
        <section className="flex items-center justify-between">
          <h1 className="font-['PingFang_SC'] text-2xl font-normal leading-normal text-[#5962BA]">
            Block Progress: {calculateProgress()}%
          </h1>
          {lotteryInfo?.transactionHash && (
            <div className="rounded-lg border border-[#5962BA] bg-white px-4 py-1 text-sm font-normal text-[#5962BA]">
              {readableAddr(lotteryInfo.transactionHash, 4)}
            </div>
          )}
        </section>
        {stage !== LotteryStages.Fulfilled && (
          <>
            <section className="my-5">
              <div className="h-5 w-full rounded-full bg-[#FFDD17]">
                <div
                  className="h-full rounded-full bg-[#93DC08] transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${calculateProgress()}%`,
                  }}
                ></div>
              </div>
            </section>
            <section className="flex justify-between">
              <h1 className="font-['PingFang_SC'] text-2xl font-normal leading-normal text-[#7a81c8]">
                {currentPhase >= AnimationPhase.DICE_ROLLING &&
                  LotteryAnimationStages[currentPhase]}
              </h1>
            </section>
          </>
        )}
        {stage === LotteryStages.Fulfilled && (
          <section className="mt-[30px] text-2xl font-normal">
            <div className="flex justify-start text-[#5962BA]">
              Randomness number:
            </div>
            <div className="whitespace-pre-wrap break-words text-left leading-[40px] text-[#5962BA]">
              {lotteryInfo.randomness &&
                lotteryInfo.randomness.split('').map((char, index) => (
                  <span
                    key={index}
                    className="inline-block border-b border-[#5962BA]"
                  >
                    {char}
                  </span>
                ))}
            </div>
          </section>
        )}
      </div>
    </li>
  );
};

export default AnimationWindow;
