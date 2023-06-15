const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3002;

const server = http.createServer((request, response) => {
  if (request.url === '/file') {
    fs.readFile('./test.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Internal Server Error');
      } else {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end(data);
      }
    });
  } else if (request.url === '/file1') {
    try {
      const data = fs.readFileSync('./data.txt', 'utf8');
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.end(data);
    } catch (err) {
      console.error(err);
      response.statusCode = 500;
      response.setHeader('Content-Type', 'text/plain');
      response.end('Internal Server Error');
    }
  } else if (request.url === '/file2') {
    const readStream = fs.createReadStream('./test.txt', 'utf8');
    readStream.on('data', (chunk) => {
      response.write(chunk);
    });
    readStream.on('end', () => {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      response.end(); // End the response here
    });
    readStream.on('error', (err) => {
      console.error(err);
      response.statusCode = 500;
      response.setHeader('Content-Type', 'text/plain');
      response.end('Internal Server Error');
    });
  } else if (request.url === '/') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Hello, World!\n');
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
