import { useCallback, useEffect, useMemo, useState } from 'react';
import { SwapDetail, Web3Service } from '../services/web3';
import { web3ServiceInitedAtom } from '../atoms/web3';
import { useAtomValue } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import {
  EthDenverSwapId,
  HardcodeEthDenverPoolName,
} from '../constants/config';
import { chainAtom } from '../atoms/chain';
import { chainInfoMap, isNitrogenVersion } from '../utils/env';

export enum RewardType {
  Fixed = 'Fixed',
  Percentage = 'Percentage',
}
export interface RewardConfig {
  type: RewardType;
  reward: number;
  expectation: number;
}

export const useXbitPrice = () => {
  const [xbitPrice, setXbitPrice] = useState<number | null>(null);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const chainId = useAtomValue(chainAtom);

  const loadPrice = useCallback(async () => {
    if (!isWeb3ServiceInited) return;
    const [xbitSupply, poolJkpt] = await Promise.all([
      Web3Service.service.getSupply('xbit'),
      Web3Service.service.getBalance(
        'jkpt',
        Web3Service.service.tokens!.xbit.address
      ),
    ]);
    if (xbitSupply !== null && poolJkpt !== null) {
      const [jkpt, xbit] = [parseFloat(poolJkpt), parseFloat(xbitSupply)];
      const price = xbit === 0 ? 1 : jkpt / xbit;
      setXbitPrice(price);
    }
  }, [isWeb3ServiceInited]);

  useEffect(() => {
    loadPrice();
  }, [loadPrice, chainId]);

  return xbitPrice;
};

export const usePoolJkpt = () => {
  const [poolJkpt, setPoolJkpt] = useState<string | null>(null);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const chainId = useAtomValue(chainAtom);

  const loadPoolJkpt = useCallback(async () => {
    if (!isWeb3ServiceInited) return;
    const poolJkpt = await Web3Service.service.getBalance(
      'jkpt',
      Web3Service.service.tokens!.xbit.address
    );
    setPoolJkpt(poolJkpt);
  }, [isWeb3ServiceInited]);

  useEffect(() => {
    loadPoolJkpt();
  }, [loadPoolJkpt, chainId]);

  return Number(poolJkpt).toFixed(4).toString();
};

export const useRewardPossibility = () => {
  const poolJkpt = usePoolJkpt();
  const jkptPrice = useJkptPrice();

  const getPossibility = useCallback(
    (conf: Partial<RewardConfig>) => {
      const { expectation, reward, type } = conf;
      if (expectation === undefined || reward === undefined) return null;
      if (type === RewardType.Fixed) return expectation / reward;
      else {
        if (isNaN(Number(poolJkpt)) || !jkptPrice) return null;
        return (expectation / (Number(poolJkpt) * jkptPrice * reward)) * 100;
      }
    },
    [jkptPrice, poolJkpt]
  );

  return getPossibility;
};

export const useJkptPrice = () => {
  const [jkptPrice, setJkptPrice] = useState<number | null>(null);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const chainId = useAtomValue(chainAtom);

  const loadJkptPrice = useCallback(async () => {
    if (!isWeb3ServiceInited) return null;
    const price = await Web3Service.service.getJkptPrice();
    setJkptPrice(price);
  }, [isWeb3ServiceInited]);

  useEffect(() => {
    loadJkptPrice();
  }, [loadJkptPrice, chainId]);

  return jkptPrice;
};

export const useSwapId = () => {
  const [searchParams] = useSearchParams();
  const swapId = searchParams.get('swap');
  const chainId = useAtomValue(chainAtom);

  if (!swapId) return chainInfoMap[chainId].defaultSwapId || '1';
  else if (swapId.toLowerCase() === HardcodeEthDenverPoolName.toLowerCase())
    return EthDenverSwapId;
  return swapId;
};

const f = parseFloat;
export const usePrizeItems = (swapDetail: SwapDetail | null) => {
  const poolJkpt = usePoolJkpt();
  const jkptPrice = useJkptPrice();
  const prizeItems = useMemo(() => {
    if (!jkptPrice || !poolJkpt || !swapDetail) return [];
    return swapDetail.rewardItems.map((r) => {
      const ratio = isNitrogenVersion() ? 1 : 1 - swapDetail.shareRatio;
      const prize =
        r.type === RewardType.Fixed
          ? (f(r.amount) * ratio) / 1e6
          : (f(r.amount) * f(poolJkpt) * ratio) / 1e6;

      const possibility =
        r.type === RewardType.Fixed
          ? f(r.expectation) / f(r.amount)
          : f(r.expectation) / (f(poolJkpt) * jkptPrice! * f(r.amount));

      return {
        prize,
        possibility,
        isFixedReward: r.type === RewardType.Fixed,
      };
    });
  }, [jkptPrice, poolJkpt, swapDetail]);
  return prizeItems;
};
