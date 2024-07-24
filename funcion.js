const { sendRequest } = require('./socket_cliente');

var currentAccount = null;
var transactionType = '';
var initialAmount = 0;
var withdrawnAmount = 0;
var currentCardNumber = null;

function enterCard() {
    var cardNumber = document.getElementById('card-number').value;
    currentCardNumber = cardNumber;
    var request = { type: 'balance', cardNumber: cardNumber };
    sendRequest(request);
}

function showTransaction(type) {
    transactionType = type;
    var title = '';
    if (type === 'deposit') {
        title = 'Consignación';
    } else if (type === 'credit' || type === 'debit') {
        title = 'Retiro';
    } else if (type === 'balance') {
        title = 'Consulta de saldo';
    }
    document.getElementById('transaction-title').innerText = title;
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('password-entry').classList.remove('hidden');
}

function verifyPassword() {
    var password = document.getElementById('password').value;
    var request = { type: transactionType, cardNumber: currentCardNumber, password: password };
    sendRequest(request);
}

function processTransaction() {
    var amount = parseFloat(document.getElementById('transaction-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, ingrese un monto válido.');
        return;
    }

    var request = { 
        type: transactionType === 'deposit' ? 'deposit' : 'withdraw', 
        cardNumber: currentCardNumber, 
        password: document.getElementById('password').value, 
        amount: amount 
    };
    sendRequest(request);
}

function showBalance() {
    if (currentAccount) {
        document.getElementById('balance').classList.remove('hidden');
        document.getElementById('balance-amount').innerText = currentAccount.balance.toString();
    }
}

function showReceipt() {
    document.getElementById('withdrawal-message').classList.add('hidden');
    document.getElementById('receipt').classList.remove('hidden');
    document.getElementById('initial-amount').innerText = initialAmount.toString();
    document.getElementById('withdrawn-amount').innerText = withdrawnAmount.toString();
    document.getElementById('final-amount').innerText = (currentAccount ? currentAccount.balance : 0).toString();
}

function goBackToMenu() {
    document.getElementById('balance').classList.add('hidden');
    document.getElementById('withdrawal-message').classList.add('hidden');
    document.getElementById('receipt').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
}

function restart() {
    currentAccount = null;
    transactionType = '';
    document.getElementById('withdrawal-message').classList.add('hidden');
    document.getElementById('receipt').classList.add('hidden');
    document.getElementById('card-entry').classList.remove('hidden');
    document.getElementById('card-number').value = '';
    document.getElementById('password').value = '';
    document.getElementById('transaction-amount').value = '';
}