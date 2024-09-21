import { useCallback, useEffect, useState } from 'react';
import config from './config';
import PresetTable from './PersetTable';
import { RewardConfig, useRewardPossibility } from '../../../hooks/pool';
import { CustomEvents } from '../../../utils/events';
import { isMobileWeb } from '../../../utils/env';

interface PresetsProps {
  nextStep: () => void;
  registerSwap: (
    label: string,
    rewardConfs: RewardConfig[],
    shareRatio: string
  ) => Promise<void>;
}

const presetNum = isMobileWeb ? 1 : 3;

const Presets = ({ registerSwap, nextStep }: PresetsProps) => {
  const [name, setName] = useState('');
  const [shareRatio, setShareRatio] = useState('0%');
  const [currentPreset, setCurrentPreset] = useState<number | null>(null);
  const [configIdx, setConfigIdx] = useState(0);
  const getPossibility = useRewardPossibility();
  const valid = currentPreset !== null && name && shareRatio;

  const resetStates = useCallback(() => {
    window.location.reload();
  }, []);

  const handleRegisterSwap = async () => {
    console.log('Register Swap');
    console.log('Name:', name);
    console.log('Share Ratio:', shareRatio);
    console.log('Current Preset:', currentPreset);
    console.log('Config Idx:', configIdx);

    await registerSwap(
      name,
      config[(configIdx + currentPreset!) % config.length],
      parseInt(shareRatio).toString()
    );
  };

  const handleExchangePreset = () => {
    setConfigIdx(configIdx + presetNum);
  };

  useEffect(() => {
    document.addEventListener(CustomEvents.ChainIdChanged, resetStates);
    return () =>
      document.removeEventListener(CustomEvents.ChainIdChanged, resetStates);
  }, [resetStates]);

  return (
    <div className="mx-auto flex flex-col text-left max-sm:px-4">
      <span className="text-4xl font-bold max-sm:hidden">
        Use presets or create custom distributor pool
      </span>
      <span className="mb-4 text-lg font-bold text-white sm:hidden">
        Use Presets Distributor Pool
      </span>
      <div className="flex w-full justify-between sm:mt-10 sm:gap-4">
        {Array(presetNum)
          .fill(0)
          .map((_, idx) => (
            <div
              key={configIdx + idx}
              onClick={() => {
                setCurrentPreset(idx);
              }}
              className="flex cursor-pointer flex-col"
            >
              <span className="text-md mb-4 h-6 w-6 rounded-full bg-white text-center text-mainV1 sm:bg-[#3370FF] sm:text-white">
                {((configIdx + idx) % config.length) + 1}
              </span>
              <PresetTable
                key={idx}
                items={config[(configIdx + idx) % config.length].map((i) => ({
                  prize: i.reward,
                  possibility: getPossibility(i) || NaN,
                  isFixedReward: i.type === 'Fixed',
                }))}
                setName={setName}
                setShareRatio={setShareRatio}
                disabled={currentPreset !== idx}
              />
            </div>
          ))}
      </div>
      <div className="mt-5 flex flex-col items-center gap-5 font-yahei text-base font-bold sm:mt-6 sm:text-lg">
        <button
          className="rounded-lg border border-border1 bg-white px-6 py-3 max-sm:w-full"
          onClick={handleExchangePreset}
        >
          <i className="iconfont icon-refresh" />
          &nbsp; Try Another Set of Presets
        </button>
        <button
          className="rounded-lg bg-[#93DC08] px-7 py-4 text-white disabled:cursor-not-allowed disabled:bg-[#93DC08]/50 disabled:text-white/50 sm:bg-[#3370FF]"
          disabled={!valid}
          onClick={() => handleRegisterSwap()}
        >
          Submit
        </button>
        <span className="text-2xl font-normal text-[#BEC2CD] max-sm:hidden">
          --------------------------- Or ---------------------------
        </span>
        <button
          className="rounded-2xl border border-border1 p-6 leading-normal text-[#3370FF] max-sm:hidden"
          onClick={nextStep}
        >
          Create Custom Distributor Pool
        </button>
      </div>
    </div>
  );
};

export default Presets;
