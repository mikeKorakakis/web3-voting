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
        uint[] votedCandidateIds;
    }

    mapping(address => bool) public admins;
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    // uncomment to add unique party votes
    // mapping(string => uint) public partyVotes;
    address[] public voterAddresses;
    uint public candidatesCount;
    uint public maxVotes;
    bool public votingOpen;

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can perform this action.");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(
            voters[msg.sender].isRegistered,
            "You are not registered to vote."
        );
        _;
    }

    constructor() {
        maxVotes = 2;
        candidatesCount = 0;
        admins[msg.sender] = true;
        votingOpen = false;
    }

    function openVoting() public onlyAdmin {
        votingOpen = true;
    }

    function closeVoting() public onlyAdmin {
        votingOpen = false;
    }

    function registerAdmin() external {
        require(!admins[msg.sender], "Already an admin");
        admins[msg.sender] = true;
    }

    function authenticate() public view returns (string memory) {
        bool isAdmin = admins[msg.sender];
        bool isVoter = voters[msg.sender].isRegistered;

        if (isAdmin) {
            return "ADMIN";
        } else if (isVoter) {
            return "VOTER";
        } else {
            return ("UNREGISTERED");
        }
    }

    function getCandidate(
        uint _candidateId
    ) public view returns (uint, string memory, string memory, uint) {
        Candidate memory candidate = candidates[_candidateId];

        uint voteCount = votingOpen ? 0 : candidate.voteCount; // Hide vote count if voting is open

        return (candidate.id, candidate.name, candidate.party, voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        for (uint i = 0; i < candidatesCount; i++) {
            if (votingOpen) {
                allCandidates[i] = Candidate(
                    candidates[i].id,
                    candidates[i].name,
                    candidates[i].party,
                    0
                );
            } else {
                allCandidates[i] = candidates[i];
            }
        }
        return allCandidates;
    }

    function addCandidate(
        string memory _name,
        string memory _party
    ) public onlyAdmin {
        require(!votingOpen, "Voting has started.");
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            _party,
            0
        );
        candidatesCount++;
    }

    function updateCandidate(
        uint _candidateId,
        string memory _newName,
        string memory _newParty
    ) public onlyAdmin {
        require(!votingOpen, "Cannot update candidates while voting is open.");
        require(_candidateId < candidatesCount, "Invalid candidate ID.");

        Candidate storage candidate = candidates[_candidateId];

        candidate.name = _newName;
        candidate.party = _newParty;
    }

    function deleteCandidate(uint _candidateId) public onlyAdmin {
        require(!votingOpen, "Cannot delete candidates while voting is open.");
        require(_candidateId < candidatesCount, "Invalid candidate ID.");

        uint lastIndex = candidatesCount - 1;

        if (_candidateId != lastIndex) {
            Candidate memory lastCandidate = candidates[lastIndex];
            candidates[_candidateId] = lastCandidate;
            candidates[_candidateId].id = _candidateId;
        }

        delete candidates[lastIndex];
        candidatesCount--;
    }

    function registerVoter(string memory _fullname) public {
        require(!voters[msg.sender].isRegistered, "Voter already registered.");
        require(!admins[msg.sender], "Already registered as an admin.");

        voters[msg.sender] = Voter({
            fullName: _fullname,
            isRegistered: true,
            hasVoted: false,
            votedCandidateIds: new uint[](maxVotes)
        });

        voterAddresses.push(msg.sender);
    }

    function vote(uint[] memory _candidateIds) public onlyRegisteredVoter {
        require(votingOpen, "Voting is not open.");
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        require(
            _candidateIds.length <= maxVotes,
            "Exceeded maximum number of votes."
        );

        // uncomment to add unique party votes
        // string memory selectedParty = candidates[_candidateIds[0]].party;

        for (uint i = 0; i < _candidateIds.length; i++) {
            uint candidateId = _candidateIds[i];
            require(
                candidateId >= 0 && candidateId < candidatesCount,
                "Invalid candidate ID."
            );
            candidates[candidateId].voteCount++;
        }
        // uncomment to add unique party votes
        // partyVotes[selectedParty]++;

        voters[msg.sender].votedCandidateIds = _candidateIds;
        voters[msg.sender].hasVoted = true;
    }

    function getVoter()
        public
        view
        returns (string memory, bool, bool, uint[] memory)
    {
        Voter memory voter = voters[msg.sender];
        return (
            voter.fullName,
            voter.isRegistered,
            voter.hasVoted,
            voter.votedCandidateIds
        );
    }

    function getAllVoters() public view returns (Voter[] memory) {
        Voter[] memory allVoters = new Voter[](voterAddresses.length);
        for (uint i = 0; i < voterAddresses.length; i++) {
            allVoters[i] = voters[voterAddresses[i]];
        }
        return allVoters;
    }

    // uncomment to add unique party votes
    // 	function getPartyVotes() public view returns (string[] memory, uint[] memory) {
    //     uint partyCount = 0;
    //     string[] memory tempPartyNames = new string[](candidatesCount);
    //     mapping(string => bool) memory countedParties;


    //     for (uint i = 0; i < candidatesCount; i++) {
    //         string memory party = candidates[i].party;
    //         if (!countedParties[party]) {
    //             countedParties[party] = true;
    //             tempPartyNames[partyCount] = party;
    //             partyCount++;
    //         }
    //     }


    //     string[] memory partyNames = new string[](partyCount);
    //     uint[] memory voteCounts = new uint[](partyCount);


    //     for (uint i = 0; i < partyCount; i++) {
    //         partyNames[i] = tempPartyNames[i];
    //         voteCounts[i] = partyVotes[partyNames[i]];
    //     }

    //     return (partyNames, voteCounts);
    // }
}
