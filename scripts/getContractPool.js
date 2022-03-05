// node ./getContractPool.js to run this script
const Web3 = require("web3");
require("dotenv").config({path:"../.env"});

const project_id = [process.env.PROJECT_ID];
const urlNode = `${project_id}`;

const web3 = new Web3(urlNode || "ws://localhost:8545");

const contract_address = "0x47f8d96d31a6e3260cEB415A06F7E099C67E489F";

const abi = [
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

contract.methods.pool().call().then(console.log);