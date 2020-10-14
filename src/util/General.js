import Settings from './Settings';

export class General {
    static async sendSMS(text) {
        await General.sendSmsOrVoice('sms', text);
    }

    static async sendVoice(text) {
        await General.sendSmsOrVoice('voice', text);
    }

    static async sendSmsOrVoice(type, text, to, from) {
        try {
            const apiKey = await General.getApiKey();

            if (!(apiKey || '').length) {
                return await General.notify('api_key_set', 'api_key_required');
            }

            text = text || await General.getText();
            to = to || await General.getTo();
            from = from || await General.promptEmpty('from', browser.i18n.getMessage('prompt_from'));

            const response = await
                (await window.fetch(General.getUrl(type, apiKey, to, text, from))).text();

            type = type.toUpperCase();

            const isSMS = 'SMS' === type;
            const successCodes = [100];

            isSMS && successCodes.push(101);

            const isSuccess = successCodes.includes(
                Number.parseInt(isSMS ? response : response.split('\n')[0]));
            const transKey = isSuccess ? 'msg_dispatch_success' : 'msg_dispatch_success';
            const transArgs = isSuccess ? [from, text] : [response];

            await General.notify([transKey, [type, to, ...transArgs]]);
        } catch (err) {
            await General.notify(err);
        }
    }

    static async getText(text) {
        if (!text || !text.length) {
            text = window.prompt(browser.i18n.getMessage('prompt_text'));
        }
        text = text || '';

        const signature = await Settings.getByKey('signature');
        if (signature) {
            const signaturePosition = await Settings.getByKey('signaturePosition');

            text = 'append' === signaturePosition
                ? `${text}${signature}` : `${signature}${text}`;
        }

        if (!(text || '').length) {
            throw new Error(browser.i18n.getMessage('error_text'));
        }

        return text;
    };

    static async getTo() {
        let to = await General.promptEmpty('to', browser.i18n.getMessage('prompt_to'));

        if (!(to || '').length) {
            throw new Error(browser.i18n.getMessage('error_to'));
        }

        return to;
    };

    static toQueryParams = o => Object.entries(o).map(([k, v]) => `${k}=${v}`).join('&');

    static getUrl(endpoint, p, to, text, from) {
        const o = {p, to, text, from: from || '', sendWith: 'firefox'};
        const baseURI = 'https://gateway.sms77.io/api';
        const url = new URL(`${baseURI}/${endpoint}?${General.toQueryParams(o)}`).href;

        if (!General.isValidUrl(url)) {
            throw new Error(browser.i18n.getMessage('error_url', [url]));
        }

        return url;
    };

    static WRAPPER_ID = 'app-container';

    static isValidUrl(string) {
        try {
            new URL(string);

            return true;
        } catch (_) {
            return false;
        }
    }

    static async getApiKey() {
        const errMsg = browser.i18n.getMessage('api_key_required');

        let apiKey = await Settings.getByKey('apiKey');

        if (!apiKey) {
            apiKey = window.prompt(errMsg);

            if (apiKey) {
                await Settings.setByKey('apiKey', apiKey);
            }
        }

        if (!(apiKey || '').length) {
            throw new Error(errMsg);
        }

        return apiKey;
    };

    static async notify(message, title = 'sms_status', type = 'basic') {
        let placeholders = [];
        if (Array.isArray(message)) {
            placeholders = message[1];
            message = message[0];
        }

        const translatedMessage = browser.i18n.getMessage(message, placeholders);

        if ('' !== translatedMessage) {
            message = translatedMessage;
        }

        title = browser.i18n.getMessage(title);

        return browser.runtime.sendMessage({
            action: 'NOTIFY',
            notification: {
                message: 'string' === typeof message
                    ? message : message.message
                        ? message.message : JSON.stringify(message),
                title,
                type,
            },
        });
    }

    static async promptEmpty(key, msg) {
        let value = await Settings.getByKey(key);

        if (!(value || '').length) {
            value = window.prompt(msg);
        }

        return value;
    }
}