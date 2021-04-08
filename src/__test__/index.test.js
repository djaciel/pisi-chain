const Blockchain = require('../blockchain');
const Block = require('../blockchain/block');

describe('Blockchain', () => {
  let blockchain, blockchain2;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
  });

  test('Start with genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  test('Adds a new block', () => {
    const data = 'foo';
    blockchain.addBlock(data);
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  test('Validates a valid chain', () => {
    blockchain2.addBlock('foo');

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
  });

  test('Validates a chain with a corrupt genesis block', () => {
    blockchain2.chain[0].data = 'Bad data';

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  test('Invalidates a corrupt chain', () => {
    blockchain2.addBlock('foo');
    blockchain2.chain[1].data = 'Not foo';

    expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
  });

  test('Replaces the chain with a valid chain', () => {
    blockchain2.addBlock('goo');
    blockchain.replaceChain(blockchain2.chain);

    expect(blockchain.chain).toEqual(blockchain2.chain);
  });

  test('Does not replace the chain with one of less than or equal to length', () => {
    blockchain.addBlock('foo');
    blockchain.replaceChain(blockchain2.chain);

    expect(blockchain.chain).not.toEqual(blockchain2.chain);
  });
});
