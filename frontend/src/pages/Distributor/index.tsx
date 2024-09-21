import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Selection from '../../components/Selection';
import Input from './Input';
import {
  RewardConfig,
  RewardType,
  usePoolJkpt,
  useRewardPossibility,
} from '../../hooks/pool';
import Button from './Button';
import { Web3Service } from '../../services/web3';

import Tooltip from '../../components/Tooltip';
import SellImg from '../../assets/images/distributor/sell.png';
import CreateImg from '../../assets/images/distributor/create.png';
import GainImg from '../../assets/images/distributor/gain.png';
import ShareImg from '../../assets/images/distributor/share.png';
import ArrowImg from '../../assets/images/distributor/arrow.png';
import deleteIcon from '../../assets/svg/delete.svg';
import { useAtomValue } from 'jotai/index';
import { web3ServiceInitedAtom } from '../../atoms/web3.ts';
import { Popup } from '../../components/Modal/Popup.tsx';
import Loading from '../../assets/animations/loading-hourglass.json';
import PrizeTable from '../../components/PrizeTable';
import Lottie from 'lottie-react';

import Feedback from './Feedback.tsx';
import SharePosterPopup from '../../components/SharePoster/Popup.tsx';
import Presets from './Presets/index.tsx';
import { MaxRatio } from './Presets/config.ts';

declare global {
  interface Window {
    testRegister: () => void;
  }
}

type levelType = {
  level1: number | undefined;
  level2: number | undefined;
};

enum ConfigError {
  EmptyValue = 'Empty required value',
  NegativeValue = 'Numbers must be non-negative',
  MuchValue = 'Pool name must have fewer than 256 chars',
  InvalidFixedReward = 'Fixed reward must be between 0.01 USD and 10% of the pool size',
  InvalidPercentageReward = 'Percentage reward must be between 0.01% and 10% of the pool size',
  InvalidExpectation = 'Expectation must be between $0 - $8',
  ExpectationGTEReward = 'Expectation is greater than or equal to reward',
  ExpectationExceedLimit = 'Sum of expectations must be between 0 - 8',
  PossibilityExceedLimit = 'Sum of probabilities must be less than or equal to 100%',
}

const distributorData = [
  { img: CreateImg, text: 'Create distributor pool' },
  { img: ShareImg, text: 'Share lottery page' },
  { img: SellImg, text: 'Selling lottery tickets' },
  { img: GainImg, text: 'Gain profit' },
];

