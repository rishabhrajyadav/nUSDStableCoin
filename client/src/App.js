import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./nUSDStableCoin.json";  


const App = () => {
  const contractAddress = "0x828243AF61a8edb0cAEfE0A73385aaFaf4bfe5d6";
  const contractABI = abi.abi; 
  const[state , setState] = useState({
    provider:null,
    signer:null,
    contract:null
  });
  const [totalSupply, setTotalSupply] = useState("");
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    // Connect to the injected Ethereum provider (e.g., Metamask)
    await window.ethereum.enable();
  };

  useEffect(() => {
        connectWallet();
        getTotalSupply();
   } ,[]);
   console.log(state);

   const getTotalSupply = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const totalSupply = await contract.getTotalSupply();
    setTotalSupply(totalSupply.toString());
  };

  const deposit = async () => {
    if (!amount) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Deposit ETH and receive nUSD
      const transaction = await contract.depositETH({ value: ethers.utils.parseEther(amount) });
      await transaction.wait();

      setAmount("");
      getTotalSupply();
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  const redeem = async () => {
    if (!amount) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Redeem nUSD and convert it back into ETH
      const transaction = await contract.redeemETH(ethers.utils.parseEther(amount));
      await transaction.wait();

      setAmount("");
      getTotalSupply();
    } catch (error) {
      console.error("Redeem failed:", error);
    }
  };


  return (
    <div>
       <h1>nUSDStablecoin UI</h1>
       <label htmlFor="amount">Amount:</label>
     <input type="text" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={deposit}>Deposit</button>
        <button onClick={redeem}>Redeem</button>
       <br /><br />
      <label htmlFor="totalSupply">Total Supply:</label>
       <span id="totalSupply">{totalSupply}</span>
    <br /><br />
    <button onClick={connectWallet}>Connect Wallet</button>
  </div>
  );
};

export default App;

