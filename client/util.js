const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class Util {
    static getUserHome() {
        return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
    }

    static readLine(prompt) {
        return new Promise(resolve => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(prompt, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }

    static getHash(pathh) {
        const stat = fs.lstatSync(pathh);
        if (stat.isDirectory()) {
            const hash = crypto.createHash('md5');
            fs.readdirSync(pathh).forEach(file => {
                const fp = path.join(pathh, file);
                const stat = fs.lstatSync(fp);
                if (stat.isFile()) {
                    hash.update(Util.getHash(fp));
                }
            });
            return hash.digest('hex');
        } else {
            return crypto.createHash('md5').update(fs.readFileSync(pathh)).digest('hex');
        }
    }
}

module.exports = Util;
