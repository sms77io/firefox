export class Storage {
    constructor(rootKey, defaults) {
        this.rootKey = rootKey;
        this.defaults = defaults;
    }

    async getAll() {
        let result = await browser.storage.sync.get(this.rootKey);

        if (browser.runtime.lastError) {
            throw new Error(browser.runtime.lastError.message);
        }

        result = result[this.rootKey]

        return result ? result : this.defaults
    }

    async getByKey(key) {
        const result = await browser.storage.sync.get(this.rootKey);

        if (browser.runtime.lastError) {
            throw new Error(browser.runtime.lastError.message);
        }

        return result[this.rootKey][key];
    }

    async setByKey(key, value) {
        return await this.setObject({[key]: value});
    }

    async setObject(o) {
        await browser.storage.sync.set({[this.rootKey]: o});

        return o;
    }
}