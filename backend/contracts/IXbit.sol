// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IXbit is IERC20 {
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

    struct TokenAddress {
        address jkpt;
        address weth;
        address usdt;
        address usdc;
        address link;
        address xexp;
    }

    event SaveJKPT(uint256 amount_jkpt, uint256 amount_xbit, address player);

    event WithdrawJKPT(
        uint256 amount_xbit,
        uint256 amount_jkpt,
        address player
    );

    event SwapRegistered(uint256 swapId, address owner);
    event RequestedRandomness(uint256 reqId, address invoker);
    event LotteryOutcome(uint256 reqId, RequestStatus status);
    event RewardFeeClaimed(
        address distributor,
        uint256 usdtFee,
        uint256 usdcFee
    );

    function getAddressJKPT() external view returns (address);

    function registerSwap(Swap memory swap) external returns (uint256);

    function getSwap(uint256 swapId) external view returns (Swap memory);

    function listSwapIds(
        address owner
    ) external view returns (uint256[] memory);

    function listSwaps(address owner) external view returns (Swap[] memory);

    function playSwap(
        uint256 amount,
        uint8 usdType,
        uint256 swapId
    ) external returns (uint256 requestId);

    function claimRemainingRewardFee() external;

    function getRemainingRewardFee()
        external
        view
        returns (uint256 usdtFee, uint256 usdcFee);

    function getTotalRewardFee()
        external
        view
        returns (uint256 usdtFee, uint256 usdcFee);

    function save(uint256 amount_jkpt) external;

    function withdraw(uint256 amount_xbit) external;

    function getRequestIdsByAddress(
        address player
    ) external view returns (uint256[] memory);

    function getRequestStatusById(
        uint256 requestId
    ) external view returns (RequestStatus memory);

    function getPrizePoolSizeInJKPT() external view returns (uint256);

    function getPrizePoolSizeInUSD() external view returns (uint256);
}
