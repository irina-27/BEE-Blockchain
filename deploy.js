const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { interface, bytecode } = require ('./compile');

const provider = new HDWalletProvider(
    'cheese hole diary away army protect inspire range symbol lazy section scout',
    'https://sepolia.infura.io/v3/892bf0fcbcdf453d858a89cd16dba8cd'
    );
const web3 = new Web3(provider);
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    
    console.log('Attempting to deploy from account', accounts[0])

    const proposalNames = ["Proposal 1", "Proposal 2", "Proposal 3"];
    const result = await new web3.eth.Contract(JSON.parse(interface))

    .deploy({ data: bytecode, arguments: [proposalNames] })
    .send({ gas: '800000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
    };
    deploy();