import { readableAddr } from '../../utils/format';
import { useCurrentUser } from '../../hooks/user';
import { useConnectWallet } from '@web3-onboard/react';
import Close2 from '../../assets/svg/close2.tsx';

const CurrentUser: React.FC = () => {
  const { avatar, address } = useCurrentUser();
  const [{ wallet }, , disconnect] = useConnectWallet();

  if (!address) return null;

  return (
    <div className="group flex h-12 items-center space-x-3 rounded-3xl bg-white px-4 py-4">
      <span className="w-8">
        {/*  todo 圆形不彻底*/}
        <img className="h-8 w-8 rounded-full" src={avatar} alt={address}></img>
      </span>
      <span className="font- font-roboto text-lg font-medium text-text1">
        {readableAddr(address)}
      </span>
      <span onClick={() => wallet && disconnect(wallet)}>
        <Close2 color="#202020"></Close2>
      </span>
    </div>
  );
};

export default CurrentUser;
