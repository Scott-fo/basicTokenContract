import React from 'react';
import './App.css';
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"
import Token from "./artifacts/contracts/Token.sol/Token.json"
import { ethers } from 'ethers';

const greeterAddress = "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853";
const tokenAddress = "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6";

function App() {
  const [greeting, setGreetingValue] = React.useState();
  const [userAccount, setUserAccount] = React.useState();
  const [amount, setAmount] = React.useState();

  //Get MetaMask account access
  const requestAccount = async() => {
    await window.ethereum.request({ method : "eth_requestAccounts" });
  };

  const fetchGreeting = async() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);

      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("error: ", err);
      };
    };
  };

  const getBalance = async() => {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  const sendCoins = async() => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  const setGreeting = async() => {
    if(!greeting) return;

    if (typeof window.ethereum !== "undefined") {
      await requestAccount()

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);

      const transaction = await contract.setGreeting(greeting);
      await transaction.wait()
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set Greeting" />
        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>
  );
}

export default App;
