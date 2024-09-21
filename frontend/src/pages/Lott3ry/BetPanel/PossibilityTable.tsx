import { useJkptPrice, usePoolJkpt, usePrizeItems } from '../../../hooks/pool';
import { SwapDetail } from '../../../services/web3';
import Loading from '../../../assets/animations/loading.json';
import Lottie from 'lottie-react';
import React from 'react';
import PrizeTable from '../../../components/PrizeTable';

import PrizeTablePopup from '../../../components/PrizeTable/Popup';
import SharePosterPopup from '../../../components/SharePoster/Popup';

import { RandomnessIcon } from '../RandomnessIcon';

interface PossibilityTableProps {
  swapDetail: SwapDetail;
}

const PossibilityTable: React.FC<PossibilityTableProps> = ({ swapDetail }) => {
  const [sharePosterVisible, setSharePosterVisible] = React.useState(false);
  const poolJkpt = usePoolJkpt();
  const jkptPrice = useJkptPrice();
  const loading = poolJkpt === null || jkptPrice === null;
  const [tablePopupVisible, setTablePopupVisible] = React.useState(false);
  const prizeItems = usePrizeItems(swapDetail);

  if (loading) {
    return (
      <Lottie animationData={Loading} className="m-auto h-40 w-40 rounded-lg" />
    );
  }

  return (
    <div className="relative flex flex-1 flex-col max-sm:mb-4 sm:ml-14">
      <div className="ml-4 flex items-center text-left max-sm:mb-4">
        <span className="flex-1 text-xl max-sm:text-lg">Prize Table</span>
        <span
          className="flex cursor-pointer items-center space-x-2.5 rounded-full border border-quaternary px-3 py-2 font-normal text-quaternary sm:px-4 sm:py-2.5"
          onClick={() => setSharePosterVisible(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              d="M17.1778 12.6049C16.0416 12.6049 15.0262 13.1193 14.3463 13.9291L8.64955 11.0323C8.73901 10.7035 8.79046 10.359 8.79046 10.0011C8.79046 9.64322 8.74125 9.31439 8.65402 8.99005L14.3507 6.07986C15.0307 6.8829 16.0439 7.39515 17.1756 7.39515C19.2154 7.39515 20.8728 5.73538 20.8728 3.69757C20.8728 1.65977 19.2154 0 17.1778 0C15.1403 0 13.4807 1.65977 13.4807 3.69757C13.4807 4.00626 13.5232 4.30601 13.5947 4.59456L7.90027 7.50252C7.17337 6.61224 6.06847 6.04183 4.83385 6.04183C2.65089 6.04183 0.875 7.81792 0.875 10.0011C0.875 12.1843 2.65089 13.9604 4.83385 13.9604C6.06176 13.9604 7.16218 13.3967 7.88909 12.5154L13.5925 15.4144C13.5209 15.7007 13.4807 15.996 13.4807 16.3024C13.4807 18.3425 15.1403 20 17.1778 20C19.2154 20 20.875 18.3402 20.875 16.3024C20.875 14.2646 19.2154 12.6049 17.1778 12.6049ZM17.1778 1.66648C18.2984 1.66648 19.2087 2.57913 19.2087 3.69757C19.2087 4.81602 18.2962 5.72867 17.1778 5.72867C16.0595 5.72867 15.147 4.81602 15.147 3.69757C15.147 2.57913 16.0595 1.66648 17.1778 1.66648ZM4.83385 12.2939C3.57015 12.2939 2.54129 11.265 2.54129 10.0011C2.54129 8.73728 3.57015 7.70831 4.83385 7.70831C6.09755 7.70831 7.1264 8.73728 7.1264 10.0011C7.1264 11.265 6.09755 12.2939 4.83385 12.2939ZM17.1778 18.3358C16.0573 18.3358 15.147 17.4231 15.147 16.3047C15.147 15.1862 16.0595 14.2736 17.1778 14.2736C18.2962 14.2736 19.2087 15.1862 19.2087 16.3047C19.2087 17.4231 18.2962 18.3358 17.1778 18.3358Z"
              fill="#00CCAA"
            />
          </svg>
          <span>Share</span>
        </span>
      </div>
      <div className="flex-1 overflow-y-auto sm:max-h-[452px] sm:pt-8">
        <PrizeTable items={prizeItems} />
      </div>
      <div
        className="ml-4 mt-6 flex cursor-pointer items-center justify-center space-x-2.5 max-sm:hidden"
        onClick={() => setTablePopupVisible(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            d="M7.02681 14.4292H3.25185L7.40069 10.2846C7.54809 10.1372 7.63089 9.93727 7.63089 9.72882C7.63089 9.52037 7.54809 9.32046 7.40069 9.17306C7.25329 9.02567 7.05338 8.94286 6.84493 8.94286C6.63648 8.94286 6.43657 9.02567 6.28917 9.17306L2.07381 13.3817V9.64293C2.07381 9.43423 1.99091 9.23408 1.84333 9.08651C1.69576 8.93893 1.49561 8.85603 1.28691 8.85603C1.07821 8.85603 0.878053 8.93893 0.73048 9.08651C0.582906 9.23408 0.5 9.43423 0.5 9.64293V15.2149C0.5 15.6485 0.851982 15.9997 1.28648 15.9997H7.02513C7.1283 15.9998 7.23049 15.9795 7.32585 15.9402C7.42121 15.9008 7.50788 15.843 7.58091 15.7701C7.65394 15.6973 7.71191 15.6107 7.75149 15.5154C7.79107 15.4202 7.8115 15.318 7.81161 15.2149C7.81173 15.1117 7.79151 15.0095 7.75213 14.9141C7.71275 14.8188 7.65498 14.7321 7.5821 14.6591C7.50923 14.586 7.42268 14.5281 7.3274 14.4885C7.23213 14.4489 7.12999 14.4285 7.02681 14.4284V14.4292ZM15.716 0.000492356H9.9774C9.87422 0.000492353 9.77206 0.0208138 9.67674 0.060296C9.58143 0.0997783 9.49482 0.157648 9.42186 0.230602C9.34891 0.303555 9.29104 0.390164 9.25156 0.485483C9.21208 0.580801 9.19175 0.682963 9.19175 0.786135C9.19175 0.889307 9.21208 0.991469 9.25156 1.08679C9.29104 1.18211 9.34891 1.26871 9.42186 1.34167C9.49482 1.41462 9.58143 1.47249 9.67674 1.51198C9.77206 1.55146 9.87422 1.57178 9.9774 1.57178H13.7507L9.60184 5.71472C9.49062 5.82411 9.4146 5.96423 9.38354 6.11711C9.35248 6.26999 9.36779 6.42866 9.4275 6.57278C9.48721 6.7169 9.58861 6.83991 9.71869 6.92602C9.84877 7.01214 10.0016 7.05744 10.1576 7.05612C10.2609 7.05621 10.3631 7.03587 10.4585 6.99627C10.5539 6.95667 10.6405 6.8986 10.7134 6.8254L14.927 2.61593V6.35637C14.927 6.56496 15.0099 6.765 15.1574 6.9125C15.3049 7.05999 15.5049 7.14285 15.7135 7.14285C15.9221 7.14285 16.1222 7.05999 16.2696 6.9125C16.4171 6.765 16.5 6.56496 16.5 6.35637V0.783609C16.5 0.680556 16.4797 0.578516 16.4401 0.483339C16.4006 0.388161 16.3427 0.301719 16.2697 0.228967C16.1968 0.156215 16.1101 0.0985834 16.0148 0.0593769C15.9195 0.0201705 15.8174 0.000159926 15.7144 0.000492356H15.7152H15.716Z"
            fill="#B3B3B3"
          />
        </svg>
        <span className="text-base font-normal text-[#B3B3B3] underline">
          Click to see the full prize table
        </span>
      </div>
      <div className="absolute -bottom-7 right-0 flex items-center sm:-right-4">
        <span className="mr-2.5 font-normal text-blue0 max-sm:text-xs">
          Randomness provided by
        </span>
        <RandomnessIcon />
      </div>
      <PrizeTablePopup
        visible={tablePopupVisible}
        setVisible={setTablePopupVisible}
        title="Prize Table"
        items={prizeItems}
      />
      <SharePosterPopup
        visible={sharePosterVisible}
        setVisible={setSharePosterVisible}
        swapId={swapDetail.id}
        label={swapDetail.name}
      />
    </div>
  );
};

export default PossibilityTable;
