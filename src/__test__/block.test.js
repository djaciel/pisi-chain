const Block = require('../blockchain/block');

describe('Block', () => {
  let data, lastBlock, block;

  beforeEach(() => {
    data = 'bar';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  test('Sets the `data` to match the input', () => {
    expect(block.data).toEqual(data);
  });

  test('Sets the `lastHash` to match the hash of the last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
});
