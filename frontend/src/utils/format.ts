import { currentChainInfo } from './env';

export const readableAddr = (str: string, bit = 4): string => {
  const len = str.length;

  if (len <= 2 * bit) return str;
  else return str.substring(0, bit) + '...' + str.substring(len - bit, len);
};

export const formatTime = (ts: number): string => {
  const d = new Date(ts);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

export const transactionHash2Url = (hash: string): string =>
  currentChainInfo().scanner + hash;

export const formatUSD = (num: number | string | null): string =>
  num === null
    ? ''
    : (typeof num === 'string' ? Number(num) : num).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });

export const formatTokenAmount = (num: number | string | null): string =>
  num === null
    ? '---'
    : Number(num).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
        maximumSignificantDigits: 12,
      });
