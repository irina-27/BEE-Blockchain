const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname,'contracts','Voting.sol');
const source = fs.readFileSync(inboxPath,'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'Voting.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode'],
            },
        },
    },
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach(err => console.error(err.formattedMessage));
}

if (!output.contracts || !output.contracts['Voting.sol']) {
    throw new Error('No contracts found in the compiled output.');
}

module.exports = {
    abi: output.contracts['Voting.sol']['Voting'].abi,
    evm: {
        bytecode: output.contracts['Voting.sol']['Voting'].evm.bytecode.object,
    },
};