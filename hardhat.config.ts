import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const QUICKNODE_API_KEY = vars.get("QUICKNODE_API_KEY");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const ganacheAccount ="0x66c5c332c9b60f15c8a080ea43707ed04c200d9a1fcbb08fd20eabec7d1c8de0"

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://delicate-floral-star.ethereum-sepolia.quiknode.pro/${QUICKNODE_API_KEY}/`,
      accounts: [
        PRIVATE_KEY,
      ],
    },
	ganache: {

		url: "http://127.0.0.1:7545", // Localhost (default: none)
		chainId: 1337, // Any network (default: none),
		accounts: [ganacheAccount]
	},
  },
};

export default config;
