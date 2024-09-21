import { useAtomValue } from 'jotai';
import { web3ServiceInitedAtom } from '../../../atoms/web3';
import { useUsdcBalance, useUsdtBalance } from '../../../hooks/balance';
import { formatUSD } from '../../../utils/format';

const BalanceComp: React.FC = () => {
  const { usdtBalance } = useUsdtBalance();
  const { usdcBalance } = useUsdcBalance();

  return (
    <div className="flex items-center py-2 text-left text-2xl max-sm:mb-2 max-sm:py-0 max-sm:text-base max-sm:font-medium">
      <span className="flex w-full items-center">
        <span className="sm:text-xl">Available:</span>
        <span className="ml-4 flex-1 truncate text-[#1BA27A] max-sm:ml-2 max-sm:text-base">
          {formatUSD(Number(usdtBalance || 0) + Number(usdcBalance || 0))}
        </span>
      </span>
    </div>
  );
};

const Balance: React.FC = () => {
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  if (!isWeb3ServiceInited) return null;
  else return <BalanceComp />;
};

export default Balance;
