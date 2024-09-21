import { BigNumber, ethers } from 'ethers';
import erc20Abi from '../abi/erc20';
import nitrogenXbitAbi from '../abi/nitrogen';
import { WalletState } from '@web3-onboard/core';
import { Token, Tokens } from '../utils/address';
import { getDefaultStore } from 'jotai';
import { web3ServiceInitedAtom } from '../atoms/web3';
import {
  loadInvalidRequestIds,
  loadValidRequestIds,
  saveInvalidRequestIds,
  saveValidRequestIds,
} from './persist';
import { RewardType } from '../hooks/pool';
import { chainInfoMap, currentChainInfo } from '../utils/env';
import { ChainId } from '../atoms/chain';

const { formatUnits, parseUnits } = ethers.utils;
const store = getDefaultStore();

interface CreateSwapParams {
  name: string;
  relatives: boolean[];
  expectations: number[];
  rewards: number[];
  millionthRatio: number;
}
interface RewardItem {
  expectation: string;
  type: RewardType;
  amount: string;
}

export interface SwapDetail {
  id: string;
  rewardItems: RewardItem[];
  name: string;
  owner: string;
  shareRatio: number;
}

export const tags = { gasLimit: currentChainInfo().gasLimit };

type TokenMap = { [key in ChainId]?: Tokens };
type ContractMap = {
  [key in ChainId]?: {
    [key in Token | 'legacyXbit']?: ethers.Contract;
  };
};

export class Web3Service {
  ethersProvider: ethers.providers.Web3Provider;
  address: string;
  wallet: WalletState;
  // contracts: Record<Token, ethers.Contract> = {};
  // tokens?: Tokens;
  tokenMap: TokenMap = Object.values(chainInfoMap).reduce((acc, info) => {
    acc[info.chainId as ChainId] = info.tokens;
    return acc;
  }, {} as TokenMap);

  contractMap: ContractMap = Object.values(chainInfoMap).reduce((acc, info) => {
    acc[info.chainId] = {};
    return acc;
  }, {} as ContractMap);

  static _instance: Web3Service;

  static get service() {
    if (!Web3Service._instance) {
      throw new Error('Web3Service not initialized');
    }
    return Web3Service._instance;
  }

  static init(wallet: WalletState) {
    if (Web3Service._instance && Web3Service._instance.wallet === wallet)
      return;
    return new Web3Service(wallet);
  }
  static parseSwap(swapRaw: any): SwapDetail {
    return {
      id: swapRaw.id.toString(),
      rewardItems: swapRaw.expectations.map((exp: BigNumber, idx: number) => ({
        expectation: exp.toString(),
        type: swapRaw.relatives[idx] ? RewardType.Percentage : RewardType.Fixed,
        amount: swapRaw.rewards[idx].toString(),
      })),
      name: swapRaw.name,
      owner: swapRaw.owner,
      shareRatio: swapRaw.millionth_ratio.toNumber() / 1e6,
    };
  }

  get signer() {
    return this.ethersProvider.getSigner(this.address);
  }

  get tokens() {
    return this.tokenMap[currentChainInfo().chainId];
  }

  get contracts() {
    return this.contractMap[currentChainInfo().chainId];
  }

  constructor(wallet: WalletState) {
    // if using ethers v6 this is:
    // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
    this.ethersProvider = new ethers.providers.Web3Provider(
      wallet.provider,
      'any'
    );
    this.address = wallet.accounts[0].address;
    this.wallet = wallet;

    this.initializeContracts();

    store.set(web3ServiceInitedAtom, true);
    Web3Service._instance = this;
  }

  initializeContracts() {
    Object.values(chainInfoMap).forEach((info) => {
      const tokens = info.tokens;
      this.tokenMap[info.chainId] = tokens;

      (Object.keys(tokens) as Token[]).forEach((token: Token) => {
        this.contractMap[info.chainId]![token] = new ethers.Contract(
          tokens[token]!.address,
          token === 'xbit' ? nitrogenXbitAbi : erc20Abi,
          this.signer
        );
      });
    });
  }

  async getChainId() {
    const network = await this.ethersProvider.getNetwork();
    return network.chainId;
  }

  async getBalance(token: Token, address: string) {
    const contract = this.contracts![token];

    if (!contract) return null;

    const [balance, decimals] = await Promise.all([
      contract.balanceOf(address),
      contract.decimals(),
    ]);
    return formatUnits(balance, decimals);
  }

  async getSupply(token: Token) {
    const contract = this.contracts![token];
    if (!contract) return null;

    const [supply, decimals] = await Promise.all([
      contract.totalSupply(),
      contract.decimals(),
    ]);

    return formatUnits(supply, decimals);
  }

  // jkpt => xbit
  async deposit(value: string) {
    const transferNum = parseUnits(value, this.tokens?.jkpt.decimal);
    await this.contracts!.jkpt!.approve(this.tokens?.xbit.address, transferNum);
    const trx = await this.contracts!.xbit!.save(transferNum, tags);
    await trx.wait();
  }

