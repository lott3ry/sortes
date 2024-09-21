import erc20Abi from './erc20';

/*
struct RequestStatus {
  bool exists; // whether a requestId exists
  // will be fulfilled after randomness generated
  bool fulfilled; // whether the request has been successfully fulfilled
  uint256 requestId; // id of the request
  address player; // address of the player
  uint256 swapId; // id of the swap instance
  uint256 usdIn; // total amount of USD player put in
  uint8 usdType; // 0 for USDT, 1 for USDC
  uint256 jkptTicket; // amount of JKPT equaling to one ticket
  uint256 quantity; // number of tickets
  uint256 randomWord; // random word generated
  uint256[] rewardLevels; // reward level of each ticket results
  uint256 xexpOut; // total amount of XEXP player will get
  uint256 jkptOut; // total amount of JKPT player will get
  uint256 swapFee; // total amount of USD swap owner will get
  uint256 donation; // total amount of USD of charitiable donation
}

struct Swap {
  // level == index + 1
  bool[] relatives; // whether the reward is relative to pool size
  uint256[] expectations; // unit is USDT amount; probability = expectation / reward
  uint256[] rewards; // if relative, real reward = reward * pool_size / 1e6; otherwise unit is USDT amount
  uint256 millionth_ratio; // ratio (millionth_ratio / 1e6) of the reward shared to the swap owner
  address owner; // must be filled as a valid address string
  string name; // can be empty
  uint256 id; // auto filled
}
*/

export default [
  // # Xbit inherits from ERC20
  ...erc20Abi,
  // owner of Xbit contract can set maintainer
  'function setMaintainer(address new_maintainer) public',
  // owner of Xbit contract can set Chainlink subscription
  'function setChainlinkSubscription(uint64 _subscriptionId, bytes32 _keyHash, uint32 _callbackGasLimit, uint256 _linkThreshold) public',
  // save JKPT to Xbit contract pool [EMIT event SaveJKPT]
  'function save(uint256 amount_jkpt) external',
  // withdraw JKPT from Xbit contract pool, with a withdraw fee [EMIT event WithdrawJKPT]
  'function withdraw(uint256 amount_xbit) external',
  // claim the remaining reward fee of the caller [EMIT event RewardFeeClaimed]
  'function claimRemainingRewardFee() external',
  // return the remaining reward fee to claim by the caller
  'function getRemainingRewardFee() external view returns (uint256 usdtFee, uint256 usdcFee)',
  // return the total reward fee claimed by the caller
  'function getTotalRewardFee() external view returns (uint256 usdtFee, uint256 usdcFee)',
  // register a swap [EMIT event SwapRegistered]
  'function registerSwap(tuple(bool[] relatives, uint256[] expectations, uint256[] rewards, uint256 millionth_ratio, address owner, string name, uint256 id) swap) external returns (uint256)',
  // list swap ids by owner address
  'function listSwapIds(address owner) external view returns (uint256[] swapIds)',
  // list swaps by owner address
  'function listSwaps(address owner) external view returns (tuple(bool[] relatives, uint256[] expectations, uint256[] rewards, uint256 millionth_ratio, address owner, string name, uint256 id)[] swaps)',
  // get swap by swap id
  'function getSwap(uint256 swapId) external view returns (tuple(bool[] relatives, uint256[] expectations, uint256[] rewards, uint256 millionth_ratio, address owner, string name, uint256 id) swap)',
  // play a safe swap using USDT (usdType = 0) or USDC (usdType = 1) [EMIT event RequestedRandomness]
  'function playSwap(uint256 amount, uint8 usdType, uint256 swapId) returns (uint256)',
  // get lottery request ids by address
  'function getRequestIdsByAddress(address player) external view returns (uint256[] memory)',
  // get lottery request status by id
  'function getRequestStatusById(uint256 requestId) external view returns (tuple(bool exists, bool fulfilled, uint256 requestId, address player, uint256 swapId, uint256 usdIn, uint8 usdType, uint256 jkptTicket, uint256 quantity, uint256 randomWord, uint256[] rewardLevels, uint256 xexpOut, uint256 jkptOut, uint256 swapFee, uint256 donation) memory)',
  // estimate JKPT amount by USD amount
  'function estimateUSD2JKPT(uint amountIn) public view returns (uint)',
  // get prize pool size in JKPT amount
  'function getPrizePoolSizeInJKPT() external view returns (uint256)',
  // get prize pool size in USD amount
  'function getPrizePoolSizeInUSD() external view returns (uint256)',
  // events
  'event SaveJKPT(uint256 amount_jkpt, uint256 amount_xbit, address player)',
  'event WithdrawJKPT(uint256 amount_xbit, uint256 amount_jkpt, address player)',
  'event SwapRegistered(uint256 swapId, address owner)',
  'event RequestedRandomness(uint256 reqId, address invoker)',
  'event LotteryOutcome(uint256 reqId, tuple(bool exists, bool fulfilled, uint256 requestId, address player, uint256 swapId, uint256 usdIn, uint8 usdType, uint256 jkptTicket, uint256 quantity, uint256 randomWord, uint256[] rewardLevels, uint256 xexpOut, uint256 jkptOut, uint256 swapFee, uint256 donation) status)',
  'event RewardFeeClaimed(address distributor, uint256 usdtFee, uint256 usdcFee)',
];
