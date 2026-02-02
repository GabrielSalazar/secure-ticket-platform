const net = require('net');

const host = 'aws-1-us-east-2.pooler.supabase.com';
const port = 6543;

console.log(`Testing connection to ${host}:${port}...`);

const client = net.createConnection({ host, port }, () => {
    console.log('Connected to server!');
    client.end();
});

client.on('error', (err) => {
    console.error('Connection failed:', err.message);
});

client.setTimeout(10000, () => {
    console.log('Connection timed out');
    client.destroy();
});
