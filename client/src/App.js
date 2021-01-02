import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import walletContract from "./contracts/wallet.json"
import getWeb3 from "./getWeb3";
import "./App.css";
import Web3 from "web3";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, balance: 0 , owner: ""};
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = walletContract.networks[networkId];
      const instance = new web3.eth.Contract(
        walletContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;
    const web3 = new Web3()
    // Stores a given value, 5 by default.
    //await contract.methods.set(15).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getBal().call();
    const _owner = await contract.methods.owner().call();
    console.log('Sending money....')
    const sendmoney_response = await contract.methods.sendMoney().call({value : web3.utils.toWei(web3.utils.toBN(12), 'ether')});
    const withdraval_receipt = await contract.methods.withdraw(web3.utils.toWei("1", 'ether')).call()
    console.log('withdraw')
    console.log(withdraval_receipt)
    // Update state with the result.
    this.setState({ balance : response , owner : _owner});
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h2>Smart Contract Example</h2>
        <h3>Owner : {this.state.owner}</h3>

        <div>Your balance is is: {this.state.balance}</div>
      </div>
    );
  }
}

export default App;
