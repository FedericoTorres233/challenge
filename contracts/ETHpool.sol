// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

contract ETHPool{

    event Log(uint256 amount);
    address private owner;
    mapping (address => uint256) percentage;
    mapping (address => Repeated) repeated;
    Person[] participants;
    uint256 pool;
    event SendFunds(address from,address to,uint256 amount);

    constructor(){
        owner = msg.sender;
    }

    struct Repeated{
        bool isRepeated;
        uint256 accumulated;
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
        require(msg.sender==owner,"Only the owner can deposit rewards");
        /*for(uint256 a=0;a<participants.length;a++){
            address part_addr = participants[a].receiver;
            if(percentage[part_addr] != participants[a].deposit){
                participants[a].deposit = percentage[part_addr];
            }
        }*/

        for(uint256 i=0;i<participants.length;i++){
            address part_addr = participants[i].receiver;
            if (!repeated[part_addr].isRepeated){
                repeated[part_addr].isRepeated = true;
                repeated[part_addr].accumulated += participants[i].deposit;
            }
            percentage[part_addr] += ((reward*repeated[part_addr].accumulated)/pool);
            delete repeated[part_addr];
        }
        delete pool;
        delete participants;
    }

    function withdrawFunds() public {
        uint256 funds = percentage[msg.sender];
        delete repeated[msg.sender];
        delete percentage[msg.sender];
        emit SendFunds(owner, msg.sender, funds);
    }
}