// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {

    struct Voter {
        bool voted;
        uint vote;
    }

    struct Proposal {
        string name;
        uint voteCount;
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    constructor(string[] memory proposalNames) {
        chairperson = msg.sender;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    // Updated to use address instead of string
    function authorize(address voter) public {
        require(msg.sender == chairperson, "Only the chairperson can authorize voters.");
        require(!voters[voter].voted, "The voter has already voted.");
        voters[voter].voted = false;
    }

    // Updated to use address instead of string
    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You have already voted.");
        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += 1;
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() public view returns (string memory winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
