const Twitch = require('./twitch');
const Config = require('./config');
const Conn = require('./conn');

const URL = 'http://localhost:9123';

async function main() {
    const config = new Config();

    const twitch = await Twitch.init(config);

    const conn = new Conn(URL);

    console.log(await conn.list());

    console.log(twitch.listInstances());
}

main().catch(console.error);
