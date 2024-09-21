import { useAtomValue } from 'jotai';
import { currentChainInfo, isNitrogenVersion } from '../utils/env';
import { web3ServiceInitedAtom } from '../atoms/web3';
import { useCallback, useEffect, useState } from 'react';
import { Web3Service } from '../services/web3';
import { formatUnits } from 'ethers/lib/utils';

const DefaultProfit = {
  usdc: 0,
  usdt: 0,
  jkpt: 0,
};

const useClaimer = () => {
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const [totalProfit, setTotalProfit] = useState(DefaultProfit);
  const [claimedProfit, setClaimedProfit] = useState(DefaultProfit);
  const [unclaimedProfit, setUnclaimedProfit] = useState(DefaultProfit);

  const loadCalimer = useCallback(async () => {
    if (!isWeb3ServiceInited) {
      setClaimedProfit(DefaultProfit);
      setUnclaimedProfit(DefaultProfit);
      setTotalProfit(DefaultProfit);
      return;
    }
    const xbit = Web3Service.service.contracts?.xbit;

    await Promise.all([
      xbit?.getTotalRewardFee(),
      xbit?.getRemainingRewardFee(),
    ]).then(([claimed, unclaimed]) => {
      console.log('claimed', claimed);
      console.log('unclaimed', unclaimed);
      const jkptDecimal = currentChainInfo().tokens.jkpt.decimal;
      const usdtDecimal = currentChainInfo().tokens.usdt.decimal;
      const usdcDecimal = currentChainInfo().tokens.usdc.decimal;

      let claimedProfit, unclaimedProfit, totalProfit;

      if (!isNitrogenVersion()) {
        claimedProfit = {
          ...DefaultProfit,
          jkpt: Number(formatUnits(claimed, jkptDecimal)),
        };
        unclaimedProfit = {
          ...DefaultProfit,
          jkpt: Number(formatUnits(unclaimed, jkptDecimal)),
        };
        totalProfit = {
          ...DefaultProfit,
          jkpt: claimedProfit.jkpt + unclaimedProfit.jkpt,
        };
      } else {
        claimedProfit = {
          ...DefaultProfit,
          usdc: Number(formatUnits(claimed.usdcFee, usdcDecimal)),
          usdt: Number(formatUnits(claimed.usdtFee, usdtDecimal)),
        };
        unclaimedProfit = {
          ...DefaultProfit,
          usdc: Number(formatUnits(unclaimed.usdcFee, usdcDecimal)),
          usdt: Number(formatUnits(unclaimed.usdtFee, usdtDecimal)),
        };
        totalProfit = {
          ...DefaultProfit,
          usdc: claimedProfit.usdc + unclaimedProfit.usdc,
          usdt: claimedProfit.usdt + unclaimedProfit.usdt,
        };
      }

      setClaimedProfit(claimedProfit);
      setUnclaimedProfit(unclaimedProfit);
      setTotalProfit(totalProfit);
    });
  }, [isWeb3ServiceInited]);

  const claim = useCallback(async () => {
    if (!isWeb3ServiceInited) return;
    const result = await Web3Service.service.claimReward();
    console.log('claimRemaining', result);
  }, [isWeb3ServiceInited]);

  useEffect(() => {
    loadCalimer();
  }, [loadCalimer]);

  return { totalProfit, claimedProfit, unclaimedProfit, loadCalimer, claim };
};
export default useClaimer;
