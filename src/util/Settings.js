export class Settings {
    static object = Object.freeze({
        apiKey: '', // must be 1st as Options.jsx depends on it
        from: '', // order
        signature: '', // is
        signaturePosition: 'append',
        to: '', // important
    });

    static keys = Object.freeze(Object.keys(Settings.object));

    static async getAll() {
        const obj = {};

        for (const key of Settings.keys) {
            obj[key] = await Settings.getByKey(key);
        }

        return obj;
    }

    static getKey(key) {
        return Settings.keys.find(k => key === k);
    }

    static async getByKey(key) {
        const result = await browser.storage.sync.get(key);

        if (browser.runtime.lastError) {
            throw new Error(browser.runtime.lastError.message);
        }

        return result[key];
    }

    static async getByKeys(keys) {
        const settings = {};

        for (const key of keys) {
            settings[key] = await Settings.getByKey(key);
        }

        return settings;
    }

    static async setByKey(key, value) {
        const obj = {};
        obj[key] = value;

        return await Settings.setObject(obj);
    }

    static async setObject(o) {
        await browser.storage.sync.set(o);

        return o;
    }
}