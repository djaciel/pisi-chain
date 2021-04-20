const TransactionPool = require('../wallet/transaction-pool');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

describe('TransactionPool', () => {
  let transactionPool, wallet, transaction;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, 'r4nd-4ddr355', 30);
    transactionPool.updateOrAddTransaction(transaction);
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
});
