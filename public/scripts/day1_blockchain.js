// this script contains the integration logic for the day1 node.js application to interact with the day1 solidity smart contract
const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

const ethereumButton = document.querySelector(".enableEthereumButton");
const showAccount = document.querySelector(".showAccount");

const initialize = () => {
  /* A page can't be manipulated safely until the document is "ready." - jQuery detects this state of readiness. 
    Code included inside $(document).ready() will only run once the page Document Object Model (DOM) is ready for JavaScript 
    code to execute. On the other hand, code included inside $(window).on( "load", function() { ... }) will run once the entire 
    page (images or iframes), not just the DOM, is ready. */
  //$(document).ready(function () {

  let accounts;
  let day1ContractABI;
  let day1ContractAddress;
  let day1Contract;

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

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

  /**
   * Contract Interactions
   */

  // in order to create a contract instance, we need the contract address and its ABI
  day1ContractAddress = "0xf2951571e96FC8D8FC57a70452f23d7CbAFf905b";

  // the Application Binary interface (ABI) of the contract code is just a list of method signatures,
  // return types, members etc of the contract in a defined JSON format.
  // This ABI is needed when you will call your contract from a real javascript client e.g. a node.js web application.
  day1ContractABI = [
    {
      constant: true,
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "day1_users",
      outputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "surname",
          type: "string",
        },
        {
          internalType: "address",
          name: "added_by",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_surname",
          type: "string",
        },
      ],
      name: "registerUser",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getNumberOfUsers",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
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

  /* The JSON interface is a JSON object describing the Application Binary Interface (ABI) for an Ethereum smart contract.
        Using this JSON interface, web3.js is able to create JavaScript object representing the smart contract and its methods and 
        events using the web3.eth.Contract object. 
        
        Load the contract schema from the abi and instantiate the contract by address
        - at(): Create an instance of the smart contract that represents your contract at a specific address.
        - deployed(): Create an instance of the smart contract that represents the default address managed by day1Contract.
        - new(): Deploy a new version of this contract to the network, getting an instance of the smart contract that represents the newly deployed instance.

        */

  // call addDay1UserToBlockchain() function on button click
  $(".addUserToBlockchainBtn").click(addDay1UserToBlockchain);

  // trigger smart contract call to getNumberOfUsersCount() function after clicking on User count button
  /*     $("#getUserCountBtn").click(function (e) {
        e.preventDefault();
        getNumberOfUsersCount();
        }); */

  // trigger smart contract call to destroyContract() function after clicking on Initiate Self Destruct button
  /*    $("#destroyDay1ContractBtn").click(function (e) {
        e.preventDefault();
        destroyContract();
        }); */

  // trigger smart contract call to toggleContractStatus() function after clicking on toggle contract status button
  /*     $("#toggleContractStatusBtn").click(function (e) {
        e.preventDefault();
        toggleContractStatus();
        }); */

  // trigger smart contract call to getContractStatus() function after clicking on check contract status button
  /*   $("#getContractStatusBtn").click(function (e) {
        e.preventDefault();
        getContractStatus();
        }); */

  //function to handle error from smart contract call
  function handle_error(err) {
    console.log("function handle_error(err).");
    // var message_type = CONSTANTS.ERROR; //error or success
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
    // var message_type = CONSTANTS.ERROR; //error or success
    var message_description =
      "Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.";

    //TODO - trigger notification
    return console.log(message_description);
  }

  // function Add to Blockchain
  async function addDay1UserToBlockchain() {
    //day1 user form data
    var fname = $(this).data("fname");
    var lname = $(this).data("lname");

    console.log("fname to add to blockchain - " + fname);
    console.log("lname to add to blockchain - " + lname);

    // solidityContext required if you use msg object in contract function e.g. msg.sender
    // var solidityContext = {from: web3.eth.accounts[1], gas:3000000}; //add gas to avoid out of gas exception

    // Day1Registry smart contract
    // function registerUser(string calldata _name, string calldata _surname) external returns(uint)

    await getAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log({ provider });
    const signer = provider.getSigner();
    const day1Contract = new ethers.Contract(
      day1ContractAddress,
      day1ContractABI,
      signer
    );
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

  //Watch for registeredDay1UserEvent, returns  fname and lname
  /* 
        var registeredDay1UserEvent = day1Contract.registeredDay1UserEvent();
        registeredDay1UserEvent.watch(function(error, result){
            if (!error)
                {
                    console.log("registeredDay1UserEvent");
                    // TODO - enable button if applicable?

                    // Remove spinner from button if applicable

                    //update text /  notification
                    //(`Added to Blockchain`);

                    // TODO - Update status in DB via ajax post then update UI button
                } else {
                    console.log(error);

                    // TODO - Update status in DB via ajax post then update UI button
                }
        }); */

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

  // function to check Day1  Contract Status - stopped or not stopped
  /* function getContractStatus() {
            if (typeof web3 === 'undefined'){
                    return handle_web3_undefined_error();
                }

            day1Contract.checkContractIsRunning(function(err, result) {
                if (err){
                    return handle_error(err);
                }

                console.log("Is Day1 Contract currently stopped " + result);
            });
        }; */

  // function to toggle contract status between stopped and not stopped
  /* function toggleContractStatus() {
            if (typeof web3 === 'undefined'){
                    return handle_web3_undefined_error();
                }

            day1Contract.checkContractIsRunning(function(err, result) {
                if (err) {
                    return handle_error(err);
                };
                var original_contract_status = result;
                console.log("Is Day1 registry Contract currently stopped before toggle: " + original_contract_status);

                day1Contract.toggleContractActive(function(err2, result2) {
                    if (err2){
                        return handle_error(err2);
                    };
                    var new_contract_status = !original_contract_status;

                    // TODO - trigger a custom notification 
                    console.log("Day1 registry Contract status toggled. Transaction submitted to Blockchain for processing");
                });
            });
        }; */

  // function to initiate contract selfdestruct
  /*  function destroyContract() {
            if (typeof web3 === 'undefined'){
                    return handle_web3_undefined_error();
                }

            day1Contract.destroy(function(err, result) {
                if (err){
                    return handle_error(err);
                }
                console.log("result: " + result);
                // TODO - trigger a custom notification 
                if (typeof result !== 'undefined')
                {
                    console.log("Contract destroy initiated");
                }
            });
        }; */
  //  });
};

// As soon as the content in the DOM is loaded we are calling our initialize function
window.addEventListener("DOMContentLoaded", initialize);
