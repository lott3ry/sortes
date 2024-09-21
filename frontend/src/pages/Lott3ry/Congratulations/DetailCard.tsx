import {
  Reward,
  RewardUnits,
  ShowSatoshiThreshold,
  formatWbtcValue,
} from '../../../utils/reward';

import RewardIconBTC from '../../../assets/icons/icon-WBTC.png';

import RewardIconExp from '../../../assets/icons/reward-exp.png';
import RewardIconTaikoWhite from '../../../assets/icons/reward-taiko-white.png';
import RewardIconTaikoPink from '../../../assets/icons/reward-taiko-pink.png';
import RewardIconWETH from '../../../assets/icons/icon-WETH.png';
import { getJkpt } from '../../../utils/env';

function getStylesByReward(unit: RewardUnits, value: number) {
  if (unit === RewardUnits.XEXP) {
    return ['bg-white', 'text-blue0'];
  } else if (value < ShowSatoshiThreshold) {
    return ['bg-[#FFC107]', 'text-[#7B61FF]'];
  } else return ['bg-[#7B61FF]', 'text-white'];
}

interface DetailCardProps {
  reward: Reward;
  idx: number;
}

const WbtcDetailCard: React.FC<DetailCardProps> = ({
  reward: { unit, value },
  idx,
}) => {
  const [bgClz, textClz] = getStylesByReward(unit, value);
  const showSatoshi = unit === RewardUnits.JKPT && value < ShowSatoshiThreshold;
  const isExp = unit === RewardUnits.XEXP;

  return (
    <li
      className={`${bgClz} ${textClz} flex w-[328px] items-center justify-between rounded-lg px-2.5 py-2 sm:w-[190px]`}
    >
      <span className="inline-block w-14 sm:hidden">{idx + 1}.</span>
      <span className="w-36 text-left sm:w-1/2">
        +{isExp ? value.toFixed(2) : formatWbtcValue(value)}
      </span>
      <span className="flex flex-1 items-center">
        <img
          className="mr-2.5 h-5 w-5"
          src={isExp ? RewardIconExp : RewardIconBTC}
          alt={`reward-icon-${unit}`}
        />
        <span>{isExp ? 'EXP' : showSatoshi ? 'Satoshi' : 'WBTC'}</span>
      </span>
    </li>
  );
};

const TaikoDetailCard: React.FC<DetailCardProps> = ({
  reward: { unit, value, multiplier },
  idx,
}) => {
  const [bgClz, textClz, icon] = (() => {
    if (unit === RewardUnits.XEXP)
      return ['bg-white', 'text-blue0', RewardIconExp];
    else if (multiplier < 16)
      return ['bg-white', 'text-dark5', RewardIconTaikoPink];
    else if (multiplier >= 16 && multiplier < 64)
      return ['bg-[#E81899]', 'text-white', RewardIconTaikoWhite];
    return ['bg-dark5, text-white', RewardIconTaikoPink];
  })();

  const isExp = unit === RewardUnits.XEXP;

  return (
    <li
      className={`${bgClz} ${textClz} flex w-[328px] items-center justify-between rounded-lg px-2.5 py-2 sm:w-[190px]`}
    >
      <span className="inline-block w-14 sm:hidden">{idx + 1}.</span>
      <span className="w-36 text-left sm:w-24">
        +{isExp ? value.toFixed(2) : value.toFixed(4)}
      </span>
      <span className="flex flex-1 items-center">
        <img className="mr-2.5 h-5 w-5" src={icon} alt="Reward Icon" />
        <span>{isExp ? 'EXP' : 'TAIKO'}</span>
      </span>
    </li>
  );
};
const WethDetailCard: React.FC<DetailCardProps> = ({
  reward: { unit, value, multiplier },
  idx,
}) => {
  const [bgClz, textClz, icon] = (() => {
    if (unit === RewardUnits.XEXP)
      return ['bg-white', 'text-blue0', RewardIconExp];
    else if (multiplier < 16) return ['bg-white', 'text-dark5', RewardIconWETH];
    else if (multiplier >= 16 && multiplier < 64)
      return ['bg-[#627EEA]', 'text-white', RewardIconWETH];
    return ['bg-[#5C6BC0], text-white', RewardIconWETH];
  })();

  const isExp = unit === RewardUnits.XEXP;

  return (
    <li
      className={`${bgClz} ${textClz} flex w-[328px] items-center justify-between rounded-lg px-2.5 py-2 sm:w-[190px]`}
    >
      <span className="inline-block w-14 sm:hidden">{idx + 1}.</span>
      <span className="w-36 text-left sm:w-24">
        +{isExp ? value.toFixed(2) : value.toFixed(6)}
      </span>
      <span className="flex flex-1 items-center">
        <img
          className="mr-2.5 h-5 w-5 rounded-full border border-white"
          src={icon}
          alt="Reward Icon"
        />
        <span>{isExp ? 'EXP' : 'WETH'}</span>
      </span>
    </li>
  );
};

const DetailCard: React.FC<DetailCardProps> = (props) => {
  switch (getJkpt()) {
    case 'weth':
      return <WethDetailCard {...props} />;
    case 'wbtc':
      return <WbtcDetailCard {...props} />;
    default:
      return <TaikoDetailCard {...props} />;
  }
};

export default DetailCard;
