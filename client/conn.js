const request = require('request');

class Conn {
    constructor(url) {
        this.url = url;
    }

    list() {
        return this._call('/list');
    }

    _call(endpoint) {
        return new Promise((resolve, reject) => {
            request(this.url + endpoint, (err, resp, body) => {
                if (err) return reject(err);
                resolve(JSON.parse(body));
            });
        });
    }
}

module.exports = Conn;
