import { useState } from 'react';
import PrizeTable from '../../../components/PrizeTable';
import { PrizeTableItem } from '../../../components/PrizeTable/type';
import Selection from '../../../components/Selection';
import { MaxRatio } from './config';

interface PresetTableProps {
  items: PrizeTableItem[];
  setName: (name: string) => void;
  setShareRatio: (ratio: string) => void;
  disabled?: boolean;
}

const PresetTable = ({
  items,
  setName,
  setShareRatio,
  disabled,
}: PresetTableProps) => {
  const [scopedRatio, setScopedRatio] = useState('0%');
  const [scopedName, setScopedName] = useState('');

  const borderClz = disabled ? 'border-border1' : 'border-[#3370FF]';

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white px-2 py-6 sm:px-3 ${borderClz}`}
      onClick={() => {
        setShareRatio(scopedRatio);
        setName(scopedName);
      }}
    >
      <div className="flex items-center px-4">
        <span className="mr-2 text-base font-bold text-text1 sm:text-lg">
          Pool Name:
        </span>
        <input
          value={scopedName}
          onChange={(e) => {
            setScopedName(e.target.value);
            setName(e.target.value);
          }}
          className="flex-1 rounded-lg border border-border1 px-2 py-1 outline-none max-sm:text-base sm:px-3 sm:py-2"
          placeholder="Enter the pool name"
        />
      </div>
      <div className="h-[380px] overflow-y-auto overflow-x-visible pt-6">
        <PrizeTable items={items} />
      </div>
      <div className="mt-2 flex items-center px-4">
        <span className="text-base font-bold">Profit Split Ratio:</span>
        <span className="flex-1 scale-75">
          <Selection
            placeholder="Choose the distributor profit split ratio here"
            disable={disabled}
            options={Array(MaxRatio + 1)
              .fill(0)
              .map((_, idx) => idx.toString() + '%')}
            initialValue={scopedRatio}
            onChange={(value: string) => {
              setScopedRatio(value);
              setShareRatio(value);
            }}
          />
        </span>
      </div>
    </div>
  );
};
export default PresetTable;
