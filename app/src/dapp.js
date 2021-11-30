//console.log("App is loading")
import Web3 from "web3";
import getWeb3 from "./getWeb3";
import Airdrop from "../../client/src/contracts/Airdrop.json";
import MyToken from "../../client/src/contracts/MyToken.json";
import StakingContract from "../../client/src/contracts/StakingContract.json";

window.addEventListener('load', function() {
    if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask deteted!")
        let mmDetected = document.getElementById('mm-detected')
        mmDetected.innerHTML = "MetaMask has been detected"
    }

    else {
        console.log("MetaMask is not available")
        alert("You need to install MetaMask")
    }
})

window.addEventListener('load', function() {
  
    if (typeof window.ethereum !== 'undefined') {
      console.log('window.ethereum is enabled')
      if (window.ethereum.isMetaMask === true) {
        console.log('MetaMask is active')
        let mmDetected = document.getElementById('mm-detected')
        mmDetected.innerHTML += 'MetaMask Is Available!'
  
        // add in web3 here
        web3 = new Web3(window.ethereum)
  
      } else {
        console.log('MetaMask is not available')
        let mmDetected = document.getElementById('mm-detected')
        mmDetected.innerHTML += 'MetaMask Not Available!'
        // let node = document.createTextNode('<p>MetaMask Not Available!<p>')
        // mmDetected.appendChild(node)
      }
    } else {
      console.log('window.ethereum is not found')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += '<p>MetaMask Not Available!<p>'
    }
  })
  
  
  web3 = new Web3(window.ethereum)
  
  // Grabbing the button object,  
  
  const mmEnable = document.getElementById('mm-connect');
  
  // since MetaMask has been detected, we know
  // `ethereum` is an object, so we'll do the canonical
  // MM request to connect the account. 
  // 
  // typically we only request access to MetaMask when we
  // need the user to do something, but this is just for
  // an example
   
  mmEnable.onclick = async () => {
    await ethereum.request({ method: 'eth_requestAccounts'})
    // grab mm-current-account
    // and populate it with the current address
    var mmCurrentAccount = document.getElementById('mm-current-account');
    mmCurrentAccount.innerHTML = 'Current Account: ' + ethereum.selectedAddress
  }
  
  // grab the button for input to a contract:
  
  // const ssSubmit = document.getElementById('ss-input-button');
  
  // ssSubmit.onclick = async () => {
  //   // grab value from input
    
  //   const ssInputValue = document.getElementById('ss-input-box').value;
  //   console.log(ssInputValue)
  
  //   web3 = new Web3(window.ethereum)
  
  //   // instantiate smart contract instance
    
  //   const simpleStorage = new web3.eth.Contract(ssABI, ssAddress)
  //   simpleStorage.setProvider(window.ethereum)
  
  //   await simpleStorage.methods.store(ssInputValue).send({from: ethereum.selectedAddress})
  
  // }
  
  // const ssGetValue = document.getElementById('ss-get-value')
  
  // ssGetValue.onclick = async () => {
  
  //   web3 = new Web3(window.ethereum)
  //   console.log(web3)
  
  //   const simpleStorage = new web3.eth.Contract(ssABI, ssAddress)
  //   simpleStorage.setProvider(window.ethereum)
  
  //   var value = await simpleStorage.methods.retrieve().call()
  
  //   console.log(value)
  //   console.log(web3)
  
  //   const ssDisplayValue = document.getElementById('ss-display-value')
  
  //   ssDisplayValue.innerHTML = 'Current Simple Storage Value: ' + value
  
  // }


const claimAirdrop = document.getElementById('claim-airdrop');

claimAirdrop.onclick = async () => {
  
  console.log("trying web3");

  console.log("adding contracts");
  const airdrop = new web3.eth.Contract(Airdrop.abi, Airdrop.address);
  const myToken = new web3.eth.Contract(MyToken.abi, MyToken.address);

  const airnetworkId = await web3.eth.net.getId();
  const airdeployedNetwork = await Airdrop.networks[airnetworkId];
  const airdropInstance = await new web3.eth.Contract(
    Airdrop.abi,
    airdeployedNetwork && airdeployedNetwork.address,
  );
  const tokennetworkId = await web3.eth.net.getId();
  const tokdeployedNetwork = await MyToken.networks[tokennetworkId];
  const tokInstance = await new web3.eth.Contract(
    MyToken.abi,
    tokdeployedNetwork && tokdeployedNetwork.address,
  );

  console.log("set provider");
  airdrop.setProvider(window.ethereum)

  console.log("Get Airdorp balance");
  var airdropBalance = await tokInstance.methods.balanceOf(Airdrop.networks[airnetworkId].address).call();
  console.log("Airdrop balance :"+airdropBalance);

  console.log("Get Token Address");
  var airTokAddr = await airdropInstance.methods.getBalance().call();
  console.log("Token Address: "+airTokAddr);

  console.log("Get Claimable Amount");
  var claimAmmount = await airdropInstance.methods.getClaimableAmount().call();
  console.log("claimAmmount :" +claimAmmount);

  console.log("claim Airdrop");
  var airdropclaim = await airdropInstance.methods.claimAirdrop().send({from: ethereum.selectedAddress});
  console.log("Airdrop claim: "+airdropclaim);

  console.log("Get User Balance")
  var userBalance = await tokInstance.methods.balanceOf(ethereum.selectedAddress).call();
  console.log("User balance: "+userBalance);

  const myTokenDisplayValue = document.getElementById('mytoken-display-value');

  myTokenDisplayValue.innerHTML = 'Your Token Balance: ' + userBalance;
}