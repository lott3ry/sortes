import LinkBtn from './LinkBtn';
import ConnectWallet from './ConnectWallet';
import { Link, useLocation } from 'react-router-dom';
import CurrentUser from './CurrentUser';
import Notification from './Notification';
import { useWallets } from '@web3-onboard/react';
import MenuSrc from '../../assets/images/menu-mobile.png';

import SidebarMobile from './SidebarMobile';
import { useState } from 'react';
import logoWithTitle from '../../assets/svg/logo-title.svg';
import sortesLogo from '../../assets/images/sortes.png';
import { useAtomValue } from 'jotai';
import { chainAtom } from '../../atoms/chain';
import { chainInfoMap } from '../../utils/env';
import { HeaderDropdownDistributor } from './FoldBtn.tsx';

const Header = () => {
  const [renderSidebar, setRenderSidebar] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { pathname } = useLocation();
  const [wallet] = useWallets();
  const chainId = useAtomValue(chainAtom);
  return (
    <>
      <header className="sticky top-0 z-30 bg-mainV1 py-3 text-center font-bold max-sm:py-6">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between bg-mainV1 px-10 text-center text-quaternary max-sm:px-[14px]">
          {/* 大屏幕布局 */}
          <div className="flex items-center space-x-10 max-sm:hidden">
            <span className="text-2xl text-white">
              <Link to="/">
                <img
                  src={sortesLogo}
                  alt="Sortes"
                  className="h-[40px] w-[160px]"
                />
              </Link>
            </span>

            <LinkBtn
              text="Play"
              href={
                '/play?swap=' + (chainInfoMap[chainId].defaultSwapId ?? '1')
              }
              isActive={pathname.toLowerCase().includes('/play')}
            ></LinkBtn>

            <LinkBtn
              text="Miner"
              href="/miner"
              isActive={
                pathname.toLowerCase().includes('/miner') ||
                pathname.toLowerCase().includes('/pool') ||
                pathname === '/'
              }
            ></LinkBtn>
            <LinkBtn
              text="Charity"
              href="/charity"
              isActive={pathname.toLowerCase().includes('/charity')}
            ></LinkBtn>

            <HeaderDropdownDistributor></HeaderDropdownDistributor>
          </div>
          <div className="flex items-center max-sm:hidden">
            <div className="flex">
              {wallet ? <CurrentUser /> : <ConnectWallet />}
            </div>
          </div>

          {/* 移动端布局 */}
          <div className="hidden w-full items-center justify-between max-sm:flex">
            {/* 占位元素，保持布局平衡 */}
            <div className="h-6 w-6"></div>
            {/* Logo 居中 */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 transform"
            >
              <img
                src={logoWithTitle}
                alt="Sortes"
                className="h-[17px] w-[73px]"
              />
            </Link>
            {/* 菜单按钮放在右边 */}
            <button
              className="h-6 w-6"
              onClick={() => {
                if (!renderSidebar) setRenderSidebar(true);
                setSidebarVisible(true);
              }}
            >
              <img src={MenuSrc} alt="Menu" className="h-full w-full" />
            </button>
          </div>
        </div>
      </header>
      <Notification></Notification>
      {renderSidebar && (
        <SidebarMobile
          visible={sidebarVisible}
          onClose={() => {
            setSidebarVisible(false);
            setTimeout(() => setRenderSidebar(false), 300); // 假设动画持续300ms
          }}
        />
      )}
    </>
  );
};

export default Header;
