const fs = require('fs');
const path = require('path');
const Util = require('./util');

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
            instances[name] = Util.getHash(path.join(this.instancesPath, name, 'mods'));
        });
        return instances;
    }
}

module.exports = Twitch;
