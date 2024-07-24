const net = require('net');

// Simulación de cuentas en el servidor
const accounts = {
    '1234567890123456': {
        password: '123',
        balance: 1000
    },
    '9876543210987654': {
        password: '456',
        balance: 1500
    }
};

// Crear el servidor TCP
const server = net.createServer((socket) => {
    console.log('Cliente conectado');

    socket.on('data', (data) => {
        const message = data.toString();
        console.log('Mensaje recibido del cliente:', message);
        const response = handleRequest(JSON.parse(message));
        socket.write(JSON.stringify(response));
    });

    socket.on('end', () => {
        console.log('Cliente desconectado');
    });

    socket.on('error', (err) => {
        console.error('Error en el socket:', err);
    });
});

// Escuchar en el puerto 8080
server.listen(8080, () => {
    console.log('Servidor TCP escuchando en el puerto 8080');
});

// Función para manejar las solicitudes del cliente
function handleRequest(request) {
    const { type, cardNumber, password, amount } = request;
    const account = accounts[cardNumber];

    if (!account) {
        return { success: false, message: 'Número de tarjeta no válido.' };
    }

    if (type !== 'balance' && account.password !== password) {
        return { success: false, message: 'Contraseña incorrecta.' };
    }

    switch (type) {
        case 'balance':
            return { success: true, balance: account.balance };
        case 'deposit':
            account.balance += amount;
            return { success: true, balance: account.balance };
        case 'withdraw':
            if (account.balance >= amount) {
                account.balance -= amount;
                return { success: true, balance: account.balance };
            } else {
                return { success: false, message: 'Saldo insuficiente.' };
            }
        default:
            return { success: false, message: 'Tipo de transacción no válido.' };
    }
}