const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Modpacks = require('./modpacks');
const config = require('./config.json');

const modpacks = new Modpacks();

const app = express();

app.use(bodyParser.json({type: 'application/json'}));

app.get('/list', (req, res) => {
    res.json(modpacks.list());
});

app.post('/getUpdates', (req, res) => {
    const {instance, state} = req.body;
    res.json(modpacks.getUpdates(instance, state));
});

app.get('/download', (req, res) => {
    const {instance, mod} = req.body;
    res.download(modpacks.getModPath(instance, mod));
});

const server = http.createServer(app);

server.listen(config.port, () => {
    console.log(`Listening on *:${config.port}`);
});
