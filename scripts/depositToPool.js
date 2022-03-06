// node ./depositRewards.js to run this script
const Web3 = require("web3");
require("dotenv").config({path:"../.env"});

const project_id = [process.env.PROJECT_ID];
const PUBLIC_KEY = [process.env.PUBLIC_KEY_0];
const PRIVATE_KEY = [process.env.PRIVATE_KEY_0];
const urlNode = `${project_id}`;

const web3 = new Web3(urlNode || "ws://localhost:8545");

const contract_address = "0x47f8d96d31a6e3260cEB415A06F7E099C67E489F";

const abi =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "SendFunds",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "checkDeposited",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "depositRewards",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "userDeposited",
				"type": "uint256"
			}
		],
		"name": "depositToPool",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pool",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

let contract = new web3.eth.Contract(abi, contract_address);

async function depositToPoolfunc(funds) {
    const nonce = await web3.eth.getTransactionCount(`${PUBLIC_KEY}`, 'latest'); // get latest nonce
    const gasEstimate = await contract.methods.depositToPool(funds).estimateGas(); // estimate gas

    // Create the transaction
    const tx = {
      'from': `${PUBLIC_KEY}`,
      'to': contract_address,
      'nonce': nonce,
      'gas': estimateGas,
      'data': contract.methods.depositToPool(funds).encodeABI()
    };

    // Sign the transaction
    const signPromise = web3.eth.accounts.signTransaction(tx, `${PRIVATE_KEY}`);
    signPromise.then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
        if (!err) {
          console.log("The hash of your transaction is: ", hash, "\n Check the status of your transaction!");
        } else {
          console.log("Something went wrong when submitting your transaction:", err)
        }
      });
    }).catch((err) => {
      console.log("Promise failed:", err);
    });
}

async function main() {
    console.log("Sent: " + 500);
    await depositToPoolfunc(500);
}

main();