import {General} from './General';

export class Sms {
    static async send(text, to, from) {
        try {
            const apiKey = await Sms.getApiKey();

            if (!to) {
                to = await Sms.getTo();
            }

            if (!from) {
                from = await Sms.getFrom();
            }

            const response = await (await window.fetch(Sms.getUrl(apiKey, to, text, from))).text();

            window.alert('100' === response
                ? `SMS successfully sent to "${to}" from "${from}": ${text}`
                : `An error occured while sending SMS to "${to}". The returned error code is: "${response}".`);
        } catch (err) {
            window.alert(err);
        }
    }

    static async getTo() {
        let to = await General.getLocalStoreByKey('to');

        if (!to) {
            to = window.prompt('Please enter a recipient number or address book entry.');
        }

        if (!to || !to.length) {
            throw new Error('You must specify a valid recipient phone number or address book entry.');
        }

        return to;
    };

    static getUrl(p, to, text, from) {
        const endpoint = `https://gateway.sms77.io/api/sms?p=${p}&to=${to}&text=${text}&from=${from}&sendwith=chrome`;

        const url = new URL(endpoint).href;

        if (!General.isValidUrl(url)) {
            throw new Error(`Invalid URL for request: "${url}". Please contact Sms77 on info@sms77.io.`);
        }

        return url;
    };

    static async getText(text) {
        const signature = await General.getLocalStoreByKey('signature');

        return `${text}${signature ? signature : ''}`;
    };

    static async getFrom() {
        let from = await General.getLocalStoreByKey('from');

        if (!from) {
            from = window.prompt('Please enter a sender identifier. You can set a default one in the settings.');
        }

        return from;
    };

    static async getApiKey() {
        const apiKey = await General.getLocalStoreByKey('apiKey');

        if (!apiKey || !apiKey.length) {
            throw new Error('Your API key must be set in order to send SMS.');
        }

        return apiKey;
    };
}