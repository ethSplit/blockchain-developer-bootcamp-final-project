console.log("App is loading")
import Web3 from "web3";
import getWeb3 from "./getWeb3";
import Airdrop from "../../client/src/contracts/Airdrop.json";
import MyToken from "../../client/src/contracts/MyToken.json";
import StakingContract from "../../client/src/contracts/StakingContract.json";
import { web3 } from "@openzeppelin/test-helpers/src/setup";

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
    document.getElementById("web3-container").style.display="block";
    // grab mm-current-account
    // and populate it with the current address
    const airnetworkId = await web3.eth.net.getId();
    const airdeployedNetwork = await Airdrop.networks[airnetworkId];
    const airdropInstance = await new web3.eth.Contract(
      Airdrop.abi,
      airdeployedNetwork && airdeployedNetwork.address,
    );
    const airdrop = new web3.eth.Contract(Airdrop.abi, Airdrop.address);
    const myToken = new web3.eth.Contract(MyToken.abi, MyToken.address);
    const staking = new web3.eth.Contract(StakingContract.abi, StakingContract.address);
  
    const tokennetworkId = await web3.eth.net.getId();
    const tokdeployedNetwork = await MyToken.networks[tokennetworkId];
    const tokInstance = await new web3.eth.Contract(
      MyToken.abi,
      tokdeployedNetwork && tokdeployedNetwork.address,
    );
  
    console.log("set provider");
    airdrop.setProvider(window.ethereum)

    var mmCurrentAccount = document.getElementById('mm-current-account');
    mmCurrentAccount.innerHTML = 'Current Account: ' + ethereum.selectedAddress

    try{
      var newairdropBalance = await tokInstance.methods.balanceOf(Airdrop.networks[airnetworkId].address).call();
      const airdropDisplayBalance = document.getElementById('airdrop-balance');
      airdropDisplayBalance.innerHTML = 'Available Tokens: ' + newairdropBalance;
    } catch {
      
    }

    try {
      var stakingBalance = await stakingInstance.methods.getStake().call({ from: ethereum.selectedAddress});
      const stakingDisplayBalance = document.getElementById('staking-balance');
      stakingDisplayBalance.innerHTML = "Staked Balance: " + stakingBalance;
    } catch {
      
    }

  }
  
try {
  const claimAirdrop = document.getElementById('claim-airdrop');
  if (claimAirdrop != "undefined") {

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
    
      console.log("Check if user claimed already");
      var airdropClaimed = await airdropInstance.methods.airdropClaimed().call({ from: ethereum.selectedAddress});
      console.log("Claimed Airdrop is " + airdropClaimed);
    
      if (!airdropClaimed) {
        console.log("claim Airdrop");
        var airdropclaim = await airdropInstance.methods.claimAirdrop().send({from: ethereum.selectedAddress});
        console.log("Airdrop claim: "+airdropclaim);
      } else {
        console.log("airdrop already claimed");
        alert("Airdrop already claimed");
      }
    
      console.log("Get User Balance")
      var userBalance = await tokInstance.methods.balanceOf(ethereum.selectedAddress).call();
      console.log("User balance: "+userBalance);
    
      const myTokenDisplayValue = document.getElementById('mytoken-display-value');
    
      myTokenDisplayValue.innerHTML = 'Your Token Balance: ' + userBalance;
    
    }
    
  
  }
} catch {

}

try {
  const approveTokens = document.getElementById("approve-button");
  approveTokens.onclick = async () => {

    const myToken = new web3.eth.Contract(MyToken.abi, MyToken.address);
    const staking = new web3.eth.Contract(StakingContract.abi, StakingContract.address);

    const stakingId = await web3.eth.net.getId();
    const stakingNetwork = await Airdrop.networks[stakingId];
    const stakingInstance = await new web3.eth.Contract(
      StakingContract.abi,
      stakingNetwork && stakingNetwork.address,
    );
  
    const tokennetworkId = await web3.eth.net.getId();
    const tokdeployedNetwork = await MyToken.networks[tokennetworkId];
    const tokInstance = await new web3.eth.Contract(
      MyToken.abi,
      tokdeployedNetwork && tokdeployedNetwork.address,
    );
  
    console.log("set provider");
    staking.setProvider(window.ethereum)

    var stakingAddress = await stakingInstance.methods.getStakingToken.call({ from: ethereum.selectedAddress});
    console.log("Token address: "+stakingAddress);
  
    const tokenAmount = document.getElementById('txtNumber').value;
    console.log("Approve tokens: " + tokenAmount);
    
    var approvedTokens = await tokInstance.methods.approve(StakingContract.networks[stakingId].address, tokenAmount).send({from: ethereum.selectedAddress});
    console.log(approvedTokens);

    var spenderAmount = await tokInstance.methods.allowance(ethereum.selectedAddress, StakingContract.networks[stakingId].address).call();
    console.log("Allowance :" + spenderAmount);
  
  }
} catch {

}

try {
  const stakeTokens = document.getElementById("stake-button");
  stakeTokens.onclick = async () => {

    const myToken = new web3.eth.Contract(MyToken.abi, MyToken.address);
    const staking = new web3.eth.Contract(StakingContract.abi, StakingContract.address);

    const stakingId = await web3.eth.net.getId();
    const stakingNetwork = await StakingContract.networks[stakingId];
    const stakingInstance = await new web3.eth.Contract(
      StakingContract.abi,
      stakingNetwork && stakingNetwork.address,
    );
  
    const tokennetworkId = await web3.eth.net.getId();
    const tokdeployedNetwork = await MyToken.networks[tokennetworkId];
    const tokInstance = await new web3.eth.Contract(
      MyToken.abi,
      tokdeployedNetwork && tokdeployedNetwork.address,
    );
  
    console.log("set provider");
    staking.setProvider(window.ethereum)

    const tokenAmount = document.getElementById('txtNumber').value;
    var stakeTokensTx = await stakingInstance.methods.stake(tokenAmount).send({from: ethereum.selectedAddress});
    console.log("Stake Object:" + stakeTokensTx);
    
    var getStakedAmount = await stakingInstance.methods.getStake().call({from: ethereum.selectedAddress});
    const myStakeDisplayValue = document.getElementById('staking-balance');
    
    myStakeDisplayValue.innerHTML = 'Your Token Balance: ' + getStakedAmount;
  }
} catch {

}

try {
    const unstakeTokens = document.getElementById("unstake-button");
    unstakeTokens.onclick = async () => {
  
      const myToken = new web3.eth.Contract(MyToken.abi, MyToken.address);
      const staking = new web3.eth.Contract(StakingContract.abi, StakingContract.address);
  
      const stakingId = await web3.eth.net.getId();
      const stakingNetwork = await StakingContract.networks[stakingId];
      const stakingInstance = await new web3.eth.Contract(
        StakingContract.abi,
        stakingNetwork && stakingNetwork.address,
      );
    
      const tokennetworkId = await web3.eth.net.getId();
      const tokdeployedNetwork = await MyToken.networks[tokennetworkId];
      const tokInstance = await new web3.eth.Contract(
        MyToken.abi,
        tokdeployedNetwork && tokdeployedNetwork.address,
      );
    
      console.log("set provider");
      staking.setProvider(window.ethereum)   

      var unstake = await stakingInstance.methods.unstake(1).send({from: ethereum.selectedAddress}); 
      console.log("Unstake Object: " + unstake);    
        
      var getBalance = await tokInstance.methods.balanceOf(ethereum.selectedAddress).call();
      var newBalance = document.getElementById("balance-after-unstake");
      newBalance.innerHTML = "Token Balance :" + getBalance;
    }
} catch {

}
