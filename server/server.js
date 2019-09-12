const http = require('http');
const express = require('express');
const Modpacks = require('./modpacks');
const config = require('./config.json');

const modpacks = new Modpacks();

const app = express();

app.get('/list', (req, res) => {
    res.json(modpacks.list());
});

const server = http.createServer(app);

server.listen(config.port, () => {
    console.log(`Listening on *:${config.port}`);
});
