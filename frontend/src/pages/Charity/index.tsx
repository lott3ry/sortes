import getMoenyImg from '../../assets/images/charity/getMoney.png';
import touchHeart from '../../assets/images/charity/touchHeart.png';
import { formatUSD } from '../../utils/format';
import { isMobileWeb } from '../../utils/env';
import MobileCharityPage from './Mobile';

export const CharityPage = () => {
  const [charityBalance, donatedFunds, fundsToDonate] = [1598, 1000, 598];
  if (!charityBalance) return null;
  if (isMobileWeb) return <MobileCharityPage />;
  return (
    <div className="flex w-full justify-center bg-mainV1 pb-[100px] pt-24 text-white max-sm:pt-8">
      <div className="relative flex w-[1200px] flex-col max-sm:w-full max-sm:px-6">
        <span className="flex space-x-[10px] text-4xl">
          <span className="max-sm:text-lg">Total Charity Funds:</span>
          <span className="text-[#FFA41B]">
            {formatUSD(charityBalance)} USD
          </span>
        </span>
        <div className="mt-[30px] flex space-x-[50px]">
          <div className="flex text-2xl">
            <span>Donated Funds: &nbsp;</span>
            <span className="text-[#FFA41B]">
              {formatUSD(donatedFunds)} USD
            </span>
          </div>
          <div className="flex text-2xl">
            <span>Funds to be Donated: &nbsp;</span>
            <span className="text-[#FFA41B]">
              {formatUSD(fundsToDonate)} USD
            </span>
          </div>
        </div>
        <span className="mt-5 text-xl font-normal max-sm:text-sm">
          This charity fund will be governed by the community and contribute to
          the social welfare.
        </span>

        <img
          src={getMoenyImg}
          alt=""
          width={128}
          height={93}
          className="absolute -top-[22px] right-[170px] mx-auto mt-[100px]"
        />
        <img
          src={touchHeart}
          alt=""
          width={121}
          height={74}
          className="absolute -top-[140px] right-[10px] mx-auto mt-[100px]"
        />
      </div>
    </div>
  );
};
