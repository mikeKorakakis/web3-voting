import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const QUICKNODE_API_KEY = vars.get("QUICKNODE_API_KEY");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const ganacheAccount ="0x39b2ee4d274a4a5e3652660ff17e67ed75622d063ad8a61f5707d43ae5dd1758"

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
