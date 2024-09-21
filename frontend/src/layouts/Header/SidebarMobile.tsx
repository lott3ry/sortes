import { Popup } from '../../components/Modal/Popup';
import ConnectWalletMobile from '../../components/mobile/ConnectWalletMobile.tsx';
import CollapseMobile from '../../components/mobile/CollapseMobile.tsx';
import { Link, useLocation } from 'react-router-dom';

import { chainInfoMap } from '../../utils/env.ts';
import { useAtomValue } from 'jotai/index';
import { chainAtom } from '../../atoms/chain.ts';
import { useEffect, useRef, useState } from 'react';

interface SidebarMobileProps {
  visible: boolean;
  onClose: () => void;
}
const DragToCloseThreshold = 100;
const SidebarMobile: React.FC<SidebarMobileProps> = ({ visible, onClose }) => {
  const chainId = useAtomValue(chainAtom);
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const MinimumXDrag = 50; // 定义最小X方向拖动距离

  const handleTouchStart = (event: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(event.touches[0].clientX); // 记录触摸开始时的水平位置
    setStartY(event.touches[0].clientY); // 记录触摸开始时的垂直位置
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;

    // 计算拖动角度（弧度）
    const angle = Math.atan2(diffY, diffX);
    // 将弧度转换为角度
    const angleDegrees = angle * (180 / Math.PI);

    // 检查角度是否在右上20°到右下20°之间，且X方向拖动距离至少为50px
    if (angleDegrees >= -20 && angleDegrees <= 20 && diffX >= MinimumXDrag) {
      const distance = Math.sqrt(diffX * diffX + diffY * diffY);
      if (distance > DragToCloseThreshold) {
        setIsDragging(false);
        onClose();
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false); // 确保触摸结束时停止拖拽
  };

  useEffect(() => {
    if (visible && pathname !== prevPathnameRef.current) {
      const timer = setTimeout(() => {
        onClose();
      }, 100);

      return () => clearTimeout(timer);
    }
    prevPathnameRef.current = pathname;
  }, [pathname, visible, onClose]);

  return (
    <Popup visible={visible} setVisible={onClose}>
      <div className="relative h-screen w-screen" onClick={onClose}>
        <div
          className="absolute left-[calc(100vw-340px)] top-1/2 z-30 flex h-[150px] w-[40px] -translate-y-1/2 items-center rounded-md bg-transparent"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="ml-4 h-[60px] w-[6px] bg-white"></div>
        </div>
        <div
          className="absolute right-0 top-0 h-screen w-[300px] overflow-y-auto rounded-bl-[16px] rounded-tl-[16px] bg-white px-5 pb-5 pt-10"
          onTouchStart={handleTouchStart}
          onTouchMove={(e) => {
            handleTouchMove(e);
            if (e.touches[0].clientX - startX > 100) {
              onClose();
            }
          }}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <ConnectWalletMobile onClose={onClose} />
          <CollapseMobile
            title={'Lottery'}
            href={'/play?swap=' + (chainInfoMap[chainId].defaultSwapId ?? '1')}
            isActive={pathname.toLowerCase().includes('/play')}
          />
          <CollapseMobile
            title={'Miner'}
            href="/miner"
            isActive={
              pathname.toLowerCase().includes('/miner') ||
              pathname.toLowerCase().includes('/pool') ||
              pathname === '/'
            }
          />
          <CollapseMobile title={'Distributor'}>
            <div className="flex flex-col space-y-4 px-4 text-left text-base font-semibold text-[#7D7D7D]">
              <Link
                to={'/create-distributor-pool'}
                className={`${
                  pathname.toLowerCase().includes('/create-distributor-pool')
                    ? 'text-[#475CF1]'
                    : ''
                }`}
              >
                Create Distributor Pool
              </Link>
              <Link
                to={'/distributor-profit'}
                className={`pb-4 ${
                  pathname.toLowerCase().includes('/distributor-profit')
                    ? 'text-[#475CF1]'
                    : ''
                }`}
              >
                Distributor Profit
              </Link>
            </div>
          </CollapseMobile>
        </div>
      </div>
    </Popup>
  );
};

export default SidebarMobile;
