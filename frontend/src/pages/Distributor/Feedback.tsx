import React from 'react';
import { Popup } from '../../components/Modal/Popup.tsx';
interface FeedbackProps {
  isSuccess: boolean;
  text: string;
  clickModalClosable?: boolean;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
const Feedback: React.FC<FeedbackProps> = (props) => {
  const {
    isSuccess = true,
    text,
    visible,
    setVisible,
    clickModalClosable,
  } = props;

  return (
    <Popup
      visible={visible}
      setVisible={setVisible}
      clickModalClosable={clickModalClosable}
    >
      <div className="flex space-x-[10px] rounded-lg bg-white p-[10px] text-xl">
        <i
          className={
            'iconfont text-3xl ' + isSuccess
              ? 'icon-succ text-[#00CCAA]'
              : 'icon-error text-[#FF4D6C]'
          }
        />
        <h1>{text}</h1>
      </div>
    </Popup>
  );
};
export default Feedback;
