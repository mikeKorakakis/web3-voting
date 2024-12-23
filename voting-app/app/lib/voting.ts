import Web3 from "web3";
import VotingContract from "../../contracts/Voting.json"; // Replace with your ABI JSON
// import { contractAddress } from "@/constants";

const contractABI = VotingContract.abi;
const contractAddress = VotingContract.networks[5777].address;

let instance: any = null;

export const getContractInstance = async (): Promise<any> => {
  if (typeof window === "undefined") {
    throw new Error("This function can only be called in the browser.");
  }

  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to use this app.");
  }

  if (!instance) {
    // Initialize Web3 and the contract instance lazily
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" }); // Request user accounts
    instance = new web3.eth.Contract(contractABI as any, contractAddress);
	
  }

  return instance;
};
