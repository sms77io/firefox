export class General {
    static isValidUrl(string) {
        try {
            new URL(string);

            return true;
        } catch (_) {
            return false;
        }
    }

    static async notify(message, title = 'SMS Status', type = 'basic', id = '') {
        return browser.notifications.create(id, {
            type,
            title,
            message: 'string' === typeof message
                ? message : message.message
                    ? message.message : JSON.stringify(message),
        });
    }

    static async prompt(msg, value = null) {
        if ('moz-extension:' === location.protocol) {
            const input = await browser.tabs.executeScript({code: `window.prompt('${msg}')`});
            return input.length ? input.shift() : null;

        } else {
            return window.prompt(msg);
        }

    }
}