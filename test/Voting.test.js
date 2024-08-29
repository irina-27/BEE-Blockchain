const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require ('../compile');

let accounts;
let voting;
let proposalNames;

beforeEach(async() =>{
    accounts = await web3.eth.getAccounts();
    proposalNames = ["Proposal 1", "Proposal 2", "Proposal 3"];
    voting =  await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ 
     data: bytecode, 
     arguments: [proposalNames]
    })
 .send({ from: accounts[0], gas: '800000'});
});



describe('Voting Contract',() =>{
    it('deploys a contract' , () =>{
        assert.ok(inbox.options.address);
    });
    it('sets the corect chairperson',async() =>{
        const chairperson = await voting.methods.chairperson().call();
        assert.equal(chairperson, accounts[0]);
    });
    it('initializes proposals correctly', async () =>{
        const proposal1 = await voting.methods.proposals(0).call();
        const proposal2 = await voting.methods.proposals(1).call();
        const proposal3 = await  voting.methods.proposals(2).call();

        assert.equal(proposal1.name, proposalNames[0]);
        assert.equal(proposal2.name, proposalNames[1]);
        assert.equal(proposal3.name, proposalNames[2]);
        });
    it('authorizes a voter', async () => {
        await voting.methods.authorize('voter123').send({from: accounts[0]});
        const voter = await voting.methods.voters('voter123').call();
        assert.equal(voter.voted, false);
    });
    it('prevents a non-chairperson from authorizing voters', async() => {
        try {
            await voting.methods.authorize(accounts[2]).send({ from: accounts[1] });
            assert(false); 
        } catch (err) {
            assert(err);
        }
    });
    it('allows a voter to vote', async() =>{
        await voting.methods.authorize(accounts[1]).send({ from: accounts[0]});
        await voting.methods.vote(1).send({ from: accounts [1]});
        const proposal = await voting.methods.proposals(1).call();
        assert.equal( proposal.voteCount,  );
    });
    it('prevents a voter from voting twice', async() => {
        await voting.methods.authorize('voter123').send({ from: accounts[0]});
        await voting.methods.vote('voter123', 1).send({ from: accounts[0]});
        try {
            await voting.methods.vote('voter123', 1).send({ from: accounts[0] });
            assert(false);
        }
        catch(err){
            assert(err);
        }
    });
    it('determines the winning proposal', async () => {
        await voting.methods.authorize('voter123').send({ from: accounts[0] });
        await voting.methods.authorize('voter456').send({ from: accounts[0] });

        await voting.methods.vote('voter123', 0).send({ from: accounts[0] });
        await voting.methods.vote('voter456', 1).send({ from: accounts[0] });

        const winningProposal = await voting.methods.winningProposal().call();
        assert.equal(winningProposal, 1);

        const winnerName = await voting.methods.winnerName().call();
        assert.equal(winnerName, proposalNames[1]);
    });
});