// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract Voting {
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    struct Voter {
        string fullName;
        bool isRegistered;
        bool hasVoted;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    address[] public voterAddresses;
    uint public candidatesCount;
    uint public maxVotes;

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    constructor() {
        maxVotes = 2;
        candidatesCount = 0;
        admin = msg.sender; 
    }


    function addCandidate(
        string memory _name,
        string memory _party
    ) public onlyAdmin {
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            _party,
            0
        );
        candidatesCount++;
    }

    function registerVoter(
        address _voterAddress,
        string memory _fullname
    ) public {
        require(
            !voters[_voterAddress].isRegistered,
            "Voter already registered."
        );

        voters[_voterAddress] = Voter({
            fullName: _fullname,
            isRegistered: true,
            hasVoted: false
        });

        voterAddresses.push(_voterAddress);
    }


    function authenticateVoter() public view returns (bool) {
        require(voters[msg.sender].isRegistered, "Voter not registered.");
        return true;
    }

    modifier onlyRegisteredVoter() {
        require(
            voters[msg.sender].isRegistered,
            "You are not registered to vote."
        );
        _;
    }

    function vote(uint[] memory _candidateIds) public onlyRegisteredVoter {
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        require(
            _candidateIds.length <= maxVotes,
            "Exceeded maximum number of votes."
        );



        for (uint i = 0; i < _candidateIds.length; i++) {
            uint candidateId = _candidateIds[i];
            require(
                candidateId >= 0 && candidateId < candidatesCount,
                "Invalid candidate ID."
            );
            // Record the vote
            candidates[candidateId].voteCount++;
        }
       voters[msg.sender].hasVoted = true; 
    }

    // function hasAlreadyVoted(
    //     uint[] memory votedCandidates,
    //     uint candidateId
    // ) internal pure returns (bool) {
    //     for (uint i = 0; i < votedCandidates.length; i++) {
    //         if (votedCandidates[i] == candidateId) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // function vote(string memory _username, uint _candidateId) public onlyAdmin {
    //     require(voters[_username].isRegistered, "Voter not registered.");
    //     require(!voters[_username].hasVoted, "Voter has already voted.");
    //     require(
    //         _candidateId > 0 && _candidateId <= candidatesCount,
    //         "Invalid candidate ID."
    //     );

    //     voters[_username].hasVoted = true;
    //     candidates[_candidateId].voteCount++;
    // }

    function getCandidate(
        uint _candidateId
    ) public view returns (uint, string memory, uint) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        for (uint i = 0; i < candidatesCount; i++) {
            allCandidates[i] = candidates[i];
        }
        return allCandidates;
    }

    // function getVoter(
    //     string memory _username
    // ) public view returns (string memory, string memory, bool, bool) {
    //     Voter memory voter = voters[_username];
    //     return (
    //         voter.username,
    //         voter.fullName,
    //         voter.hasVoted,
    //         voter.isRegistered
    //     );
    // }

     function getVoter(address _voterAddress) public view returns (string memory, bool, bool) {
        Voter memory voter = voters[_voterAddress];
        return (voter.fullName, voter.isRegistered, voter.hasVoted);
    }

    function getAllVoters() public view returns (Voter[] memory) {
        Voter[] memory allVoters = new Voter[](voterAddresses.length);
        for (uint i = 0; i < voterAddresses.length; i++) {
            allVoters[i] = voters[voterAddresses[i]];
        }
        return allVoters;
    }
}
