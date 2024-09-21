import React from 'react';
import { useCopy } from '../../hooks/copy';
import { useLocation } from 'react-router-dom';

interface DistributorMobileProps {}

const DistributorMobile: React.FC<DistributorMobileProps> = () => {
  const location = useLocation();
  const handleCopy = useCopy();

  const isDistributor = location.pathname.includes('distributor');
  const isAsset = location.pathname.includes('asset');

  const copyRoute = isDistributor ? 'distributor' : isAsset ? 'asset' : '';

  return (
    <div className="h-[calc(100vh-220px)] bg-mainV1">
      <div className="mx-3 flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-white p-4">
        <h1 className="text-nowrap text-[18px] font-bold text-mainV1">
          Use a laptop/pad for distributor ops
        </h1>

        <div className="relative mb-1 mt-4 w-full rounded-[8px] border border-[#666666] px-4 py-[10px] text-sm font-normal">
          <span
            className="absolute right-2 font-semibold text-[#3370FF]"
            onClick={() => handleCopy(undefined, copyRoute)}
          >
            copy
          </span>
        </div>

        <h2 className="text-xs font-normal text-[#666666]">
          Copy the link and enter it in the browser on your laptop/pad.
        </h2>
      </div>
    </div>
  );
};

export default DistributorMobile;
