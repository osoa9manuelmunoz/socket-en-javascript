const net = require('net');

//crear el cliente tcp
const client = new net.Socket();

//conectar al servidor al puerto 8080
client.connect(8080, '127.0.0.1', () => {
    console.log('Conectado al servidor');
});

//manejar datos recibidos del servidor
client.on('data', (data) => {
    const response = JSON.parse(data.toString());
    handleServerResponse(response);
});



client.on('error', (err) => {
    console.error('Error en el cliente:', err);
});

function sendRequest(request) {
    client.write(JSON.stringify(request));
}


//funion para menjar respuesta del servidor

function handleServerResponse(response) {
    if (!response.success) {
        alert(response.message);
        return;
    }

    if (transactionType === 'balance') {
        document.getElementById('balance').classList.remove('hidden');
        document.getElementById('balance-amount').innerText = response.balance.toString();
    } else if (transactionType === 'deposit' || transactionType === 'credit' || transactionType === 'debit') {
        currentAccount.balance = response.balance;
        if (transactionType === 'deposit') {
            document.getElementById('transaction').classList.add('hidden');
            document.getElementById('balance').classList.remove('hidden');
            document.getElementById('balance-amount').innerText = currentAccount.balance.toString();
        } else {
            initialAmount = currentAccount.balance + withdrawnAmount;
            withdrawnAmount = amount;
            document.getElementById('transaction').classList.add('hidden');
            document.getElementById('withdrawal-message').classList.remove('hidden');
        }
    }
}

//exportar la funcion sendrequest para usar utilidad funcion.js
module.exports = {
    sendRequest,
};