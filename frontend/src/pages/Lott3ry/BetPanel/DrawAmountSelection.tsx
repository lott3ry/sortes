import { useRef, useState } from 'react';
import drawAmountActive from '../../../assets/images/draw-amount-active.png';
import drawAmountInactive from '../../../assets/images/draw-amount-inactive.png';
import { DrawAmount } from './constant';

interface DrawAmountSelectionProps {
  value: number;
  valid: boolean;
  setValue: (value: number) => void;
}

const MultiplierSvg: React.FC<{ active: boolean }> = ({ active }) => (
  <span className="max-sm:scale-95">
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.1852 0.315034C15.7576 -0.11673 15.0643 -0.11673 14.6367 0.315033L8.44269 6.56926L2.24867 0.315049C1.82106 -0.116714 1.12777 -0.116714 0.700162 0.315049C0.272554 0.746813 0.272553 1.44684 0.700161 1.8786L6.89419 8.13282L0.700169 14.387C0.272561 14.8188 0.272561 15.5188 0.70017 15.9506C1.12778 16.3823 1.82107 16.3823 2.24868 15.9506L8.44269 9.69637L14.6367 15.9506C15.0643 16.3824 15.7576 16.3824 16.1852 15.9506C16.6128 15.5188 16.6128 14.8188 16.1852 14.387L9.9912 8.13282L16.1852 1.87859C16.6128 1.44682 16.6128 0.746797 16.1852 0.315034Z"
        fill={`${!active ? '#666666' : '#FFFFFF'}`}
      />
    </svg>
  </span>
);

interface DrawAmountItemProps {
  value: number;
  active: boolean;
  setValue: (value: number) => void;
  valid?: boolean;
}

const DrawAmountItem: React.FC<DrawAmountItemProps> = ({
  value,
  active,
  setValue,
}) => {
  const imgSrc = active ? drawAmountActive : drawAmountInactive;
  const numberColorClz = active ? 'text-white' : 'text-text2';
  const textColorClz = active ? 'text-white' : 'text-text2';
  return (
    <div
      className="relative flex-1 cursor-pointer rounded-2xl shadow-card first:mr-2.5"
      onClick={() => setValue(value)}
    >
      <img src={imgSrc} alt="Draw Amount" className="h-auto w-full" />
      <div className="absolute left-10 top-10 max-sm:left-4 max-sm:top-2">
        <span className={`${numberColorClz} mr-2 text-4xl max-sm:text-2xl`}>
          {10}
        </span>
        <span className={`${textColorClz} text-sm sm:text-base`}>USD</span>
      </div>
      {value > 1 && (
        <>
          <span
            className={`${textColorClz} absolute left-12 top-1/2 -translate-y-1/2 transform font-normal max-sm:left-8`}
          >
            <MultiplierSvg active={active} />
          </span>
          <span
            className={`${textColorClz} absolute bottom-10 left-10 text-4xl max-sm:bottom-2 max-sm:left-4`}
          >
            <span className="max-sm:text-2xl">{value}</span>{' '}
            <span className="text-sm sm:text-base">Times</span>
          </span>
        </>
      )}
    </div>
  );
};

export const MaxDrawAmount = 100;

const CustomizedDrawAmountItem: React.FC<DrawAmountItemProps> = ({
  value,
  active,
  setValue,
  valid = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleValueChange = (val: string) => {
    const num = parseInt(val.substring(0, 3));
    if (isNaN(num)) {
      setValue(0);
      return;
    } else {
      setValue(num);
    }
  };
  const isInputEmpty = inputRef.current?.value === '';

  const inputColorClz = valid || isInputEmpty ? 'text-link' : 'text-[#FF4D6C]';

  const inputBorderGradientStyles = {
    backgroundImage:
      'linear-gradient(to right, #fff, #fff), linear-gradient(289deg, #1CADFF 11.56%, #DBFF00 150.15%)',
    backgroundClip: 'padding-box, border-box',
    backgroundOrigin: 'padding-box, border-box',
    border: '1px solid transparent',
  };
  const inputBorderClz =
    active && !valid && !isInputEmpty
      ? 'border-[#FF4D6C]'
      : 'border-transparent';
  const textColorClz = active ? 'text-white' : 'text-text2';
  const tipsColorClz = valid || isInputEmpty ? textColorClz : 'text-[#FFDD17]';

  return (
    <div
      className={
        'flex cursor-pointer flex-col rounded-lg px-5 py-3 text-sm shadow-customizedInput sm:px-[30px] sm:text-base ' +
        textColorClz
      }
      style={{
        background: active
          ? 'linear-gradient(289deg, #1CADFF 11.56%, #DBFF00 150.15%)'
          : '#f8f8f8',
      }}
      onClick={() => {
        if (!active) {
          handleValueChange('0');
        }
        inputRef.current?.focus();
      }}
    >
      <div className="flex items-center">
        <span className="font-bold leading-normal">
          <span className="mr-1.5 text-2xl sm:mr-2 sm:text-[40px]">10</span>
          <span className="text-sm sm:text-base">USD</span>
        </span>
        <span className="mx-3 sm:mx-6">
          <MultiplierSvg active={active} />
        </span>
        <span className="relative mr-2.5">
          <input
            ref={inputRef}
            type="number"
            value={active ? (value === 0 ? '' : value) : ''}
            onChange={(e) => handleValueChange(e.target.value)}
            className={`w-28 rounded-lg border px-4 py-1 text-2xl leading-normal focus:outline-none sm:w-40 sm:text-[40px] ${inputBorderClz} ${inputColorClz}`}
            style={
              !active || (active && valid) ? inputBorderGradientStyles : {}
            }
          />
          <span
            onClick={(e) => {
              handleValueChange(MaxDrawAmount.toString());
              inputRef.current?.focus();
              e.stopPropagation();
            }}
            className="absolute bottom-4 right-4 cursor-pointer border-b border-primary text-[#1BA27A] max-sm:bottom-2 max-sm:right-2"
          >
            Max
          </span>
        </span>
        <span className="self-end py-4">Times</span>
      </div>
      <div className={'text-left font-normal max-sm:text-xs ' + tipsColorClz}>
        {valid || isInputEmpty
          ? 'Customize the number of consecutive draws: 1-100 times'
          : `Integers only in the range of 2-${MaxDrawAmount}.`}
      </div>
    </div>
  );
};

export const DrawAmountSelection: React.FC<DrawAmountSelectionProps> = ({
  value,
  setValue,
  valid,
}) => {
  const [useCustomizedValue, setUseCustomizedValue] = useState(false);

  const handleSetDrawValue = (value: number, customized: boolean = false) => {
    setValue(value);
    setUseCustomizedValue(customized);
  };

  return (
    <div className="text-yahei flex flex-col space-y-2.5">
      <div className="flex justify-between">
        <DrawAmountItem
          value={DrawAmount.OneTicket}
          active={!useCustomizedValue && DrawAmount.OneTicket === value}
          setValue={() => handleSetDrawValue(DrawAmount.OneTicket)}
        />
        <DrawAmountItem
          value={DrawAmount.TenTickets}
          active={!useCustomizedValue && value === DrawAmount.TenTickets}
          setValue={() => handleSetDrawValue(DrawAmount.TenTickets)}
        />
      </div>
      <CustomizedDrawAmountItem
        value={value}
        active={useCustomizedValue}
        setValue={(val) => handleSetDrawValue(val, true)}
        valid={valid}
      />
    </div>
  );
};
