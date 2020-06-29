export class General {
    static WRAPPER_ID = 'app-container';

    static isValidUrl(string) {
        try {
            new URL(string);

            return true;
        } catch (_) {
            return false;
        }
    }

    static async notify(message, title = browser.i18n.getMessage('sms_status'), type = 'basic') {
        return browser.runtime.sendMessage({
            action: 'NOTIFY', notification: {
                type,
                title,
                message: 'string' === typeof message
                    ? message : message.message
                        ? message.message : JSON.stringify(message),
            }
        });
    }
}