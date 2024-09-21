import PossibilityTable from './PossibilityTable';
import Balance from './Balance';
import { DrawAmountSelection, MaxDrawAmount } from './DrawAmountSelection.tsx';
import { useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { web3ServiceInitedAtom } from '../../../atoms/web3';
import { SwapDetail } from '../../../services/web3';

import { DrawAmount } from './constant.ts';
import ChooseCurrencyPopup from './ChooseCurrencyPopup.tsx';

interface BetPanelProps {
  swapDetail: SwapDetail | null;
}

const TicketPrice = 10;

const BetPanel: React.FC<BetPanelProps> = ({ swapDetail }) => {
  const [drawAmount, setDrawAmount] = useState<number>(DrawAmount.OneTicket);
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);
  const [choosePaymentVisable, setChoosePaymentVisable] = useState(false);

  const valid = useMemo(() => {
    return !isNaN(drawAmount) && drawAmount > 0 && drawAmount <= MaxDrawAmount;
  }, [drawAmount]);

  const judgeMoney = useCallback(() => {
    setChoosePaymentVisable(true);
  }, []);

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        backgroundImage:
          'linear-gradient(to right, #fff, #fff), linear-gradient(289deg, #1CADFF 11.56%, #DBFF00 150.15%)',
        backgroundClip: 'padding-box, border-box',
        backgroundOrigin: 'padding-box, border-box',
        border: '2px solid transparent',
      }}
    >
      <div className="direction-col flex overflow-hidden px-9 py-10 max-sm:flex-col max-sm:p-4">
        <div className="flex flex-col sm:w-[520px]">
          <Balance />
          <DrawAmountSelection
            value={drawAmount}
            setValue={setDrawAmount}
            valid={valid}
          />
          <div className="my-2 text-left font-bold text-dark3 sm:my-5">
            <span>Draw Amount: </span>
            <span className="text-[#1BA27A]">
              {drawAmount * TicketPrice} USD
            </span>
          </div>
          {swapDetail && (
            <button
              className="rounded-2xl bg-warning py-6 text-2xl text-white disabled:bg-[#FFA41B]/50 max-sm:mx-auto max-sm:w-full max-sm:rounded-[8px] max-sm:py-2 max-sm:text-xl"
              disabled={!valid}
              onClick={() => judgeMoney()}
            >
              Play
            </button>
          )}
          <ChooseCurrencyPopup
            visible={choosePaymentVisable}
            setVisible={setChoosePaymentVisable}
            totalAmount={drawAmount * TicketPrice}
            swapDetail={swapDetail}
          />
        </div>
        {isWeb3ServiceInited && swapDetail && (
          <PossibilityTable swapDetail={swapDetail}></PossibilityTable>
        )}
      </div>
    </div>
  );
};

export default BetPanel;
