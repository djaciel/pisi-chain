const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

describe('Transaction', () => {
  let transaction, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = 'r3c1p13nt';
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  test('Outputs the `amount` subtracted from the wallet balance', () => {
    expect(
      transaction.outputs.find((output) => output.address === wallet.publicKey)
        .amount
    ).toEqual(wallet.balance - amount);
  });

  test('Outputs the `amount` added to the recipient', () => {
    expect(
      transaction.outputs.find((output) => output.address === recipient).amount
    ).toEqual(amount);
  });

  describe('Transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    test('Does not create the transaction', () => {
      expect(transaction).toEqual(undefined);
    });
  });
});
