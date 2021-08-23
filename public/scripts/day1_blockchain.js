// this script contains the integration logic for the day1 node.js application to interact with the day1 solidity smart contract

//Basic Actions Section
const ethereumButton = document.querySelector(".enableEthereumButton");
const showAccount = document.querySelector(".showAccount");

// this function will be called when content in the DOM is loaded
const initialize = () => {
  /* A page can't be manipulated safely until the document is "ready." - jQuery detects this state of readiness. 
    Code included inside $(document).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript 
    code to execute. On the other hand, code included inside $(window).on( "load", function() { ... }) will run once the entire 
    page (images or iframes), not just the DOM, is ready. */
  //$(document).ready(function () {

  // Contract and Account Objects \\
  let accounts;
  let day1ContractABI;
  let day1ContractAddress;
  let day1Contract;

  //------MetaMask Functions------\\

  // function to check if MetaMask is connected
  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  // function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window; // old school way was (typeof window.ethereum !== "undefined")
    console.log({ ethereum });
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  /* Link our Enable Ethereum Button from the index.ejs file to a function that verifies if the browser is running MetaMask 
  and asks user permission to access their accounts. You should only initiate a connection request in response to direct user action,
  such as clicking a button instead 
  of initiating a connection request on page load.
  */
  ethereumButton.addEventListener("click", () => {
    getAccount();
  });

  console.log("MetaMask is installed - " + isMetaMaskInstalled());

  /* "Connecting" or "logging in" to MetaMask effectively means "to access the user's 
  Ethereum account(s)". */
  async function getAccount() {
    // old school way of checking if metamask is installed
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      try {
        /* Ask user permission to access his accounts, this will open the MetaMask UI
                "Connecting" or "logging in" to MetaMask effectively means "to access the user's Ethereum account(s)".
                You should only initiate a connection request in response to direct user action, such as clicking a button. 
                You should always disable the "connect" button while the connection request is pending. You should never initiate a 
                connection request on page load.*/
        accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        showAccount.innerHTML = account;
        console.log(account || "Not able to get accounts");
        console.log(isMetaMaskConnected());
        if (isMetaMaskConnected()) {
          console.log("Metamask is connected :)");
        }
      } catch (err) {
        var message_description = "Access to your Ethereum account rejected.";

        //TODO - trigger pop up notification
        return console.log(message_description);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  //------/MetaMask Functions------\\

  //------Contract Setup------\\

  /**
   * Contract Interactions
   */

  // in order to create a contract instance, we need the contract address and its ABI
  // day1ContractAddress = "0xf2951571e96FC8D8FC57a70452f23d7CbAFf905b";
  // day1ContractAddress = "0x73dde6A61C038C8CC3aBb5952b4D55A7418e5054";
  day1ContractAddress = "0x2366009AFcfD5421990b033077d2cD45B98a3B77";

  // the Application Binary interface (ABI) of the contract code is just a list of method signatures,
  // return types, members etc of the contract in a defined JSON format.
  // This ABI is needed when you will call your contract from a real javascript client e.g. a node.js web application.
  day1ContractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_surname",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_submissionBlockNumber",
          "type": "uint256"
        }
      ],
      "name": "registeredDay1UserEvent",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "day1_users",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "surname",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "added_by",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_surname",
          "type": "string"
        }
      ],
      "name": "registerUser",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getNumberOfUsers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // alternative to manually adding the ABI is to get it directly from the JSON file. This is actually the better way :)
  /* try {
            const data = await $.getJSON("../contracts/Day1registry.json");
            const netId = await web3.eth.net.getId();
            const deployedNetwork = data.networks[netId];
            const day1Contract = new web3.eth.Contract(
            data.abi,
            deployedNetwork && deployedNetwork.address
            );
    } catch (err) {
        var message_description = "Error accessing contract JSON.";
        //TODO - trigger pop up notification
        return console.log(message_description);
    } */

  // The "any" network will allow spontaneous network changes
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  provider.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
      window.location.reload();
    }
  });

  console.log({ provider });

  // The Metamask plugin also allows signing transactions to send ether and
  // pay to change state within the blockchain. For this, we need the account signer
  const signer = provider.getSigner();

  // the contract object
  day1Contract = new ethers.Contract(
      day1ContractAddress,
      day1ContractABI,
      signer
  );

  //------/Contract Setup------\\

  //------UI Click Event Handlers------\\

  // trigger smart contract call to addDay1UserToBlockchain() function on UI button click
  $(".addUserToBlockchainBtn").click(addDay1UserToBlockchain);

  //------/UI Click Event Handlers------\\

  //------Custom Error Handlers------\\

  //function to handle error from smart contract call
  function handle_error(err) {
    console.log("function handle_error(err).");
    var error_data = err.data;
    var message_description = "Day1 Smart contract call failed: " + err;
    if (typeof error_data !== "undefined") {
      var error_message = error_data.message;
      if (typeof error_message !== "undefined") {
        message_description =
          "Day1 smart contract call failed: " + error_message;
      }
    }

    // TODO - trigger  notification
    return console.log(message_description);
  }

  //function to handle web 3 undefined error from smart contract call
  function handle_web3_undefined_error() {
    console.log("function handle_web3_undefined_error(err).");
    var message_description =
      "Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.";

    //TODO - trigger notification
    return console.log(message_description);
  }

  //------/Custom Error Handlers------\\

  //------Blockchain and Smart Contract Function Calls------\\

  // function Add to Blockchain
  async function addDay1UserToBlockchain() {

    $(this).addClass('disabled');
    // add spinner to button
    $(this).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 
        Adding to Blockchain...`);

    //day1 user form data
    var fname = $(this).data("fname");
    var lname = $(this).data("lname");

    console.log("fname to add to blockchain - " + fname);
    console.log("lname to add to blockchain - " + lname);

    // solidityContext required if you use msg object in contract function e.g. msg.sender
    // var solidityContext = {from: web3.eth.accounts[1], gas:3000000}; //add gas to avoid out of gas exception

    // Day1Registry smart contract
    // function registerUser(string calldata _name, string calldata _surname) external returns(uint)

    if (typeof web3 === 'undefined') {
      return handle_web3_undefined_error();
    }

    try {
      const transaction = await day1Contract.registerUser(fname, lname);
      const data = await transaction.wait();
      console.log("data: ", data);
    } catch (err) {
      console.log("Error: ", err);
    }
    var message_description = `Transaction submitted to Blockchain for processing. Check your Metamask for transaction update.`;

    //TODO - trigger notification
    console.log(message_description);
  }

   // function to get count of user entries that have been previously added to the blockchain
  function getNumberOfUsersCount() {
    if (typeof web3 === "undefined") {
      return handle_web3_undefined_error();
    }

    day1Contract.getNumberOfUsers(function (err, result) {
      if (err) {
        return handle_error(err);
      }

      let day1UserSubmissionsCount = result.toNumber(); // Output from the contract function call
      console.log("getNumberOfUsersCount: " + day1UserSubmissionsCount);
      var message_description = `Number of User Entries in Day1 registry: + ${day1UserSubmissionsCount}`;
      // TODO - trigger notification
      return console.log(message_description);
    });
  }


  //------Watch for Blockchain and Smart Contract Events------\\

  //Watch for registeredDay1UserEvent, returns  string _name, string _surname, uint _submissionBlockNumber
  day1Contract.on('registeredDay1UserEvent', (name, surname, submissionBlockNumber, event) => {
    console.log("registeredDay1UserEvent");
    console.log('First parameter name:', name);
    console.log('Second parameter surname:', surname);
    console.log('Third parameter submissionBlockNumber:', submissionBlockNumber);
    console.log('Event : ', event);  //Event object
    let btnID = 12345;
    updateAddBlockchainBtn(btnID) //Update UI Button to stop spinning
    // TODO - Update status in DB via ajax post then update UI button
  });

  //------/Watch for Blockchain and Smart Contract Events------\\

  //------AJAX Calls------\\
  function updateAddBlockchainBtn(unique_id) {
    const addToBlockchainBtnID = "#add_blockchain_" + unique_id
    const addToBlockchainBtn = $(addToBlockchainBtnID)
    console.log(addToBlockchainBtn)

    // remove spinner from button
    addToBlockchainBtn.removeClass("spinner-border");
    addToBlockchainBtn.removeClass("spinner-spinner-border-sm");
    addToBlockchainBtn.html('Added to Blockchain...');
    console.log("AddBlockchainBtn updated for user " + unique_id);
  }
  //------/AJAX Calls------\\

};

// As soon as the content in the DOM is loaded we are calling our initialize function
window.addEventListener("DOMContentLoaded", initialize);
