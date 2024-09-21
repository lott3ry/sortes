import { useCallback, useState } from 'react';
import { useLottery } from '../../../hooks/lottery';
import { SwapDetail } from '../../../services/web3';
import { Popup, PopupProps } from '../../../components/Modal/Popup';
import { useUsdcBalance, useUsdtBalance } from '../../../hooks/balance.ts';
import { Lott3ryCurrency } from '../../../utils/reward.ts';

import IconUSDC from '../../../assets/icons/icon-USDC.png';
import IconUSDT from '../../../assets/icons/icon-USDT2.png';
import Insufficient from '../../../assets/svg/lott/Insufficient.svg';
import Sufficient from '../../../assets/svg/lott/Sufficient.svg';
import { formatUSD } from '../../../utils/format.ts';

interface ChooseCurrencyPopupProps extends PopupProps {
  swapDetail: SwapDetail | null;
  totalAmount: number;
}

const ChooseCurrencyPopup: React.FC<ChooseCurrencyPopupProps> = ({
  swapDetail,
  totalAmount,
  visible,
  setVisible,
}) => {
  const { lottery } = useLottery();
  const [currency, setCurrency] = useState<Lott3ryCurrency | null>(null);

  const handleLottery = useCallback(
    (swapDetail: SwapDetail | null, defaultCurrecy?: number) => {
      if (!swapDetail) return;
      const effectiveCurrency = currency ?? defaultCurrecy;
      currency !== null ? currency : defaultCurrecy;

      if (effectiveCurrency === null) return;
      lottery(totalAmount.toString(), swapDetail, effectiveCurrency);

      setVisible(false);
      setCurrency(null);
    },
    [currency, lottery, totalAmount, setVisible]
  );

  const { usdtBalance } = useUsdtBalance();
  const { usdcBalance, isUsdcSupported } = useUsdcBalance();

  const isUsdtSufficient = Number(usdtBalance) >= totalAmount;
  const isUsdcSufficient = Number(usdcBalance) >= totalAmount;
  const isBalanceSufficient =
    isUsdtSufficient || (isUsdcSupported && isUsdcSufficient);

  const resetStates = () => {
    setCurrency(null);
    setVisible(false);
  };

  return (
    <Popup
      visible={visible}
      setVisible={setVisible}
      closeSideEffect={() => setCurrency(null)}
    >
      <div
        style={{ boxShadow: '0 4px 4px #00000040' }}
        className="flex max-w-[695px] flex-col rounded-xl bg-white px-9 py-9 font-normal max-sm:max-w-[calc(100svw-48px)] max-sm:p-4"
      >
        {!isBalanceSufficient ? (
          <>
            <span className="flex flex-col">
              <span className="mb-[30px] text-left text-4xl font-bold">
                Insufficient Balance
              </span>
            </span>

            <span className="mb-[40px] w-full text-left font-yahei text-xl leading-9">
              <p>
                Sorry, Sortes only supports payments in USDT and USDC currently,
                but your balance is insufficient.
              </p>

              <p>You can go to Uniswap to swap or recharge.</p>
            </span>

            <span className="flex justify-end space-x-6 max-sm:space-x-8">
              <button
                className="border-1 rounded-[0.5rem] border border-[#3370FF] px-4 py-2 text-[#3370FF]"
                onClick={resetStates}
              >
                Cancel
              </button>
              <button
                className="rounded-[0.5rem] bg-[#3370FF] px-4 py-2 font-bold text-white"
                onClick={() => {
                  resetStates();
                  window.open('https://app.uniswap.org/swap', '_blank');
                }}
              >
                Go to Uniswap
              </button>
            </span>
          </>
        ) : (
          <>
            <span className="flex flex-col text-left text-base sm:text-4xl">
              <span className="mb-3 font-bold">
                Ticket Amount:&nbsp;
                <span className="text-[#1BA27A]">{formatUSD(totalAmount)}</span>
              </span>
              <span className="mb-4 text-nowrap max-sm:font-bold sm:mb-7">
                Choose the payment currency
              </span>
            </span>

            <span className="w-full text-left font-yahei text-sm sm:text-xl">
              Please choose your payment currency for this draw from below. More
              payment methods will be supported in the future.
            </span>
            <span className="mt-9 flex justify-start space-x-6 max-sm:space-x-8">
              {isUsdcSupported && (
                <button
                  className={`border-1 group relative flex items-center rounded-[0.5rem] border border-[#3370FF] p-2.5 sm:px-4 sm:py-2 ${
                    currency === Lott3ryCurrency.USDC
                      ? 'bg-[#ebf1ff]'
                      : isUsdcSufficient
                        ? ''
                        : 'border-none bg-[#F5F5F5]'
                  }`}
                  onClick={() =>
                    isUsdcSufficient && setCurrency(Lott3ryCurrency.USDC)
                  }
                >
                  <img
                    src={IconUSDC}
                    alt=""
                    className="mr-2 size-6 sm:size-[34px]"
                  />
                  <span className="font-yahei max-sm:text-sm">USDC</span>
                  <img
                    className="absolute -right-[0.8px] -top-[0.8px]"
                    src={isUsdcSufficient ? Sufficient : Insufficient}
                    alt=""
                  />
                  <div className="absolute -right-[7rem] -top-[2.2rem] text-nowrap rounded bg-[#F8F8F8] px-[6px] py-2 text-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {isUsdcSufficient
                      ? 'Sufficient balance'
                      : 'Insufficient balance'}
                  </div>
                </button>
              )}
              <button
                className={`border-1 group relative flex items-center rounded-[0.5rem] border border-[#3370FF] p-2.5 sm:px-4 sm:py-2 ${
                  currency === Lott3ryCurrency.USDT
                    ? 'bg-[#ebf1ff]'
                    : isUsdtSufficient
                      ? ' '
                      : 'border-none bg-[#F5F5F5]'
                }`}
                onClick={() =>
                  isUsdtSufficient && setCurrency(Lott3ryCurrency.USDT)
                }
              >
                <img
                  src={IconUSDT}
                  alt=""
                  className="mr-2 size-6 sm:size-[34px]"
                />
                <span className="font-yahei max-sm:text-sm">USDT</span>
                <img
                  className="absolute -right-[0.8px] -top-[0.8px]"
                  src={isUsdtSufficient ? Sufficient : Insufficient}
                  alt=""
                />
                <div className="absolute -right-[7rem] -top-[2.2rem] text-nowrap rounded bg-[#F8F8F8] px-[6px] py-2 text-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {isUsdtSufficient
                    ? 'Sufficient balance'
                    : 'Insufficient balance'}
                </div>
              </button>
            </span>
            <span className="mt-8 flex justify-end space-x-6 max-sm:space-x-5 max-sm:text-sm">
              <button
                className="border-1 rounded-[0.5rem] border border-[#3370FF] px-4 py-2 text-[#3370FF]"
                onClick={resetStates}
              >
                Cancel
              </button>
              <button
                className={`rounded-[0.5rem] bg-[#3370FF] px-2 py-1 font-bold text-white sm:px-4 sm:py-2 ${currency === undefined && 'bg-[#3370FF]/50'}`}
                onClick={() => handleLottery(swapDetail)}
              >
                Confirm
              </button>
            </span>
          </>
        )}
      </div>
    </Popup>
  );
};

export default ChooseCurrencyPopup;
