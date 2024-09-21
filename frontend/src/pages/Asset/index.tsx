import BasicInfo from './BasicInfo';
import { useAtomValue } from 'jotai';
import { web3ServiceInitedAtom } from '../../atoms/web3';

const AssetPage = () => {
  const isWeb3ServiceInited = useAtomValue(web3ServiceInitedAtom);

  return (
    <div className="min-h-[calc(100svh-300px)] max-sm:bg-mainV1">
      {isWeb3ServiceInited && <BasicInfo></BasicInfo>}
    </div>
  );
};

export default AssetPage;