const RewardRow = ({
  index,
  isDefault = false,
  rewardConfs,
  setRewardConfs,
  judgeExpectation,
  judgeCurrentExpectation,
  judgeCurrentType,
  judgeAmtAndPct,
  judgePossibility,
  judgeFinal,
  setRewardNum,
  currentIndex,
  setCurrentIndex,
  allPossiblity,
  posibilitySum,
}: any) => {
  const [haveSetIndex, setHaveSetIndex] = useState<number[]>([]);
  //note 复用
  const handleChangeReward = (
    field: keyof RewardConfig,
    value: string | number | RewardType,
    level: keyof levelType
  ) => {
    // 修改表单数据
    setRewardConfs((prevConfs: any) => {
      const newConfs = [...prevConfs];
      newConfs[index] = {
        ...newConfs[index],
        [field]: value,
      };
      return newConfs;
    });

    // 记录最后操作列
    setCurrentIndex((prevIndex: any) => ({
      ...prevIndex,
      [level]: index,
    }));
  };

  // 检查是否有任何输入出现错误
  const hasAnyErrorLevel1 = rewardConfs?.some(
    (_: any, idx: number) => judgeCurrentExpectation(idx) !== null
  );

  if (isDefault) {
    return (
      <div className="flex h-[48px] items-center space-x-[50px]">
        <div className="flex items-center">
          <div className={`ml-[60px] w-[107px] font-bold leading-[48px]`}>
            Reward {index + 1}
          </div>
        </div>

        <div className="h-[48px] w-[450px] text-base">
          <Input value="Default Reward" type="text" disable={false} />
        </div>
        <div className="h-full w-[200px] text-base">
          <Input value="100 EXP" type="text" disable={false} />
        </div>

        <div className="h-full w-[250px] text-base">
          <Input
            placeholder={`P${index + 1} = 1-SUM(P${index}:P${index})`}
            onChange={() => null}
            disable={judgeFinal || judgePossibility || judgeAmtAndPct}
            type={'text'}
            value={
              !(judgeFinal || judgePossibility || judgeAmtAndPct) &&
              posibilitySum
                ? ((1 - posibilitySum) * 100).toFixed(4) + '%'
                : ''
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[48px] items-center space-x-[50px]">
      <div className="flex items-center">
        {index > 0 && (
          <img
            src={deleteIcon as string}
            alt=""
            className="size-[30px]"
            onClick={() =>
              setRewardNum((prev: number) => {
                return prev - 1;
              })
            }
          />
        )}
        <div
          className={`${index > 0 ? 'ml-[30px]' : 'ml-[60px]'} w-[107px] font-bold leading-[48px]`}
        >
          Reward {index + 1}
        </div>
      </div>

      <div className="h-[48px] w-[200px] text-base">
        <Input
          placeholder="Expectations"
          value={rewardConfs[index]?.expectation?.toString() ?? ''}
          onChange={(val: number) =>
            handleChangeReward('expectation', val, 'level1')
          }
          disable={hasAnyErrorLevel1 && currentIndex.level1 !== index}
          error={
            currentIndex.level1 === index
              ? judgeCurrentExpectation(index)
              : null
          }
        />
      </div>
      <div className="h-full w-[200px] text-base">
        <Selection
          options={[RewardType.Fixed, RewardType.Percentage]}
          initialValue={rewardConfs[index]?.type ?? ''}
          placeholder="Type"
          onChange={(val: string) => {
            handleChangeReward('type', val, 'level2');
            setHaveSetIndex((prevState) => [...prevState, index]);
          }}
          disable={
            judgeExpectation ||
            (judgeAmtAndPct && !haveSetIndex.includes(index))
          }
        />
      </div>
      <div className="h-full w-[200px] text-base">
        <Input
          placeholder="Amt/Pct"
          disable={
            judgeExpectation ||
            !judgeCurrentType(index) ||
            (judgeAmtAndPct && !haveSetIndex.includes(index))
          }
          error={currentIndex.level2 === index ? judgeAmtAndPct : null}
          value={rewardConfs[index]?.reward ?? ''}
          onChange={(val: number) => {
            handleChangeReward('reward', val, 'level2');
            setHaveSetIndex((prevState) => [...prevState, index]);
          }}
        />
      </div>
      <div className="h-full w-[200px] text-base">
        <Input
          type={'text'}
          placeholder={`P${index + 1} = E${index + 1}/R${index + 1}`}
          onChange={() => null}
          disable={!allPossiblity[index] || judgePossibility || judgeAmtAndPct}
          value={
            allPossiblity[index]
              ? (allPossiblity[index] * 100).toFixed(4) + '%'
              : ''
          }
        />
      </div>
    </div>
  );
};

const DistributorPage = () => {
  const [label, setLabel] = useState<string>('');
  const [rewardConfs, setRewardConfs] = useState<RewardConfig[]>([]);

  const [shareRatio, setShareRatio] = useState<string>('');

  const getPossibility = useRewardPossibility();

  const [rewardNum, setRewardNum] = useState<number | undefined>(undefined);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [currentIndex, setCurrentIndex] = useState<levelType>({
    level1: undefined,
    level2: undefined,
  });

  const [swapId, setSwapId] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [allPossiblity, setAllPossiblity] = useState([]);
  const [poolSize, setPoolSize] = useState(0);
  const [tablePopupVisible, setTablePopupVisible] = React.useState(false);
  const poolJkpt = usePoolJkpt();
  const prizeItems = useMemo(
    () =>
      rewardConfs.map((item, index) => {
        const ratio = 1 - parseFloat(shareRatio.replace('%', '')) / 100;

        const prize =
          item.type === RewardType.Fixed
            ? item.reward * ratio
            : item.reward * Number(poolJkpt) * ratio * 0.01;
        return {
          possibility: allPossiblity[index],
          prize,
          isFixedReward: item.type === RewardType.Fixed,
        };
      }),
    [allPossiblity, poolJkpt, rewardConfs, shareRatio]
  );

  const initalRewards = useCallback(() => {
    const rewards = Array(rewardNum)
      .fill(0)
      .map(() => ({
        expectation: undefined,
        type: undefined,
        reward: undefined,
      }));

    setRewardConfs(rewards as []);
  }, [rewardNum]);
  useEffect(() => {
    // 当 rewardNum 变化时，初始化 rewardConfs
    initalRewards();
  }, [initalRewards]);

  const judgeToStep2 = useMemo(() => {
    return !!(label && shareRatio && rewardNum && label.length < 256);
  }, [label, shareRatio, rewardNum]);

  const totalExpectation = useMemo(
    () =>
      rewardConfs.reduce((sum, conf) => {
        return sum + (conf.expectation || 0);
      }, 0),
    [rewardConfs]
  );

  //对单个期望判定，影响level1
  const judgeCurrentExpectation = useCallback(
    (index: number) => {
      const expectation = rewardConfs[index]?.expectation;
      if (expectation === undefined) return null;
      else if (expectation < 0) return ConfigError.NegativeValue;

      if (totalExpectation >= 8) {
        return ConfigError.ExpectationExceedLimit;
      }
      return null;
    },
    [rewardConfs, totalExpectation]
  );

  const judgeCurrentType = useCallback(
    (index: number) => {
      return Boolean(rewardConfs[index]?.type);
    },
    [rewardConfs]
  );
  //对整体期望判定，影响level2
  const judgeExpectation = useMemo(() => {
    let totalExpectation = 0;

    for (const conf of rewardConfs) {
      const expectation = conf.expectation;

      if (expectation === undefined) return true;

      // 检查 expectation 是否存在且是有效数字
      if (isNaN(expectation)) {
        return true;
      }

      // 检查 expectation 是否在 0-8 范围内
      if (expectation < 0 || expectation > 8) {
        return true;
      }

      totalExpectation += expectation;
    }

    // 检查总和是否小于 8
    return !(totalExpectation < 8);
  }, [rewardConfs]);

  const posibilitySum = useMemo(() => {
    return allPossiblity?.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
  }, [allPossiblity]);

  const judgePossibility = useMemo(() => {
    if (posibilitySum > 1) return ConfigError.PossibilityExceedLimit;
    return null;
  }, [posibilitySum]);

  const judgeAmtAndPct = useMemo(() => {
    for (const conf of rewardConfs) {
      const value = conf?.reward;
      const type = conf?.type;

      if (type === RewardType.Fixed) {
        if (value < 0.01 || value > 0.1 * poolSize) {
          return ConfigError.InvalidFixedReward;
        }
      }

      if (type === RewardType.Percentage) {
        if (value < 0.01 || value > 10) {
          return ConfigError.InvalidPercentageReward;
        }
      }
    }
    return judgePossibility;
  }, [rewardConfs, poolSize, judgePossibility]);

  const judgeFinal = useMemo(() => {
    // 检查每一个 conf 对象的 possibility 键

    return allPossiblity.some((item) => {
      // 如果 possibility 不存在，或者值为 null、undefined、空字符串，返回 true

      return item === null;
    });
  }, [allPossiblity]);

  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  useEffect(() => {
    if (isWeb3ServiceInited) {
      Web3Service.service.getPoolSize().then((res) => {
        const t = res.toString();
        const integerPart = t.slice(0, -6);
        const decimalPart = t.slice(-6);
        const resultString = `${integerPart}.${decimalPart}`;
        const resultNumber = Number(parseFloat(resultString).toFixed(6));

        setPoolSize(resultNumber);
      });
    }
  }, [isWeb3ServiceInited]);

  useEffect(() => {
    setAllPossiblity(rewardConfs.map((item) => getPossibility(item)) as []);
  }, [getPossibility, rewardConfs]);

  const handleRegisterSwap = async (
    label: string,
    rewardConfs: RewardConfig[],
    shareRatio: string
  ) => {
    setShowLoading(true);
    try {
      const args = await Web3Service.service.registerSwap({
        relatives: rewardConfs.map(
          (conf) => conf.type === RewardType.Percentage
        ),
        expectations: rewardConfs.map((conf) => conf.expectation),
        // expectations: rewardConfs.map((conf) => conf.expectation),
        // rewards: [],
        rewards: rewardConfs.map((conf) => conf.reward),
        millionthRatio: parseInt(shareRatio.replace('%', '')),
        name: label,
      });
      setSwapId(args.swapId);

      setShowShare(true);
    } catch (e) {
      console.error(e);
      setShowFeedback(true);
      setFeedbackText(e!.toString());
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center font-avenir font-normal">
      <Feedback
        isSuccess={false}
        setVisible={setShowFeedback}
        visible={showFeedback}
        text={feedbackText}
        clickModalClosable={true}
      ></Feedback>
      <Popup
        visible={showLoading}
        setVisible={setShowLoading}
        clickModalClosable={false}
      >
        <Lottie
          animationData={Loading}
          className="absolute size-64 rounded-[8px] bg-transparent sm:size-[760px]"
        />
      </Popup>
      <SharePosterPopup
        visible={showShare}
        setVisible={setShowShare}
        swapId={swapId}
        label={label}
        closeSideEffect={() => window.location.reload()}
      />
      <div className="flex h-[300px] w-full flex-col items-center bg-mainV1 text-white max-sm:hidden">
        <h1 className="mt-[42px] text-[42px] font-bold">
          Create a distributor pool
        </h1>

        {/*...........................................................*/}
        <div className="mt-[30px] flex space-x-10">
          {distributorData.map((item, index) => {
            return (
              <div key={item.text} className="flex items-center">
                <div className="flex flex-col items-center">
                  <img
                    src={item.img as string}
                    alt=""
                    className="size-[100px]"
                  />
                  <h1 className="mt-[10px] font-yahei">{item.text}</h1>
                </div>
                {index < 3 && (
                  <img
                    src={ArrowImg as string}
                    alt=""
                    className="ml-3 mr-2 h-[24px] w-[60px]"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="-mb-[1px] flex w-full flex-col items-center max-sm:bg-mainV1 sm:pt-20">
        {step === 0 && (
          <Presets
            registerSwap={handleRegisterSwap}
            nextStep={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <div className="w-[606px]">
            <h1 className="font-yahei text-[40px] font-bold">Step 1</h1>
            <div className="mt-[60px]">
              <h2 className="mb-[10px] font-bold">Pool Name</h2>
              <Input
                type="text"
                value={label}
                onChange={(label) => setLabel(label as string)}
                error={label.length > 256 ? ConfigError.MuchValue : undefined}
                placeholder="Please enter pool name"
              />
            </div>
            <div className="mt-[40px]">
              <h2 className="mb-[10px] font-bold">Number of Rewards</h2>
              <Selection
                placeholder="Enter the number of rewards you want to set"
                options={Array(MaxRatio + 1)
                  .fill(0)
                  .map((_, idx) => idx.toString())}
                initialValue={rewardNum ? rewardNum.toString() : undefined}
                disable={false}
                onChange={(value: string) => setRewardNum(Number(value))}
                // error={rewardNum ? undefined : ConfigError.EmptyValue}
              />
            </div>
            <div className="mb-[90px] mt-[40px]">
              <h2 className="mb-[10px] font-bold">
                Distributor Profit Split Ratio
              </h2>
              <Selection
                placeholder="Choose the distributor profit split ratio here"
                disable={false}
                options={Array(11)
                  .fill(0)
                  .map((_, idx) => idx.toString() + '%')}
                initialValue={shareRatio}
                onChange={(value: string) => setShareRatio(value)}
                // error={shareRatio ? undefined : ConfigError.EmptyValue}
              />
            </div>

            {/*...........................................................*/}
            <div className="flex w-full justify-end">
              <Button
                text={'Next Step'}
                disabled={!judgeToStep2}
                onClick={() => setStep(2)}
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="w-[1217px]">
            <h1 className="font-yahei text-[40px] font-bold">Step 2</h1>
            <div className="mt-[99px] w-full text-xl">
              {/* Header */}
              <div className="mb-[100px] flex w-full space-x-[50px] text-xl font-bold">
                <div className="ml-[60px] w-[107px]">Reward</div>
                <div className="flex w-[200px] items-center space-x-[10px]">
                  <span> Expectations</span>
                  <Tooltip>
                    <span className="absolute bottom-[20px] left-2 w-[150px] rounded-lg px-3 py-2">
                      When a user draws a lottery with 10 USD, 2 USD will be
                      deducted by the distributor. Among the remaining 8 USD,
                      you need to set how many will be used to win the current
                      reward.{' '}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex w-[200px] items-center space-x-[10px]">
                  <span> Type</span>
                  <Tooltip>
                    <span className="absolute bottom-[20px] left-2 w-[150px] rounded-lg px-3 py-2">
                      Select the type of reward: fixed USD amount or percentage
                      of the prize pool.{' '}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex w-[200px] items-center space-x-[10px]">
                  <span> Amt/Pct</span>
                  <Tooltip>
                    <span className="absolute bottom-[20px] left-2 w-[150px] rounded-lg px-3 py-2">
                      Enter a fixed USD amount or a percentage of the prize pool
                      based on the selected prize type.{' '}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex w-[200px] items-center space-x-[10px]">
                  <span> Possibility</span>
                  <Tooltip>
                    <span className="absolute bottom-[20px] left-2 w-[150px] rounded-lg px-3 py-2">
                      Corresponding to the set expectation, the probability of
                      winning the current reward.{' '}
                    </span>
                  </Tooltip>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-[100px]">
                {[...Array(rewardNum)].map((_, index) => (
                  <RewardRow
                    key={index}
                    index={index}
                    rewardConfs={rewardConfs}
                    setRewardConfs={setRewardConfs}
                    judgeExpectation={judgeExpectation}
                    setRewardNum={setRewardNum}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    judgeCurrentExpectation={judgeCurrentExpectation}
                    judgeCurrentType={judgeCurrentType}
                    judgeAmtAndPct={judgeAmtAndPct}
                    allPossiblity={allPossiblity}
                    posibilitySum={posibilitySum}
                    judgePossibility={judgePossibility}
                    judgeFinal={judgeFinal}
                  />
                ))}
                <RewardRow
                  index={rewardNum}
                  isDefault={true}
                  judgePossibility={judgePossibility}
                  judgeFinal={judgeFinal}
                  posibilitySum={posibilitySum}
                  judgeAmtAndPct={judgeAmtAndPct}
                />
              </div>
              <div className="mb-[54px] ml-[220px] mt-[10px] flex w-full text-base">
                100 EXP will be given to all the players who didn't win the
                reward set by the distributor.
              </div>
              <Button
                text={'Add Reward'}
                disabled={rewardNum! > 9}
                onClick={() => setRewardNum(rewardNum! + 1)}
              />
              <div className="flex w-full justify-end space-x-[50px] pt-[100px]">
                <Button
                  text={'Back to Step 1'}
                  theme={'primary'}
                  onClick={() => {
                    setStep(1);
                    initalRewards();
                  }}
                />
                <Button
                  text={'Generate Preview'}
                  disabled={
                    (judgeFinal ||
                      judgePossibility ||
                      judgeAmtAndPct) as boolean
                  }
                  onClick={() => setTablePopupVisible(true)}
                />
              </div>
            </div>
          </div>
        )}
      </div>{' '}
      <Popup
        visible={tablePopupVisible}
        setVisible={setTablePopupVisible}
        clickModalClosable={false}
      >
        <div className="relative flex w-[502px] flex-col rounded-2xl bg-white p-10 text-left">
          <span className="mb-10 ml-4 mt-[7px] text-xl font-bold">{label}</span>
          <PrizeTable items={prizeItems} isDistributor={true} />
          <div className="ml-4 mt-10 font-bold">
            Distributor Profit Split Ratio:{' '}
            <span className="text-[#3370FF]">{shareRatio}</span>
          </div>
          <div className="mt-[60px] flex w-full justify-end space-x-10">
            <Button
              text={'Back to edit'}
              theme={'edit'}
              onClick={() => setTablePopupVisible(false)}
            />
            <Button
              text={'Submit'}
              theme={'submit'}
              onClick={() => {
                setTablePopupVisible(false);
                handleRegisterSwap(label, rewardConfs, shareRatio);
              }}
            />
          </div>
        </div>
      </Popup>
      <div className="mb-[90px] mt-[180px] flex h-[66px] w-full justify-end max-sm:hidden">
        <button
          className="mr-[80px] flex hidden rounded-full border border-white/5 bg-gradient-to-b from-white/50 to-white/25 py-5 pl-10 pr-[30px] text-xl font-bold backdrop-blur-md"
          style={{
            boxShadow:
              '0px 1px 0px 0px rgba(0, 0, 0, 0.05), 0px 4px 4px 0px rgba(0, 0, 0, 0.05), 0px 10px 10px 0px rgba(0, 0, 0, 0.10)',
          }}
        >
          User Tutorial
          <i className="iconfont arrow-top-right ml-[18px] text-sm" />
        </button>
      </div>
    </div>
  );
};

export default DistributorPage;
