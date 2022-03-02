// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

contract ETHPool{

    address public owner;
    mapping (address => uint256) percentage;
    Person[] participants;
    uint256 pool;

    struct Person{
        address receiver;
        uint256 deposit;
    }

    function depositToPool(address userReceiver, uint256 userDeposited) public{
        participants.push(Person(userReceiver, userDeposited));
        percentage[userReceiver] = userDeposited;
        pool += userDeposited;
    }

    function depositRewards(uint256 reward) public{
        require(msg.sender==owner);
        for(uint256 i=0;i<participants.length;i++){
            percentage[participants[i].receiver] = ((reward*participants[i].deposit)/pool)+participants[i].deposit;
        }
        delete pool;
        delete participants;
    }

    function withdrawFunds(address userAddress) public returns(uint256 withdrawn){
        uint256 funds = percentage[userAddress];
        delete percentage[userAddress];
        return funds;
    }
}