// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

contract ETHpool {
    // Declare variables, mappings, arrays and events
    address private owner;
    mapping(address => uint256) percentage;
    mapping(address => Repeated) repeated;
    mapping(address => uint256) pool_per_user;
    Person[] participants;
    uint256 public pool;
    event SendFunds(address from, address to, uint256 amount);

    // Contract creator is the owner
    constructor() {
        owner = msg.sender;
    }

    struct Repeated {
        bool isRepeated;
        uint256 accumulated;
    }

    struct Person {
        address receiver;
        uint256 deposit;
    }

    // Function that lets users deposit to pool
    function depositToPool(uint256 userDeposited) public payable {
        participants.push(Person(msg.sender, userDeposited));
        percentage[msg.sender] += userDeposited;
        pool += userDeposited;
        pool_per_user[msg.sender] += userDeposited;
    }

    // Function that lets the Team or owner deposit rewards
    function depositRewards(uint256 reward) public payable {
        require(msg.sender == owner, "Only the owner can deposit rewards");

        for (uint256 i = 0; i < participants.length; i++) {
            address part_addr = participants[i].receiver;

            // This if statement adds one user's deposits in a single mapping
            if (!repeated[part_addr].isRepeated) {
                repeated[part_addr].isRepeated = true;
                repeated[part_addr].accumulated += participants[i].deposit;
            }
            percentage[part_addr] += ((reward *
                repeated[part_addr].accumulated) / pool);
            delete repeated[part_addr];
            delete pool_per_user[part_addr];
        }
        delete pool;
        delete participants;
    }

    // Function that lets users withdraw at any time and receive their funds
    function withdrawFunds() public {
        // Remove the user from the contract
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i].receiver == msg.sender) {
                delete participants[i];
            }
        }
        uint256 funds = percentage[msg.sender];
        pool = pool - pool_per_user[msg.sender];
        delete pool_per_user[msg.sender];
        delete percentage[msg.sender];
        // Send funds to user
        emit SendFunds(owner, msg.sender, funds);
    }

    function checkDeposited() public view returns(uint256){
        return percentage[msg.sender];
    }
}
