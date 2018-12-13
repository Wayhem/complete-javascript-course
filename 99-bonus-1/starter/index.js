const fs = require('fs');
const http = require('http');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const data = JSON.parse(json);

const server = http.createServer((req, res) => {
    console.log('Server is accesible');
});

server.listen(1337, '127.0.0.1', () => {
    console.log('listening for requests now');
});