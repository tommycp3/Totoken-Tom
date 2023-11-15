const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, bytecode } = require('../compile')

let totoken;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  totoken = await new web3.eth.Contract(abi)
    .deploy({ data: '0x' + bytecode, arguments: ['ipfs://Qmf1Lm9JJrqZyVYym4p3ADtZB9Vn6LevKmmAdbR6FXqJnX'] }) // Ensure 'data' format is correct
    .send({ from: accounts[0], gas: '3000000' }); // Adjust gas value if necessary
});

describe('Totoken Contract', () => {
  it('deploys a contract', () => {
    assert.ok(totoken.options.address);
  });

  it('should set the URI correctly', async () => {
    const newURI = 'http://localhost:3000/';
    await totoken.methods.setURI(newURI).send({ from: accounts[0] });
    const updatedURI = await totoken.methods.uri(0).call();
    assert.equal(updatedURI, newURI, 'URI not set correctly');
  });

  it('should mint tokens to an address', async () => {
    const tokenId = 1;
    const amount = 100;
    await totoken.methods.mint(accounts[1], tokenId, amount, '0x').send({ from: accounts[0] });
    const balance = await totoken.methods.balanceOf(accounts[1], tokenId).call();
    assert.equal(balance, amount, 'Tokens not minted correctly');
  });

  it('should mint tokens in batch to an address', async () => {
    const tokenIds = [1, 2, 3];
    const amounts = [100, 200, 300];
    await totoken.methods.mintBatch(accounts[2], tokenIds, amounts, '0x').send({ from: accounts[0] });

    for (let i = 0; i < tokenIds.length; i++) {
      const balance = await totoken.methods.balanceOf(accounts[2], tokenIds[i]).call();
      assert.equal(balance, amounts[i], 'Tokens not minted correctly');
    }
  });
});