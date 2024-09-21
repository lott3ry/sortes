// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IXbit.sol";
import "./IWETH.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/shared/token/ERC677/LinkToken.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/ISwapRouter02.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

abstract contract NXbit is IXbit, ERC20, ERC20Burnable, VRFConsumerBaseV2Plus {
    ERC20 _jkpt;
    IWETH _weth;
    ERC20 _usdt;
    ERC20 _usdc;
    ERC20 _xexp;
    LinkToken _link;
    address internal MAINTAINER_ADDRESS = address(0x0);

    uint256 internal constant WITHDRAW_FEE_MILLIONTH_RATIO = 1000; // 0.1%
    uint256 internal constant RAND_MAX = 2 ** 128;
    uint256 internal constant USD_DECIMALS = 6;
    uint256 internal constant USD_UNIT = 10 ** USD_DECIMALS;

    uint256[] internal requestIds;
    mapping(address => uint256[]) internal address2RequestIds;
    mapping(uint256 => RequestStatus) internal requestId2RequestStatus;

    // Chainlink variables
    AggregatorV3Interface internal immutable aggregator;
    uint256 internal subscriptionId;
    bytes32 internal keyHash;
    uint32 internal callbackGasLimit;
    uint256 internal linkThreshold;
    uint16 internal requestConfirmations = 3;
    uint32 internal numWords = 1;

    // Uniswap variables
    ISwapRouter02 internal immutable swapRouter02;
    uint24 internal constant poolFee100mu = 100;
    uint24 internal constant poolFee500mu = 500;
    uint24 internal constant poolFee3000mu = 3000;

    // === Basic functions ===
    constructor(
        TokenAddress memory addresses,
        address _addr_uniswap_swaprouter02,
        address _addr_chainlink_aggregator,
        address _addr_chainlink_vrfCoordinator
    )
        ERC20("Xbit", "XBIT")
        VRFConsumerBaseV2Plus(_addr_chainlink_vrfCoordinator)
    {
        _jkpt = ERC20(addresses.jkpt);
        _weth = IWETH(addresses.weth);
        _usdt = ERC20(addresses.usdt);
        _usdc = ERC20(addresses.usdc);
        _xexp = ERC20(addresses.xexp);
        _link = LinkToken(addresses.link);

        swapRouter02 = ISwapRouter02(_addr_uniswap_swaprouter02);
        aggregator = AggregatorV3Interface(_addr_chainlink_aggregator);
    }

    function setMaintainer(address new_maintainer) public onlyOwner {
        MAINTAINER_ADDRESS = new_maintainer;
    }

    /**
     * @dev See {ERC20-_mint}.
     */
    function _mint(address account, uint256 amount) internal virtual override {
        super._mint(account, amount);
    }

    // for testing purpose only
    // function mint(address to, uint256 amount) public onlyOwner {
    //     _mint(to, amount);
    // }

    function getAddressJKPT() external view override returns (address) {
        return address(_jkpt);
    }

    function save(uint256 amount_jkpt) external override {
        if (amount_jkpt == 0) return;
        uint256 total_jkpt = this.getPrizePoolSizeInJKPT();
        uint256 total_xbit = this.totalSupply();
        uint256 zeros_jkpt = 10 ** _jkpt.decimals();
        uint256 zeros_xbit = 10 ** this.decimals();

        uint256 amount_xbit = 0;
        if (total_xbit == 0 || total_jkpt == 0) {
            // initialize jkpt-xbit pool
            amount_xbit = (amount_jkpt * zeros_xbit) / zeros_jkpt;
        } else {
            amount_xbit = (amount_jkpt * total_xbit) / total_jkpt;
        }

        _jkpt.transferFrom(msg.sender, address(this), amount_jkpt);
        _mint(msg.sender, amount_xbit);

        emit SaveJKPT(amount_jkpt, amount_xbit, msg.sender);
    }

    function withdraw(uint256 amount_xbit) external override {
        uint256 total_jkpt = this.getPrizePoolSizeInJKPT();
        uint256 total_xbit = this.totalSupply();
        if (amount_xbit == 0 || total_xbit == 0) return;

        uint256 amount_jkpt = (amount_xbit * total_jkpt) / total_xbit;
        uint256 fee_jkpt = (amount_jkpt * WITHDRAW_FEE_MILLIONTH_RATIO) / 1e6;
        amount_jkpt -= fee_jkpt;

        burn(amount_xbit);
        _jkpt.transfer(msg.sender, amount_jkpt);
        _jkpt.transfer(MAINTAINER_ADDRESS, fee_jkpt);

        emit WithdrawJKPT(amount_xbit, amount_jkpt, msg.sender);
    }

    function claimRemainingRewardFee() external override {
        // TODO: implement
    }

    function getRemainingRewardFee()
        external
        view
        override
        returns (uint256 usdtFee, uint256 usdcFee)
    {
        // TODO: implement
    }

    function getTotalRewardFee()
        external
        view
        override
        returns (uint256 usdtFee, uint256 usdcFee)
    {
        // TODO: implement
    }

    // === Swap functions ===
    function registerSwap(
        Swap memory swap
    ) external override returns (uint256) {
        // TODO: implement
    }

    function getSwap(
        uint256 swapId
    ) external view override returns (Swap memory) {
        // TODO: implement
    }

    function listSwapIds(
        address owner
    ) external view override returns (uint256[] memory) {
        // TODO: implement
    }

    function listSwaps(
        address owner
    ) external view override returns (Swap[] memory) {
        // TODO: implement
    }

    function playSwap(
        uint256 amount,
        uint8 usdType,
        uint256 swapId
    ) external override returns (uint256 requestId) {
        // TODO: implement
    }

    function getRequestIdsByAddress(
        address player
    ) external view override returns (uint256[] memory) {
        return address2RequestIds[player];
    }

    function getRequestStatusById(
        uint256 requestId
    ) external view override returns (RequestStatus memory) {
        return requestId2RequestStatus[requestId];
    }

    function getPrizePoolSizeInJKPT() external view override returns (uint256) {
        return _jkpt.balanceOf(address(this));
    }

    function getPrizePoolSizeInUSD() external view override returns (uint256) {
        // TODO: implement
    }

    // === VRF functions ===

    function setChainlinkSubscription(
        uint256 _subscriptionId,
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint256 _linkThreshold
    ) public {
        // TODO: implement
    }

    function fundChainlinkSubscription(uint256 amount) internal {
        // TODO: implement
    }

    function fundSubscription(
        uint256 usd_amount,
        uint8 usdType
    ) internal returns (uint256) {
        // TODO: implement
    }

    function requestRandomWords() internal returns (uint256) {
        // TODO: implement
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        // TODO: implement
    }

    receive() external payable {}
}
