import { useAtomValue } from 'jotai';
import { web3ServiceInitedAtom } from '../../atoms/web3';
import { usePoolJkpt } from '../../hooks/pool';
import { SwapDetail, Web3Service } from '../../services/web3';
import { getJkpt } from '../../utils/env';
import JkptIcon from '../../components/jkpt/Icon';
import GradientText from './GradientText';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import PoolSelector from './PoolSelector';

interface JackpotProps {
  swapDetail: SwapDetail | null;
}

const Jackpot: React.FC<JackpotProps> = ({ swapDetail }) => {
  const [poolSelectorVisible, setPoolSelectorVisible] = useState(false);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const [swaps, setSwaps] = useState<SwapDetail[]>([]);

  const fetchSwaps = useCallback(async () => {
    if (!swapDetail) return;
    const swaps = await Web3Service.service.listSwaps(swapDetail.owner);
    setSwaps(swaps);
  }, [swapDetail]);

  useEffect(() => {
    fetchSwaps();
    const hideDropdown = (e: MouseEvent) => {
      if (e.target === document.getElementById('pool-selector')) {
        e.stopPropagation();
        return;
      }
      setPoolSelectorVisible(false);
    };
    document.addEventListener('click', hideDropdown);
    return () => document.removeEventListener('click', hideDropdown);
  }, [fetchSwaps]);

  const poolJkpt = usePoolJkpt();
  const jkpt = getJkpt();

  if (!isWeb3ServiceInited || !swapDetail) return null;

  return (
    <div className="flex items-center justify-between text-white max-sm:flex-col">
      <span className="flex items-center text-left text-2xl max-sm:mt-4 max-sm:w-full max-sm:text-lg">
        <GradientText>{swapDetail.name}</GradientText>
        <span
          id="pool-selector"
          onClick={(e: SyntheticEvent) => {
            e.stopPropagation();
            setPoolSelectorVisible(!poolSelectorVisible);
          }}
          className="ml-2.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-link text-center sm:h-7 sm:w-7"
        >
          <i
            className={
              'iconfont icon-chevron-up inline-block text-[6px] text-white sm:text-[8px] ' +
              (poolSelectorVisible ? '-mt-.5' : 'mt-0.5 rotate-180')
            }
          ></i>
        </span>
        <span
          className="absolute sm:relative"
          onClick={() => setPoolSelectorVisible(false)}
        >
          {poolSelectorVisible && swaps.length && (
            <PoolSelector currentSwap={swapDetail} swaps={swaps} />
          )}
        </span>
      </span>
      <div className="flex text-2xl max-sm:mt-1 max-sm:w-full max-sm:text-base max-sm:font-medium">
        <span className="flex flex-1 items-center">
          <JkptIcon />
          <span className="mx-2 text-[#FFA41B]">Pool</span>
          <span className="mr-3 text-primary">
            <GradientText>
              {poolJkpt} {jkpt.toUpperCase()}
            </GradientText>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Jackpot;
