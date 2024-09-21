import { useCallback, useEffect, useState } from 'react';
import { Web3Service } from '../services/web3';
import { useCurrentUser } from './user';
import { useAtomValue } from 'jotai';
import { web3ServiceInitedAtom } from '../atoms/web3';
import { chainAtom } from '../atoms/chain';

export const useJkptBalance = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const chainId = useAtomValue(chainAtom);
  const { address } = useCurrentUser();

  const loadBalance = useCallback(async () => {
    if (!address || !isWeb3ServiceInited) return;
    const balance = await Web3Service.service.getBalance('jkpt', address);
    setBalance(balance);
  }, [address, isWeb3ServiceInited]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance, chainId]);

  return { balance, loadBalance };
};

export const useXbitBalance = () => {
  const [xbitBalance, setXbitBalance] = useState<string | null>(null);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const chainId = useAtomValue(chainAtom);
  const { address } = useCurrentUser();

  const loadXbitBalance = useCallback(async () => {
    if (!address || !isWeb3ServiceInited) return;
    const xbit = await Web3Service.service.getBalance('xbit', address);
    setXbitBalance(xbit);
  }, [address, isWeb3ServiceInited]);

  useEffect(() => {
    loadXbitBalance();
  }, [loadXbitBalance, chainId]);

  return { xbitBalance, loadXbitBalance };
};

export const useXexpBalance = () => {
  const [xexpBalance, setXexpBalance] = useState<string | null>(null);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const chainId = useAtomValue(chainAtom);
  const { address } = useCurrentUser();

  const loadXexpBalance = useCallback(async () => {
    if (!address || !isWeb3ServiceInited) return;
    const xexp = await Web3Service.service.getBalance('xexp', address);
    setXexpBalance(xexp);
  }, [address, isWeb3ServiceInited]);

  useEffect(() => {
    loadXexpBalance();
  }, [loadXexpBalance, chainId]);

  return { xexpBalance, loadXexpBalance };
};

export const useUsdtBalance = () => {
  const [usdtBalance, setUsdtBalance] = useState<string | null>(null);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const chainId = useAtomValue(chainAtom);
  const { address } = useCurrentUser();

  const loadUsdtBalance = useCallback(async () => {
    if (!address || !isWeb3ServiceInited) return;
    const usdt = await Web3Service.service.getBalance('usdt', address);
    setUsdtBalance(usdt);
  }, [address, isWeb3ServiceInited]);

  useEffect(() => {
    loadUsdtBalance();
  }, [loadUsdtBalance, chainId]);

  return { usdtBalance, loadUsdtBalance };
};
export const useUsdcBalance = () => {
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [isUsdcSupported, setIsUsdcSupported] = useState<boolean>(true);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const chainId = useAtomValue(chainAtom);
  const { address } = useCurrentUser();

  const loadUsdcBalance = useCallback(async () => {
    if (!address || !isWeb3ServiceInited) return;
    try {
      const usdc = await Web3Service.service.getBalance('usdc', address);
      setUsdcBalance(usdc);
      setIsUsdcSupported(true);
    } catch (error) {
      setUsdcBalance(null);
      setIsUsdcSupported(false);
    }
  }, [address, isWeb3ServiceInited]);

  useEffect(() => {
    loadUsdcBalance();
  }, [loadUsdcBalance, chainId]);

  return { usdcBalance, loadUsdcBalance, isUsdcSupported };
};
