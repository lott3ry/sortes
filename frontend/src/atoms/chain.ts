import { atom } from 'jotai';

export const enum ChainId {
  Sepolia = 11155111,
}

export const chainAtom = atom<ChainId>(ChainId.Sepolia);
export const setChainAtom = atom(null, (get, set, chainId: ChainId) => {
  const curChainId = get(chainAtom);
  if (curChainId !== chainId) {
    set(chainAtom, chainId);
  }
});
