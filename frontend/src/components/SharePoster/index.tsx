import React from 'react';
import uploadIcon from '../../assets/svg/upload.svg';

import PosterWithQRExporter from '../../pages/Distributor/PosterWithQRExporter.tsx';

import { useShareSwap } from '../../hooks/share.ts';
import { useCopy } from '../../hooks/copy.ts';

// import { QRCodeSVG } from 'qrcode.react';

interface SharePosterProps {
  swapId: string;
  label: string;
}

const SharePoster: React.FC<SharePosterProps> = ({ swapId, label }) => {
  const url = `${window.location.origin}/play?swap=${swapId}`;

  const handleShare = useShareSwap();
  const handleCopy = useCopy();

  return (
    <div className="share-scroll flex overflow-y-auto rounded-2xl bg-white px-2.5 pb-5 pt-10 text-sm font-bold max-sm:flex-col sm:px-10 sm:pb-10 sm:pt-[60px]">
      <div className="flex flex-col max-sm:mb-2.5 sm:mr-5 sm:border-r sm:border-dashed sm:pr-5">
        <button
          onClick={() => handleShare(swapId, label)}
          className="flex items-center justify-center rounded-lg bg-[#3370FF] py-2.5 text-white"
        >
          <img src={uploadIcon} alt="Share ink" className="mr-2.5" />
          Share link
        </button>
        <span className="mt-2.5 text-left font-bold max-sm:hidden sm:mt-5">
          Prize Pool Share Link:
        </span>
        <span className="mt-2.5 flex w-full items-center justify-between rounded-lg border border-[#E7E7E9] bg-white p-3 shadow-[-5px_20px_20px_0_rgba(0,0,0,0.05)] sm:w-[249px]">
          <input
            readOnly
            className="w-full flex-1 truncate font-normal outline-none"
            value={url}
          />
          <span
            className="cursor-pointer pl-3 text-[#3370FF]"
            onClick={() => handleCopy(swapId)}
          >
            Copy
          </span>
        </span>
      </div>
      <PosterWithQRExporter url={url} />
    </div>
  );
};

export default SharePoster;
