import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          // viaIR: true,
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    localhost: {
      chainId: 33333,
      url: "http://127.0.0.1:11765",
    },
    hardhat: {
      chainId: 33333,
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 16700000,
      },
      initialBaseFeePerGas: 0,
      gasPrice: 0,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [
        process.env.TESTNET_OWNER_PRIVATE_KEY ?? "unknown",
        process.env.TESTNET_MAINTAINER_PRIVATE_KEY ?? "unknown",
      ],
    },
  },
};

export default config;
