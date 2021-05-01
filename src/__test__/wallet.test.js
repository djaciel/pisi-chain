const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {
  let wallet, transactionPool, blockchain;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
    blockchain = new Blockchain();
  });

  describe('Creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'r4nd0m-4ddr355';
      transaction = wallet.createTransaction(
        recipient,
        sendAmount,
        blockchain,
        transactionPool
      );
    });

    describe('And doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(
          recipient,
          sendAmount,
          blockchain,
          transactionPool
        );
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

  describe('Calculating a balance', () => {
    let addBalance, repeatAdd, senderWallet;

    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;

      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(
          wallet.publicKey,
          addBalance,
          blockchain,
          transactionPool
        );
      }

      blockchain.addBlock(transactionPool.transactions);
    });

    test('Calculates the balance for blockchain transactions matching the recipient', () => {
      expect(wallet.calculateBalance(blockchain)).toEqual(
        INITIAL_BALANCE + addBalance * repeatAdd
      );
    });

    test('Calculates the balance for blockchain transactions matching the sender', () => {
      expect(senderWallet.calculateBalance(blockchain)).toEqual(
        INITIAL_BALANCE - addBalance * repeatAdd
      );
    });

    describe('And the recipient conducts a transaction', () => {
      let subtractBalance, recipientBalance;

      beforeEach(() => {
        transactionPool.clear();
        subtractBalance = 60;
        recipientBalance = wallet.calculateBalance(blockchain);
        wallet.createTransaction(
          senderWallet.publicKey,
          subtractBalance,
          blockchain,
          transactionPool
        );
        blockchain.addBlock(transactionPool.transactions);
      });

      describe('And the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          transactionPool.clear();
          senderWallet.createTransaction(
            wallet.publicKey,
            addBalance,
            blockchain,
            transactionPool
          );
          blockchain.addBlock(transactionPool.transactions);
        });

        test('Calculate the recipient balance only using transactions since its most recent one', () => {
          expect(wallet.calculateBalance(blockchain)).toEqual(
            recipientBalance - subtractBalance + addBalance
          );
        });
      });
    });
  });
});
