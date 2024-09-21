import { useWallets } from '@web3-onboard/react';
import { getUserAvatar } from '../utils/avatarGenerator';
import { useAtomValue } from 'jotai';
import { web3ServiceInitedAtom } from '../atoms/web3';

export const useCurrentUser = () => {
  const [wallet] = useWallets();
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);

  if (!wallet || !isWeb3ServiceInited) {
    return { address: undefined, avatar: getUserAvatar('undefined') };
  } else {
    return {
      address: wallet.accounts[0].address,
      avatar: getUserAvatar(wallet.accounts[0].address),
    };
  }
};
