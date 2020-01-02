export class Storage {
    static keys = Object.freeze({
        apiKey: 'apiKey',
        from: 'from',
        signature: 'signature',
        to: 'to',
    });

    static getByKey(key) {
        return new Promise((resolve, reject) =>
            browser.storage.sync.get(key, result =>
                browser.runtime.lastError
                    ? reject(Error(browser.runtime.lastError.message))
                    : resolve(result[key])
            )
        );
    }

    static setByKey(key, value) {
        const obj = {};
        obj[key] = value;

        browser.runtime.sendMessage(obj);

        browser.storage.sync.set(obj);

        return obj;
    }
}