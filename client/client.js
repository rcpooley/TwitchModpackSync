const Twitch = require('./twitch');
const Config = require('./config');
const Conn = require('./conn');
const Util = require('./util');

const URL = 'http://twitchmodpacksync.tk';

async function main() {
    const config = new Config();

    const twitch = await Twitch.init(config);

    const conn = new Conn(URL);

    const serverList = await conn.list();

    const clientList = twitch.listInstances();

    const availableUpdates = Object.keys(serverList)
        .filter(pack => pack in clientList && clientList[pack].version !== serverList[pack].version);

    if (availableUpdates.length === 0) {
        console.log('No updates available');
    } else {
        console.log('Available updates: ' + availableUpdates.join(', '));

        for (let i = 0; i < availableUpdates.length; i++) {
            const pack = availableUpdates[i];
            const update = await Util.readLine(`Update ${pack} (${clientList[pack].version} -> ${serverList[pack].version})? (y/n): `);
            if (update.toLowerCase() === 'y') {
                await twitch.updateInstance(pack, serverList[pack].version, conn);
            }
        }
    }

    await Util.readLine('Hit enter to exit');
}

main().catch(console.error);
