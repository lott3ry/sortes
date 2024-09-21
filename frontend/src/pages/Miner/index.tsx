import PrizePoolChart from './PrizePoolChart';
import Wallet from './Wallet';

const MinerPage = () => {
  return (
    <div>
      <div className="bg-mainV1 py-14 max-sm:py-0">
        <div className="mx-auto flex w-full max-w-[1300px] px-4 max-sm:flex-col-reverse sm:px-6 lg:px-8">
          <PrizePoolChart />
          <Wallet />
        </div>
      </div>
    </div>
  );
};

export default MinerPage;
