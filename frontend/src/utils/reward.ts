import { BigNumber } from 'ethers';
import { RewardType } from '../hooks/pool';
import { SwapDetail } from '../services/web3';
import { isNitrogenVersion } from './env';

export enum RewardUnits {
  JKPT = 'JKPT',
  XEXP = 'EXP',
}

export interface Reward {
  level: number;
  unit: RewardUnits;
  value: number;
  multiplier: number;
}

export const enum Lott3ryCurrency {
  USDT = 0,
  USDC = 1,
}

// if reward wbtc value < ShowSatoshiThreshold, show as satoshi
export const ShowSatoshiThreshold = 0.001;

export const formatWbtcValue = (
  value: number,
  withUnit: boolean = false
): string => {
  if (value < ShowSatoshiThreshold) {
    return (value * 1e8).toFixed(0) + (withUnit ? ' Satoshi' : '');
  } else {
    return value.toFixed(4) + (withUnit ? ' WBTC' : '');
  }
};

export const parseReward = (
  jkptOutValue: number,
  jkptTicketValue: number,
  levels: string[],
  swapDetail: SwapDetail,
  ticketUsdValue: number = 10
): Reward[] => {
  const { rewardItems, shareRatio } = swapDetail;
  const jkptPrice = ticketUsdValue / jkptTicketValue;
  const levelsNum = levels.map((l) => parseInt(l));
  const ratio = isNitrogenVersion() ? 1 : 1 - shareRatio;

  // 最后一位表示 EXP
  const levelsNotExp = levelsNum.filter((l) => l !== rewardItems.length);

  const fixedPrizesTotal = levelsNotExp
    .filter((l) => rewardItems[l].type === RewardType.Fixed)
    .reduce(
      (total, cur) =>
        total + parseFloat(rewardItems[cur].amount) / 1e6 / jkptPrice,
      0
    );

  const relativePrizesTotal = jkptOutValue - fixedPrizesTotal;
  const relativePrizesAmountTotal = levelsNotExp
    .filter((l) => rewardItems[l].type === RewardType.Percentage)
    .reduce(
      (total, cur) => total + parseFloat(swapDetail.rewardItems[cur].amount),
      0
    );
  const results = levels
    .map((l) => parseInt(l))
    .map((level) => {
      if (level === rewardItems.length)
        return { unit: RewardUnits.XEXP, value: 100, level, multiplier: 0 };
      else {
        const rewardItem = rewardItems[level];
        if (rewardItem.type === RewardType.Fixed) {
          const rewardUsdValue =
            (parseFloat(swapDetail.rewardItems[level].amount) * ratio) / 1e6;
          return {
            unit: RewardUnits.JKPT,
            value: rewardUsdValue / jkptPrice,
            level,
            multiplier: Math.floor(rewardUsdValue / ticketUsdValue),
          };
        } else if (rewardItem.type === RewardType.Percentage) {
          const rewardJkptValue =
            ((parseFloat(swapDetail.rewardItems[level].amount) * ratio) /
              relativePrizesAmountTotal) *
            relativePrizesTotal;
          return {
            unit: RewardUnits.JKPT,
            value: rewardJkptValue,
            level,
            multiplier: Math.floor(rewardJkptValue / jkptPrice),
          };
        }
        throw new Error('Unknown reward level');
      }
    });
  return results as Reward[];
};

export interface FulfilledLotteryResult {
  exists: boolean;
  fullied: boolean;
  player: string;
  quantity: BigNumber;
  randomWord: BigNumber;
  requestId: BigNumber;
  rewardLevels: BigNumber[];
  swapId: BigNumber;
  usdIn: BigNumber;
  usdType: Lott3ryCurrency;
  wbtcFee: BigNumber;
  wbtcOut: BigNumber;
  wbtcTicket: BigNumber;
  xexpOut: BigNumber;
}
