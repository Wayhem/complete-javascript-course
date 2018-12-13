const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const data = JSON.parse(json);

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true).pathname;
    if (pathName === '/products' || pathName === '/'){
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end('products page!');
    } else if (pathName === '/laptop'){
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end('laptop page!');
    } else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('not found!');
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('listening for requests now');
});