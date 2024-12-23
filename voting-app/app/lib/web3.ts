import Web3 from "web3";

let web3: Web3 | null = null;

if (typeof window !== "undefined") {
  if (typeof window.ethereum !== "undefined") {
    // MetaMask is available
    web3 = new Web3(window.ethereum);
    try {
      window.ethereum.request({ method: "eth_requestAccounts" }); // Request user accounts
    } catch (error) {
      console.error("User denied account access", error);
    }
  } else {
    console.warn("MetaMask is not installed. Please install MetaMask to use this app.");
  }
} else {
  console.error("This code is running outside the browser. 'window' is not available.");
}

export default web3;
