import {General} from './General';
import {Settings} from './Settings';

export class Sms {
    static async getApiKey() {
        const errMsg = browser.i18n.getMessage('api_key_required');

        let apiKey = await Settings.getByKey('apiKey');

        if (!apiKey) {
            apiKey = window.prompt(errMsg);

            if (apiKey) {
                await Settings.setByKey('apiKey', apiKey);
            }
        }

        if (!apiKey || !apiKey.length) {
            throw new Error(errMsg);
        }

        return apiKey;
    };

    static async promptEmpty(key, msg) {
        let value = await Settings.getByKey(key);

        if (!value || !value.length) {
            value = window.prompt(msg);
        }

        return value;
    }

    static async getFrom() {
        return Sms.promptEmpty('from', browser.i18n.getMessage('prompt_from'));
    };

    static async getText(text) {
        if (!text || !text.length) {
            text = window.prompt(browser.i18n.getMessage('prompt_text'));
        }
        text = text || '';

        const signature = await Settings.getByKey('signature');
        if (signature) {
            const signaturePosition = await Settings.getByKey('signaturePosition');

            text = 'append' === signaturePosition ? `${text}${signature}` : `${signature}${text}`;
        }

        if (!text || !text.length) {
            throw new Error(browser.i18n.getMessage('error_text'));
        }

        return text;
    };

    static async getTo() {
        let to = await Sms.promptEmpty('to', browser.i18n.getMessage('prompt_to'));

        if (!to || !to.length) {
            throw new Error(browser.i18n.getMessage('error_to'));
        }

        return to;
    };

    static getUrl(p, to, text, from) {
        const api = `https://gateway.sms77.io/api/sms?p=${p}&to=${to}&text=${text}&from=${from || ''}&sendWith=firefox`;

        const url = new URL(api).href;

        if (!General.isValidUrl(url)) {
            throw new Error(browser.i18n.getMessage('error_url', [url]));
        }

        return url;
    };

    static async send(text, to, from) {
        try {
            const apiKey = await Sms.getApiKey();
            if (!apiKey || !apiKey.length) {
                await General.notify(browser.i18n.getMessage('api_key_set'),
                    browser.i18n.getMessage('api_key_required'));
                return;
            }

            text = text || await Sms.getText();

            to = to || await Sms.getTo();

            from = from || await Sms.getFrom();

            const url = Sms.getUrl(apiKey, to, text, from);

            const res = await window.fetch(url);
            const response = await res.text();

            const info = 'string' === typeof response
                ? '100' === response
                    ? browser.i18n.getMessage('sms_dispatch_success', [to, from, text])
                    :  browser.i18n.getMessage('sms_dispatch_error', [to, response])
                : JSON.stringify(response);

            await General.notify(info);
        } catch (err) {
            await General.notify(err);
        }
    }
}