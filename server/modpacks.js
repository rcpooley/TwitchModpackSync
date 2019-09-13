const fs = require('fs');
const path = require('path');

const MODPACKS_PATH = path.join(__dirname, 'modpacks');

class Modpacks {
    constructor() {
        if (!fs.existsSync(MODPACKS_PATH)) {
            fs.mkdirSync(MODPACKS_PATH);
        }
    }

    list() {
        const packs = fs.readdirSync(MODPACKS_PATH);

        const list = {};

        packs.forEach(pack => {
            list[pack] = this._readModpack(path.join(MODPACKS_PATH, pack));
        });

        return list;
    }

    getUpdates(instance, state) {
        const modsPath = path.join(MODPACKS_PATH, instance, 'mods');
        if (!fs.existsSync(modsPath)) {
            return [];
        }
        const mods = fs.readdirSync(modsPath).filter(mod => {
            const stat = fs.lstatSync(path.join(modsPath, mod));
            return stat.isFile();
        });
        const clientMods = state.mods;

        const toDelete = clientMods.filter(mod => !mods.includes(mod));
        const toAdd = mods.filter(mod => !clientMods.includes(mod));

        return {toAdd, toDelete};
    }

    getModPath(instance, mod) {
        return path.join(MODPACKS_PATH, instance, 'mods', mod);
    }

    _readModpack(modpackPath) {
        return JSON.parse(fs.readFileSync(path.join(modpackPath, 'status.json'), 'utf-8'));
    }
}

module.exports = Modpacks;
