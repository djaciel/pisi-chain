const TransactionPool = require('../wallet/transaction-pool');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

describe('TransactionPool', () => {
  let transactionPool, wallet, transaction;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    wallet = new Wallet();
    transaction = wallet.createTransaction('r4nd-4ddr355', 30, transactionPool);
  });

  test('Adds a transaction to the pool', () => {
    expect(
      transactionPool.transactions.find((t) => t.id === transaction.id)
    ).toEqual(transaction);
  });

  test('Updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
    transactionPool.updateOrAddTransaction(newTransaction);

    expect(
      JSON.stringify(
        transactionPool.transactions.find((t) => t.id === newTransaction.id)
      )
    ).not.toEqual(oldTransaction);
  });

  test('Clears transactions', () => {
    transactionPool.clear();
    expect(transactionPool.transactions).toEqual([]);
  });

  describe('Mixing valid and corrupt transactions', () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...transactionPool.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction(
          'r4nd-4ddr355',
          30,
          transactionPool
        );

        if (i % 2 === 0) {
          transaction.input.amount = 9999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    test('Shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(transactionPool.transactions)).not.toEqual(
        JSON.stringify(validTransactions)
      );
    });

    test('Grabs valid transactions', () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });
  });
});
