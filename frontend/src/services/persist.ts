import { currentChainInfo } from '../utils/env';

enum StorageKey {
  InvalidRequestIds = 'invalid-request-ids',
  ValidRequestIdsFromBlockChain = 'valid-request-ids',
}

function load(key: string) {
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function save(key: string, data: object) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    return;
  }
}

const getStoreKey = (key: string) =>
  `chain-${currentChainInfo().chainId}:${key}`;

const loaderGen: <T>(key: string) => () => T | null = (key) => () =>
  load(getStoreKey(key)) ? load(getStoreKey(key)).data : null;

const saverGen: <T>(key: string) => (data: T) => void = (key) => (data) =>
  save(getStoreKey(key), { data: data as object });

export const loadInvalidRequestIds = loaderGen<string[]>(
  StorageKey.InvalidRequestIds
);
export const saveInvalidRequestIds = saverGen<string[]>(
  StorageKey.InvalidRequestIds
);
export const loadValidRequestIds = loaderGen<{ id: string; time: number }[]>(
  StorageKey.ValidRequestIdsFromBlockChain
);

export const saveValidRequestIds = saverGen<{ id: string; time: number }[]>(
  StorageKey.ValidRequestIdsFromBlockChain
);
