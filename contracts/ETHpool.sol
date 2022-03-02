// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

contract ETHPool{

    //mapping (address => uint256) deposit;
    //uint256 rewardCount;

    mapping (address => uint256) percentage;
    uint256 pool;

    struct Person{
        address receiver;
        uint256 deposit;
        //uint256 percentage;
    }

   /* struct Percentage{
        address person;
        uint256 percentage;
    }*/

    /*struct RewardType{
        uint256 rewardNumber;
        Person[] participantsRecord;
    }

    //RewardType[] rewardhistory;*/
    Person[] participants;

    function depositToPool(address userReceiver, uint256 userDeposited) public{
        //deposit[userReceiver] = userDeposited;
        participants.push(Person(userReceiver, userDeposited/*,0*/));
        percentage[userReceiver] = userDeposited;
        pool += userDeposited;
    }

    function depositRewards(uint256 reward) public{
        //rewardCount += 1;
        //rewardhistory.push(RewardType(rewardCount, participants));
        
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