import {General} from './General';
import {Settings} from './Settings';

export class Sms {
    static async getApiKey() {
        const errMsg = 'You need a valid API key in order to send SMS.';

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
        return Sms.promptEmpty('from',
            'You may enter a sender identifier. You can set a default one in the settings.');
    };

    static async getText(text) {
        if (!text || !text.length) {
            text = window.prompt('Please enter the SMS content.');
        }
        text = text || '';

        const signature = await Settings.getByKey('signature');
        if (signature) {
            const signaturePosition = await Settings.getByKey('signaturePosition');

            text = 'append' === signaturePosition ? `${text}${signature}` : `${signature}${text}`;
        }

        if (!text || !text.length) {
            throw new Error('You must specify a valid SMS message content.');
        }

        return text;
    };

    static async getTo() {
        let to = await Sms.promptEmpty('to', 'Please enter a recipient number or address book entry.');

        if (!to || !to.length) {
            throw new Error('You must specify a valid recipient phone number or address book entry.');
        }

        return to;
    };

    static getUrl(p, to, text, from) {
        const api = `https://gateway.sms77.io/api/sms?p=${p}&to=${to}&text=${text}&from=${from || ''}&sendwith=firefox`;

        const url = new URL(api).href;

        if (!General.isValidUrl(url)) {
            throw new Error(`Invalid URL for request: '${url}'. Please contact Sms77 on info@sms77.io.`);
        }

        return url;
    };

    static async send(text, to, from) {
        try {
            const apiKey = await Sms.getApiKey();
            if (!apiKey || !apiKey.length) {
                await General.notify(
                    'You need to set your API key in the plugins page in order to send SMS.',
                    'Missing API key!');
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
                    ? `SMS successfully sent to '${to}' from '${from}': ${text}`
                    : `An error occurred while sending SMS to '${to}'. The returned error code is: '${response}'.`
                : JSON.stringify(response);

            await General.notify(info);
        } catch (err) {
            await General.notify(err);
        }
    }
}