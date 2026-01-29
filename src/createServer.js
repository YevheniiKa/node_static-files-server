'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const TEXT_PLAIN = { 'Content-Type': 'text/plain' };
const PUBLIC_DIR = path.resolve(__dirname, '../public');

function createServer() {
  return http.createServer((req, res) => {
    const url = req.url;

    if (url === '/file') {
      res.writeHead(200, TEXT_PLAIN);
      res.end('Use /file/<path> to load files');

      return;
    }

    if (!url.startsWith('/file/')) {
      res.writeHead(400, TEXT_PLAIN);
      res.end('Invalid path');

      return;
    }

    if (url.includes('//')) {
      res.writeHead(404, TEXT_PLAIN);
      res.end('Not found');

      return;
    }

    const relativePath = url.slice('/file/'.length);
    const resolvedPath = path.resolve(PUBLIC_DIR, relativePath);

    if (!resolvedPath.startsWith(PUBLIC_DIR)) {
      res.writeHead(400, TEXT_PLAIN);
      res.end('Invalid path');

      return;
    }

    fs.readFile(resolvedPath, (err, data) => {
      if (err) {
        res.writeHead(404, TEXT_PLAIN);
        res.end('File not found');

        return;
      }

      res.writeHead(200);
      res.end(data);
    });
  });
}

module.exports = { createServer };
