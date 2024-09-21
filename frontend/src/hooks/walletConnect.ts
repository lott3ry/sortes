import { useConnectWallet } from '@web3-onboard/react';
import { useCallback } from 'react';
import { Web3Service } from '../services/web3.ts';

const useWalletConnect = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const handleConnect = useCallback(() => {
    connect()
      .then(() => {
        if (wallet) {
          Web3Service.init(wallet);
        }
      })
      .catch((error) => {
        console.error('Connection failed:', error);
      });

    setTimeout(() => {
      const style = document.createElement('style');
      style.innerHTML = 'section.fixed { z-index: 9999; }';
      const onboardElm = document.querySelector('onboard-v2');
      if (onboardElm !== null) {
        onboardElm.shadowRoot?.appendChild(style);
      }
    }, 0);
  }, [connect, wallet]); // 这里只依赖于 connect

  return {
    wallet,
    connecting,
    handleConnect,
    disconnect,
  };
};

export default useWalletConnect;
