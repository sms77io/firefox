import {Sms} from './util/Sms';

browser.runtime.onMessage.addListener(async ({selectionText}) => {
    const text = await Sms.getText(selectionText);

    await Sms.send(text);
});