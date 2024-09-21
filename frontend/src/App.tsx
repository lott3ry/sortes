import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { init, useConnectWallet } from '@web3-onboard/react';
import { Web3Service } from './services/web3';
import { web3ServiceInitedAtom } from './atoms/web3';
import { useAtomValue, useSetAtom } from 'jotai';
import GlobalLoading from './components/Modal/GlobalLoading';
import {
  globalConfirmAtom,
  globalLoadingAtom,
  startLoadingAtom,
  stopLoadingAtom,
} from './atoms/modal';
import { useEffect, useMemo, useLayoutEffect } from 'react';
import GlobalConfirm from './components/Modal/GlobalConfirm';
import { once } from './utils/helper';
import LogoImg from './assets/images/logo.png';

import { chainInfoMap, isMobileWeb } from './utils/env';
import { CommonLayout } from './layouts/CommonLayout';
import keepkeyModule from '@web3-onboard/keepkey';
import coinbaseModule from '@web3-onboard/coinbase';
import trustModule from '@web3-onboard/trust';
import okxModule from '@web3-onboard/okx';
import injectedModule from '@web3-onboard/injected-wallets';

const coinbase = coinbaseModule();

const keepkey = keepkeyModule();
const trust = trustModule();
const okx = okxModule();

const wallets = [injectedModule(), keepkey, trust, okx, coinbase];
console.log('chainInfoMap', chainInfoMap);

const chains = Object.values(chainInfoMap).map((info) => ({
  id: '0x' + info.chainId.toString(16),
  token: 'ETH',
  label: info.name,
  rpcUrl: info.rpcUrl,
}));

const appMetadata = {
  name: 'Sortes',
  icon: LogoImg,
  logo: LogoImg,
  description: 'Fully On Chain Charitable Lottery',
};

init({
  wallets,
  chains,
  appMetadata,
  connect: {
    autoConnectLastWallet: true,
    // showSidebar: false,
  },
  accountCenter: {
    desktop: { enabled: false },
    mobile: { enabled: false },
  },
});

function App() {
  const [{ wallet }] = useConnectWallet();
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const showLoading = useAtomValue(globalLoadingAtom);
  const startLoading = useSetAtom(startLoadingAtom);
  const stopLoading = useSetAtom(stopLoadingAtom);
  const { enable: showConfirm } = useAtomValue(globalConfirmAtom);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const blocknativeLSWallet = JSON.parse(
    localStorage.getItem('onboard.js:last_connected_wallet') || '[]'
  );

  const startLoadingOnce = useMemo(() => once(startLoading), [startLoading]);
  const stopLoadingOnce = useMemo(() => once(stopLoading), [stopLoading]);

  useEffect(() => {
    // Wallet is null while localstorage is empty, means user has not connected wallet before
    // Wallet is null while localstorage is not, means user has connected wallet before but blocknative is not yet inited
    if (!wallet && blocknativeLSWallet.length !== 0 && !showLoading) {
      startLoadingOnce();
      // Web3Service is not inited
    } else if (wallet && !isWeb3ServiceInited) {
      Web3Service.init(wallet);
    } else if (showLoading) {
      stopLoadingOnce();
    }
  }, [
    blocknativeLSWallet,
    blocknativeLSWallet.length,
    wallet,
    isWeb3ServiceInited,
    navigate,
    pathname,
    showLoading,
    startLoadingOnce,
    stopLoadingOnce,
  ]);

  useLayoutEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme !== 'dark') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // console.log("wallet", wallet);
  // console.log("blocknativeLSWallet", blocknativeLSWallet);
  // console.log("isWeb3ServiceInited", isWeb3ServiceInited);

  return (
    <>
      {isMobileWeb && <GlobalLoading show={showLoading}></GlobalLoading>}
      <GlobalConfirm show={showConfirm}></GlobalConfirm>
      <Routes>
        <Route path="*" element={<CommonLayout />} />
      </Routes>
    </>
  );
}

export default App;
