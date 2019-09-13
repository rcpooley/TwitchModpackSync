const fs = require('fs');
const path = require('path');
const Util = require('./util');

const STATUS_FILE = 'tms.json';

class Twitch {
    static async init(config) {
        const twitch = new Twitch(config);
        await twitch._init();
        return twitch;
    }

    constructor(config) {
        this.config = config;
    }

    async _init() {
        this.instancesPath = await this._getInstancesPath();
    }

    async _getInstancesPath() {
        const defaultPath = path.join(Util.getUserHome(), 'Twitch/Minecraft/Instances');

        let instancesPath = this.config.get('twitchPath') || defaultPath;

        while (!fs.existsSync(instancesPath)) {
            console.log(`Failed to find twitch at ${instancesPath}`);
            instancesPath = await Util.readLine('Paste correct path here (including Twitch/Minecraft/Instances): ');
            this.config.set('twitchPath', instancesPath);
        }

        return instancesPath;
    }

    listInstances() {
        const names = fs.readdirSync(this.instancesPath);
        const instances = {};
        names.forEach(name => {
            const statusPath = path.join(this.instancesPath, name, STATUS_FILE);
            let status = {};
            if (fs.existsSync(statusPath)) {
                try {
                    status = JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
                } catch (e) {
                    fs.unlinkSync(statusPath);
                }
            }
            if (!('version' in status)) {
                status.version = '1.0';
            }
            instances[name] = status;
        });
        return instances;
    }

    getInstanceState(instance) {
        const modsPath = path.join(this.instancesPath, instance, 'mods');
        const files = fs.readdirSync(modsPath)
            .filter(file => {
                const stat = fs.lstatSync(path.join(modsPath, file));
                return stat.isFile();
            });
        return {
            mods: files
        };
    }

    async updateInstance(instance, newVersion, conn) {
        const updates = await conn.getUpdates(instance, this.getInstanceState(instance));

        const instancePath = path.join(this.instancesPath, instance);
        const modsPath = path.join(instancePath, 'mods');
        const statusPath = path.join(instancePath, STATUS_FILE);

        updates.toDelete.forEach(mod => {
            console.log(`Deleting ${mod}`);
            fs.unlinkSync(path.join(modsPath, mod));
        });

        for (let i = 0; i < updates.toAdd.length; i++) {
            const mod = updates.toAdd[i];
            console.log(`Downloading ${mod}`);
            await conn.downloadMod(instance, mod, path.join(modsPath, mod));
        }

        fs.writeFileSync(statusPath, JSON.stringify({version: newVersion}));
    }
}

module.exports = Twitch;
