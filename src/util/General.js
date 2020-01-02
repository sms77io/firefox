export class General {
    static getLocalStoreByKey(key) {
        return new Promise((resolve, reject) =>
            chrome.storage.sync.get(key, result =>
                chrome.runtime.lastError
                    ? reject(Error(chrome.runtime.lastError.message))
                    : resolve(result[key])
            )
        );
    }

    static isValidUrl(string) {
        try {
            new URL(string);

            return true;
        } catch (_) {
            return false;
        }
    }

    static setLocalStoreByKey(key, value) {
        const obj = {};
        obj[key] = value;

        chrome.runtime.sendMessage(obj);

        chrome.storage.sync.set(obj);

        return obj;
    }
}