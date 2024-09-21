interface XbitPrice {
  price: number;
  time: number;
}

interface PoolSize {
  poolSize: number;
  time: number;
}

interface BaseTransaction {
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  transactionIndex: number;
}

export interface DepositTransaction extends BaseTransaction {
  amountJkpt: number;
  amountXbit: number;
}

export interface WithdrawTransaction extends BaseTransaction {
  amountJkpt: number;
  amountXbit: number;
}

export interface ClaimTransaction extends BaseTransaction {
  usdtFee: number;
  usdcFee: number;
  distributor: string;
}

export interface LotteryTransaction extends BaseTransaction {
  usdIn: number;
  jkptOut: number;
  jkptTicket: number;
  quantity: number;
  xexpOut: number;
  jkptFee: number;
  randomWord: string;
  rewardLevels: string[];
  referrer: string;
  swapId: string;
}

export enum QueryOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export const getXbitPrice = async (): Promise<XbitPrice[]> => {
  // return await api.get('/xbit/prices', { params: { startTs, endTs } });
  return Array.from({ length: 30 }, (_, i) => ({
    price: 1 + Math.random() * 0.2 + i / 30,
    time: Date.now() - 30 * 86400 * 1000 + i * 86400 * 1000,
  }));
};

export const getPoolSize = async (): Promise<PoolSize[]> => {
  return Array.from({ length: 30 }, (_, i) => ({
    poolSize: 2000 + Math.random() * 200 + i * 10,
    time: Date.now() - 30 * 86400 * 1000 + i * 86400 * 1000,
  }));
  // return await api.get('/xbit/pool-sizes', { params: { startTs, endTs } });
};
