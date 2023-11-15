const path = require('path');
const fs = require('fs');
const solc = require('solc');

const totokenPath = path.resolve(__dirname, 'contracts', 'Totoken.sol');
console.log("totokenPath: "+totokenPath)
const source = fs.readFileSync(totokenPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Totoken.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

try {
  const compiledCode = solc.compile(JSON.stringify(input));

  // Log the compiled code to understand its structure
  console.log("Compiled Code:", compiledCode);

  if (!compiledCode) {
    throw new Error('Contract compilation failed');
  }

  // Check if the compiled code has errors
  if (compiledCode.errors && compiledCode.errors.length > 0) {
    throw new Error('Compilation errors: ' + compiledCode.errors.map(e => e.formattedMessage).join('\n'));
  }

  const contractFile = JSON.parse(compiledCode);
  const abi = contractFile.contracts['Totoken.sol'].Totoken.abi;
  const bytecode = contractFile.contracts['Totoken.sol'].Totoken.evm.bytecode.object;

  module.exports = {
    abi,
    bytecode,
  };
} catch (err) {
  console.error('Error during compilation:', err);
  process.exit(1);
}