const Block = require('../blockchain/block');
const { DIFFICULTY } = require('../config');

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

  test('Generates a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual(
      '0'.repeat(block.difficulty)
    );
    console.log(block.toString());
  });

  test('Lowers the difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 36000)).toEqual(
      block.difficulty - 1
    );
  });

  test('Raises the difficulty for quickly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(
      block.difficulty + 1
    );
  });
});
