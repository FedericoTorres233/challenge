// node ./getContractBalance to run this script
const Web3 = require("web3");
require("dotenv").config({path:"../.env"});

const project_id = [process.env.PROJECT_ID];
const urlNode = `${project_id}`;

const web3 = new Web3(urlNode);

const contract_address = "0x5733013b82F26585c9b44Bf5bAB1B8DE29240437";

let balance = "";

web3.eth.getBalance(contract_address).then(balance);

console.log(web3.utils.fromWei(balance,'ether'));