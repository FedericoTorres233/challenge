// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

contract ETHPool{

    address public owner;
    mapping (address => uint256) percentage;
    Person[] participants;
    uint256 pool;
    event SendFunds(address from,address to,uint256 amount);

    constructor(){
        owner = msg.sender;
    }

    struct Person{
        address receiver;
        uint256 deposit;
    }

    function depositToPool(uint256 userDeposited) payable public{
        participants.push(Person(msg.sender, userDeposited));
        percentage[msg.sender] += userDeposited;
        pool += userDeposited;
    }

    function depositRewards(uint256 reward) payable public{
        require(msg.sender==owner);
        for(uint256 a=0;a<participants.length;a++){
            address part_addr = participants[a].receiver;
            if(percentage[part_addr] != participants[a].deposit){
                participants[a].deposit = percentage[part_addr];
            }
        }

        for(uint256 i=0;i<participants.length;i++){
            address part_addr = participants[i].receiver;
            percentage[part_addr] = ((reward*participants[i].deposit)/pool)+participants[i].deposit;
        }
        delete pool;
        delete participants;
    }

    function withdrawFunds() public {
        uint256 funds = percentage[msg.sender];
        delete percentage[msg.sender];
        emit SendFunds(owner, msg.sender, funds);
    }
}