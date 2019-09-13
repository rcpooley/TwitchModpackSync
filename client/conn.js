const request = require('request');
const fs = require('fs');

class Conn {
    constructor(url) {
        this.url = url;
    }

    list() {
        return this._call('/list');
    }

    getUpdates(instance, state) {
        return this._callPost('/getUpdates', {instance, state});
    }

    downloadMod(instance, mod, outPath) {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(outPath);
            request({
                url: this.url + '/download',
                json: {instance, mod},
                headers: {
                    "content-type": "application/json",
                }
            })
                .pipe(file)
                .on('finish', resolve)
                .on('error', reject);
        });
    }

    _call(endpoint) {
        return new Promise((resolve, reject) => {
            request(this.url + endpoint, (err, resp, body) => {
                if (err) return reject(err);
                resolve(JSON.parse(body));
            });
        });
    }

    _callPost(endpoint, data) {
        return new Promise((resolve, reject) => {
            request.post({
                url: this.url + endpoint,
                json: data,
                headers: {
                    "content-type": "application/json",
                }
            }, (err, resp, body) => {
                if (err) return reject(err);
                resolve(body);
            })
        });
    }
}

module.exports = Conn;
