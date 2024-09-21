import { useCallback, useState } from 'react';

import { showError, showSucc } from '../../utils/notify';
import Spin from '../../components/Spin';
import { getJkpt, isNitrogenVersion } from '../../utils/env';
import profitImg from '../../assets/images/distributor/profit.png';
import useClaimer from '../../hooks/claimer';
import { formatUSD } from '../../utils/format';

const ProfitValue = ({
  profit: { jkpt, usdt, usdc },
}: {
  profit: {
    jkpt: number;
    usdt: number;
    usdc: number;
  };
}) => {
  const jkptName = getJkpt().toUpperCase();

  if (isNitrogenVersion()) {
    return (
      <span className="text-[#93DC08]">
        {formatUSD(usdc)}USDC {formatUSD(usdt)}USDT
      </span>
    );
  }
  return (
    <span className="text-[#93DC08]">
      {jkpt.toFixed(8)} {jkptName}
    </span>
  );
};

const BasicInfo: React.FC = () => {
  const { totalProfit, claimedProfit, unclaimedProfit, claim } = useClaimer();

  const [claimLoading, setClaimLoading] = useState(false);
  const showClaimBtn = isNitrogenVersion()
    ? unclaimedProfit.usdc > 0 || unclaimedProfit.usdt > 0
    : unclaimedProfit.jkpt > 0;

  const doClaim = useCallback(async () => {
    if (claimLoading) return;
    setClaimLoading(true);
    try {
      await claim();
      showSucc('Profit claimed successfully.');
    } catch (e: any) {
      showError(e.message);
    } finally {
      setClaimLoading(false);
    }
  }, [claim, claimLoading]);

  return (
    <section className="bg-white pb-14 max-sm:bg-mainV1 max-sm:px-4 max-sm:pb-0">
      <div className="mx-auto w-[1200px] max-sm:w-full">
        <div className="flex w-full items-end justify-between">
          {/* left panel */}
          <div className="flex flex-col">
            <div className="mt-[100px] flex flex-col max-sm:mt-[50px]">
              <span className="text-4xl text-mainV1 max-sm:text-2xl max-sm:text-white">
                Distributor Profit
              </span>
              <span className="mt-20 flex flex-col space-y-[30px] text-xl font-bold text-[#666666] max-sm:mt-7 max-sm:space-y-[18px] max-sm:text-base max-sm:text-white">
                <span>
                  Total Profit:&nbsp;
                  <ProfitValue profit={totalProfit} />
                </span>
                <span>
                  Claimed Profit:&nbsp;
                  <ProfitValue profit={claimedProfit} />
                </span>
                <span className="flex flex-wrap items-center">
                  Unclaimed Profit:&nbsp;
                  <ProfitValue profit={unclaimedProfit} />
                  {showClaimBtn && (
                    <button
                      className="mt-2 flex items-center justify-center rounded-lg bg-warning px-4 py-1 text-center text-base text-white sm:ml-5 sm:mt-0 sm:w-auto"
                      onClick={doClaim}
                    >
                      {!claimLoading && 'Claim'}
                      {claimLoading && <Spin className="mx-3 my-1 h-4 w-4" />}
                    </button>
                  )}
                </span>
                <span className="font-normal max-sm:text-sm">
                  Distributor profit data is updated in real-time.
                </span>
              </span>
            </div>
          </div>

          {/* right panel */}
          <img
            src={profitImg}
            alt="Distributor Profit"
            className="h-fit w-[455px] max-sm:hidden"
          />
          {/*<WalletExchange />*/}
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
