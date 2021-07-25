pragma solidity >= 0.4.2 < 0.7.0;

contract Election {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    struct RankInfo{
        uint idNum;
        string name;
        uint voteCount;
    }
    uint startTime;
    uint public candidatesCount;
    mapping(uint => RankInfo) public ranks;
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;

    function addCandidate (string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        ranks[candidatesCount] = RankInfo(candidatesCount, _name, 0);
    }

    constructor() public {
        addCandidate('Sam Smith');
        addCandidate('Adele Blue');
        addCandidate('Sia');
        addCandidate('Bruno Mars');
        addCandidate('Static Iron');
        addCandidate('Michael Jackson');
        addCandidate('Zzase');
        addCandidate('AAA');
        addCandidate('BBB');
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount ++;
        for(uint i=1; i<candidatesCount; i++){
            if(ranks[i].idNum == _candidateId){
                ranks[i].voteCount++;
                rankingSort(i);
                break;
            }
        }
        // ranks[_candidateId].voteCount ++;
    }

    function rankingSort(uint idNum) public {
        for(uint i=idNum; i>1; i--){
            if(ranks[i].voteCount > ranks[i-1].voteCount){
                uint temp = ranks[i].idNum;
                ranks[i].idNum = ranks[i-1].idNum;
                ranks[i-1].idNum = temp;

                temp = ranks[i].voteCount;
                ranks[i].voteCount = ranks[i-1].voteCount;
                ranks[i-1].voteCount = temp;

                string memory str = ranks[i].name;
                ranks[i].name = ranks[i-1].name;
                ranks[i-1].name = str;
            }else{
                break;
            }
        }
    }

    function updateTime() public {
        startTime = now;
    }

    function fiveMinsHavePassed() public view returns (bool){
        return (now >= (startTime + 5 minutes));
    }
    
    function timeUp() public view returns (bool) {
        return (now >= 1627023600);//Fri Jul 23 2021 16:00:00       today 1:00
    }
}
    