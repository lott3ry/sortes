import IconTaiko from '../../assets/icons/reward-taiko-pink.png';
import IconWBTC from '../../assets/icons/icon-WBTC.png';
import IconWETH from '../../assets/icons/icon-WETH.png';
import { getJkpt } from '../../utils/env';

const JkptIcon = () => {
  const jkpt = getJkpt();
  let icon,
    alt: string = '';

  switch (jkpt) {
    case 'taiko':
      icon = IconTaiko;
      alt = 'TAIKO';
      break;
    case 'weth':
      icon = IconWETH;
      alt = 'WETH';
      break;
    default:
      icon = IconWBTC;
      alt = 'WBTC';
  }

  return (
    <img
      className="inline-block h-auto w-8 max-sm:w-6"
      src={icon}
      alt={alt}
    ></img>
  );
};

export default JkptIcon;
