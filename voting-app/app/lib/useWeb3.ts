import { useEffect, useState } from "react";
import Web3 from "web3";

const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      window.ethereum.request({ method: "eth_requestAccounts" });
      setWeb3(web3Instance);
    } else {
      console.warn("MetaMask is not installed.");
    }
  }, []);

  return web3;
};

export default useWeb3;
