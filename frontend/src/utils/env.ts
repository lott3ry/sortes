import { SepoliaTokens, Tokens } from './address';
import ethLogo from '../assets/chains-logos/eth.svg';
import { getDefaultStore } from 'jotai';
import { chainAtom } from '../atoms/chain';
import { ChainId } from '../atoms/chain';

type ChainName = 'Ethereum Sepolia';

export interface ChainInfo {
  name: ChainName;
  chainId: ChainId;
  gasLimit: number;
  playGasLimit: (value: number) => number;
  tokens: Tokens;
  scanner: string;
  rpcUrl: string;
  logo: string;
  apiEndpoint: string;
  defaultSwapId?: string;
  jkpt: 'wbtc' | 'taiko' | 'weth';
  xTokenName: string;
  isTestnet: boolean;
  randomness: RandomnessSource;
}

export enum RandomnessSource {
  Chainlink = 'chainlink',
}

export const chainInfoMap: { [key in ChainId]: ChainInfo } = {
  [ChainId.Sepolia]: {
    name: 'Ethereum Sepolia',
    chainId: ChainId.Sepolia,
    gasLimit: 3000000,
    playGasLimit: (value: number) => (value + 100) * 9000,
    tokens: SepoliaTokens,
    scanner: 'https://sepolia.etherscan.io/tx/',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    logo: ethLogo,
    apiEndpoint: 'https://sepolia.lott3ry.xyz/',
    jkpt: 'wbtc',
    xTokenName: 'X-WBTC',
    isTestnet: true,
    randomness: RandomnessSource.Chainlink,
  },
};
const store = getDefaultStore();
const getChainId = () => store.get(chainAtom);

export const currentChainInfo = () => chainInfoMap[getChainId()];
export const getJkpt = () => currentChainInfo().jkpt;

// export const isMainnet = () => getChainId() === ChainId.Mainnet;
export const isMainnet = () => false;

export const isMobileWeb =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export const isMetaMaskBrowser =
  typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;

export const isNitrogenVersion = (chainId = getChainId()) =>
  [ChainId.Sepolia].includes(chainId);

export const AnimationDuration = {
  DICE_ROLLING: 9000,
  BALL_DROPPING: 3000,
  RESULT_DISPLAY: 3000,
};
