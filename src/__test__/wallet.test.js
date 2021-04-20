const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');

describe('Wallet', () => {
  let wallet, transactionPool;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
  });

  describe('Creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'r4nd0m-4ddr355';
      transaction = wallet.createTransaction(
        recipient,
        sendAmount,
        transactionPool
      );
    });

    describe('And doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, transactionPool);
      });

      test('Doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(
          transaction.outputs.find(
            (output) => output.address === wallet.publicKey
          ).amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      test('Clones the `sendAmount` output for the recipient', () => {
        expect(
          transaction.outputs
            .filter((output) => output.address === recipient)
            .map((output) => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});
