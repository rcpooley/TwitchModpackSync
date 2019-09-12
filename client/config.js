const fs = require('fs');

const PATH = 'config.json';

class Config {
    constructor() {
        this.config = {};
        if (fs.existsSync(PATH)) {
            try {
                this.config = JSON.parse(fs.readFileSync(PATH, 'utf-8'));
            } catch (e) {
                fs.unlinkSync(PATH);
            }
        }
    }

    set(key, val) {
        this.config[key] = val;
        fs.writeFileSync(PATH, JSON.stringify(this.config, null, 2));
    }

    get(key) {
        return this.config[key];
    }
}

module.exports = Config;
