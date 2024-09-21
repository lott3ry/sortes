import PrizeTable from '.';
import { Popup } from '../Modal/Popup';
import { PrizeTableItem } from './type';

interface PrizeTablePopupProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  items: PrizeTableItem[];
}
const PrizeTablePopup: React.FC<PrizeTablePopupProps> = ({
  visible,
  setVisible,
  items,
  title,
}) => {
  return (
    <Popup visible={visible} setVisible={setVisible} clickModalClosable={false}>
      <div className="w-[310px] overflow-hidden rounded-2xl text-left sm:w-[512px]">
        <div className="relative flex max-h-[684px] w-full flex-col overflow-y-auto bg-white p-5 sm:p-10">
          <span
            onClick={() => setVisible(false)}
            className="absolute right-2.5 top-2.5 cursor-pointer"
          >
            <i className="iconfont icon-close-outlined text-2xl text-black" />
          </span>
          <span className="mb-5 ml-4 text-base font-bold sm:mb-10 sm:text-xl">
            {title}
          </span>
          <PrizeTable items={items} />
        </div>
      </div>
    </Popup>
  );
};
export default PrizeTablePopup;
