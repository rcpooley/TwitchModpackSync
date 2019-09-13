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
}

module.exports = Util;
