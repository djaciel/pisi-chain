const Transaction = require('./wallet/transaction');
const Wallet = require('./wallet');
wallet = new Wallet();
amount = 50;
recipient = 'r3c1p13nt';
transaction = Transaction.newTransaction(wallet, recipient, amount);
console.log(transaction);
