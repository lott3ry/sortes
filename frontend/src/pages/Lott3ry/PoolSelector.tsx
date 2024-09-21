import { SwapDetail } from '../../services/web3';
import { Link } from 'react-router-dom';

interface PoolSelectorProps {
  currentSwap: SwapDetail;
  swaps: SwapDetail[];
}

const PoolSelector: React.FC<PoolSelectorProps> = ({ currentSwap, swaps }) => {
  return (
    <ul className="absolute left-0 top-4 z-10 gap-y-2 rounded-2xl border border-[4px] border-link bg-white px-4 py-2 text-base font-normal text-text1 sm:-left-6 sm:top-4">
      {swaps.map((swap) => (
        <li key={swap.id} className="rounded-lg p-2.5 hover:bg-link/10">
          <Link
            to={`/play?swap=${swap.id}`}
            className="flex items-center justify-between"
          >
            <span className="mr-4 max-w-56 truncate sm:max-w-72">
              {swap.name}
            </span>
            {currentSwap.id.toString() === swap.id.toString() && (
              <i className="iconfont icon-check text-[#7B61FF]"></i>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PoolSelector;
