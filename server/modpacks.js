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

    _readModpack(modpackPath) {
        return JSON.parse(fs.readFileSync(path.join(modpackPath, 'status.json'), 'utf-8'));
    }
}

module.exports = Modpacks;
