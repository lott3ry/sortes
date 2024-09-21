import { useState } from 'react';

interface SwitchBtnProps {
  labels: string[];
  initIdx: number;
  onSwitch: (newIdx: number) => void;
}

const SwitchBtn: React.FC<SwitchBtnProps> = (props) => {
  const [currentIdx, setCurrentIdx] = useState<number>(props.initIdx);
  return (
    <span className="flex rounded-lg border border-solid border-white bg-primary text-sm max-sm:text-xs">
      {props.labels.map((label, idx) => {
        if (idx === currentIdx) {
          return (
            <span
              key={idx}
              className="bg-white px-5 py-3 text-mainV1 first:rounded-l-lg last:rounded-r-lg max-sm:px-[10px] max-sm:py-2 max-sm:leading-6"
            >
              {label}
            </span>
          );
        } else {
          return (
            <span
              key={idx}
              className="cursor-pointer bg-mainV1 px-5 py-3 text-white first:rounded-l-lg last:rounded-r-lg hover:text-white max-sm:px-4 max-sm:py-3"
              onClick={() => {
                setCurrentIdx(idx);
                props.onSwitch(idx);
              }}
            >
              {label}
            </span>
          );
        }
      })}
    </span>
  );
};

export default SwitchBtn;
