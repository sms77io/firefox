import {General} from './General';
import {Storage} from './Storage';

export class Sms {
    static async getApiKey() {
        let apiKey = await Storage.getByKey(Storage.keys.apiKey);

        if (!apiKey) {
            apiKey = await General.prompt('Please enter a sender identifier. You can set a default one in the settings.');

            if (apiKey) {
                Storage.setByKey(Storage.keys.apiKey, apiKey);
            }
        }

        return apiKey;
    };

    static async getFrom() {
        let from = await Storage.getByKey(Storage.keys.from);

        if (!from) {
            from = await General.prompt('Please enter a sender identifier. You can set a default one in the settings.');
        }

        return from;
    };

    static async getText(text) {
        if (!text || !text.length) {
            text = await General.prompt('Please enter the SMS content.');
        }
        text = text || '';

        const signature = await Storage.getByKey(Storage.keys.signature);

        text = `${text}${signature || ''}`;

        if (!text || !text.length) {
            throw new Error('You must specify a valid SMS message content.');
        }

        return text;
    };

    static async getTo() {
        let to = await Storage.getByKey(Storage.keys.to);

        if (!to || !to.length) {
            to = await General.prompt('Recipient','Please enter a recipient number or address book entry.');
        }

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
                await General.notify('You need to set your API key in the plugins page in order to send SMS.', 'Missing API key!');
                return;
            }

            text = text || await Sms.getText();

            to = to || await Sms.getTo();

            from = from || await Sms.getFrom();

            let response = await window.fetch(Sms.getUrl(apiKey, to, text, from));
            response = await response.text();

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