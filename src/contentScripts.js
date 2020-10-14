import {General} from './util/General';

browser.runtime.onMessage.addListener(async ({selectionText}) => {
    await General.sendSMS(await General.getText(selectionText));
});