  // xbit => jkpt
  async withdraw(value: string) {
    const transferNum = parseUnits(value, this.tokens?.xbit.decimal);

    await this.contracts!.xbit!.approve(this.address, transferNum);
    const trx = await this.contracts!.xbit!.withdraw(transferNum, tags);
    await trx.wait();
  }

  async isRequestValidNow(requestId: BigNumber) {
    const xbit = this.contracts!.xbit;
    const status = await xbit!.getRequestStatusById(requestId);
    return {
      // filter fulfilled ids
      isValidNow: !status.fulfilled,
      status,
    };
  }

  async getValidRequests(): Promise<{ id: BigNumber; status: any }[]> {
    const xbit = this.contracts?.xbit;
    const idsFromChain = await xbit!.getRequestIdsByAddress(this.address);

    const invalidIdsFromLS = loadInvalidRequestIds() ?? [];
    const validIdsFromLS = loadValidRequestIds() ?? [];
    const invalidIds: string[] = [];
    let validIds: { id: string; time: number }[] = validIdsFromLS.filter(
      (item) =>
        idsFromChain.map((i: BigNumber) => i.toString()).includes(item.id)
    );
    const validRequests = [];

    for (const id of idsFromChain) {
      // filter invalid ids from local storage
      if (invalidIdsFromLS.includes(id.toString())) {
        invalidIds.push(id.toString());
        continue;
      }

      const { isValidNow, status } = await this.isRequestValidNow(id);

      if (!isValidNow) {
        invalidIds.push(id.toString());
        validIds = validIds.filter((x) => x.id !== id.toString());
      } else {
        // update LS valid request ids
        const validItem = validIds.find((x) => x.id === id.toString());

        // first time get valid request, save
        if (!validItem) {
          validIds.push({ id: id.toString(), time: Date.now() });
          validRequests.push({
            id,
            status,
          });
          // time out, remove
        } else if (Date.now() - validItem.time > 1000 * 60 * 60) {
          invalidIds.push(id.toString());
          validIds = validIds.filter((x) => x.id !== id.toString());
          // do not need to update local valid request ids
        } else {
          validRequests.push({
            id,
            status,
          });
        }
      }
    }

    saveInvalidRequestIds(invalidIds);
    saveValidRequestIds(validIds);
    return validRequests;
  }

  async getCurrentBlockNumber() {
    return await this.ethersProvider.getBlockNumber();
  }

  async getWbtcPrice(): Promise<number> {
    const amountWbtc = await this.contracts!.xbit!.estimateUSD2BTC(
      parseUnits('1', this.tokens?.usdt.decimal)
    );
    const price =
      1 / Number(formatUnits(amountWbtc, this.tokens?.jkpt?.decimal));
    return price;
  }

  async getJkptPrice() {
    const amount = await this.contracts!.xbit!.estimateUSD2JKPT(
      parseUnits('1', this.tokens?.usdt.decimal)
    );
    const price = 1 / Number(formatUnits(amount, this.tokens?.jkpt?.decimal));
    return price;
  }

  async registerSwap({
    relatives,
    expectations,
    rewards,
    millionthRatio,
    name,
  }: CreateSwapParams) {
    const params = {
      relatives,
      expectations: expectations.map((exp) => exp * 1e6), // convert to usdt amount
      rewards: rewards.map((reward, idx) =>
        relatives[idx] ? reward * 1e4 : reward * 1e6
      ), // for relative rewards, user input is percentage value
      millionth_ratio: millionthRatio * 1e4,
      owner: this.address,
      name: name,
      id: 0,
    };
    // console.log('create swap', params, tags);
    const tx = await this.contracts!.xbit!.registerSwap(params, tags);
    const receipt = await tx.wait();
    console.log('receipt', receipt.events);
    const args = receipt.events!.filter(
      (x: { event: string }) => x.event === 'SwapRegistered'
    )[0].args;
    return args;
  }

  async getSwap(id: string): Promise<SwapDetail> {
    const swap = await this.contracts!.xbit!.getSwap(parseUnits(id, 0));
    return Web3Service.parseSwap(swap);
  }

  async usdtAllowance() {
    return await this.contracts!.usdt!.allowance(
      this.address,
      this.tokens?.xbit.address
    );
  }

  async usdcAllowance() {
    return await this.contracts!.usdc!.allowance(
      this.address,
      this.tokens?.xbit.address
    );
  }

  async claimReward() {
    return await this.contracts!.xbit!.claimRemainingRewardFee(tags);
  }

  async listSwapIds() {
    return await this.contracts!.xbit!.listSwapIds(this.address, tags);
  }
  async listSwaps(owner: string = this.address) {
    const swaps = await this.contracts!.xbit!.listSwaps(owner, tags);
    return swaps.map(Web3Service.parseSwap);
  }

  async getPoolSize() {
    return await this.contracts?.xbit?.getPrizePoolSizeInUSD();
  }
}
