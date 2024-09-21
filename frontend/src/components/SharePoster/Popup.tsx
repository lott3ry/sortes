import SharePoster from '.';
import { Popup, PopupProps } from '../Modal/Popup';

interface SharePosterPopupProps extends PopupProps {
  swapId: string;
  label: string;
}

const SharePosterPopup: React.FC<SharePosterPopupProps> = (props) => {
  return (
    <Popup {...props}>
      <div className="relative h-[590px] w-[290px] sm:h-[516px] sm:w-[620px]">
        <div
          className="absolute right-1.5 top-1.5 cursor-pointer"
          onClick={() => {
            props.setVisible(false);
            window.location.reload();
          }}
        >
          <i className="iconfont icon-close-outlined text-xl text-black" />
        </div>
        <SharePoster swapId={props.swapId} label={props.label} />
      </div>
    </Popup>
  );
};
export default SharePosterPopup;
