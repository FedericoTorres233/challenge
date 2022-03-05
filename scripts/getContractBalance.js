// node ./getContractBalance.js to run this script
const Web3 = require("web3");
require("dotenv").config({path:"../.env"});

const project_id = [process.env.PROJECT_ID];
const urlNode = `${project_id}`;

const web3 = new Web3(urlNode || "ws://localhost:8545");

const contract_address = "0x47f8d96d31a6e3260cEB415A06F7E099C67E489F";

let balance = "";

web3.eth.getBalance(contract_address).then(balance);

console.log(web3.utils.fromWei(balance,'ether'));