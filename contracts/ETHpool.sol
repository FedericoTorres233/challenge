// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

contract ETHPool{

    address public owner;
    mapping (address => uint256) percentage;
    Person[] participants;
    uint256 pool;
    event SendFunds(address to,uint256 amount);

    constructor(){
        owner = msg.sender;
    }

    struct Person{
        address receiver;
        uint256 deposit;
    }

    function depositToPool(uint256 userDeposited) payable public{
        participants.push(Person(msg.sender, userDeposited));
        percentage[msg.sender] = userDeposited;
        pool += userDeposited;
    }

    function depositRewards(uint256 reward) payable public{
        require(msg.sender==owner);
        for(uint256 i=0;i<participants.length;i++){
            percentage[participants[i].receiver] = ((reward*participants[i].deposit)/pool)+participants[i].deposit;
        }
        delete pool;
        delete participants;
    }

    function withdrawFunds(address userAddress) public {
        uint256 funds = percentage[userAddress];
        delete percentage[userAddress];
        emit SendFunds(msg.sender, funds);
    }
}