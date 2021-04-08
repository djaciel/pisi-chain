const Blockchain = require('../blockchain');
const Block = require('../block');

describe('Blockchain', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  test('Start with genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  test('Adds a new block', () => {
    const data = 'foo';
    blockchain.addBlock(data);
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });
});
