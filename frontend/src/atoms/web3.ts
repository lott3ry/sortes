import { PrimitiveAtom, atom } from 'jotai';
import { Reward } from '../utils/reward';
import { BigNumber } from 'ethers';
import { chainAtom, ChainId } from './chain';

// To mark if the web3 service is inited
export const web3ServiceInitedAtom = atom(false);

// To store the rewards and display status of the congratulation popup
export const congratulationAtom = atom<{ rewards: Reward[]; show: boolean }>({
  rewards: [],
  show: false,
});

export enum LotteryStages {
  WaitingForTrx = 0,
  WaitingForRecipt = 1,
  RequestingRandomness = 2,
  WaitingForResult = 3,
  Fulfilled = 4,
  Failed = 5,
}

export const LotteryAnimationStages = [
  'Requesting Randomness',
  'Generating Randomness',
  'Applying Randomness',
  'Completed',
];

export interface LotteryInfo {
  chainId?: ChainId;
  trxPromise?: Promise<any>;
  requestId?: BigNumber;
  startTime: number;
  stage: LotteryStages;
  startAtBlock: number;
  transactionHash?: string;
  rewards?: Reward[];
  randomness?: string;
}

const lotteryListAtom = atom<PrimitiveAtom<LotteryInfo>[]>([]);

export const getLotteryListAtom = atom((get) =>
  get(lotteryListAtom)
    .map((lotteryAtom) => get(lotteryAtom))
    .filter((lottery) => lottery.chainId === get(chainAtom))
);

export const removeLotteryAtom = atom(
  null,
  (get, set, transactionHash: string) => {
    const list = get(lotteryListAtom);
    const existedLottery = list.find(
      (l) => get(l)!.transactionHash === transactionHash
    );
    if (existedLottery) {
      set(lotteryListAtom, [
        ...get(lotteryListAtom).filter((l) => l !== existedLottery),
      ]);
    }
  }
);

export const setLotteryAtom = atom(
  null,
  (get, set, lotteries: LotteryInfo[]) => {
    const list = get(lotteryListAtom);
    const chainId = get(chainAtom);
    let listChanged = false;

    for (const lottery of lotteries) {
      const existedLottery = list.find(
        (l) =>
          (lottery.trxPromise && get(l)!.trxPromise === lottery.trxPromise) ||
          (lottery.requestId && get(l)!.requestId === lottery.requestId)
      );
      if (!existedLottery) {
        lottery.chainId = chainId;
        list.push(atom(lottery));
        listChanged = true;
      } else {
        set(existedLottery, { ...lottery });
      }
    }

    if (listChanged)
      set(
        lotteryListAtom,
        [...list].sort((a, b) => get(a)!.startTime - get(b)!.startTime)
      );
  }
);
