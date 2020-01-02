import {Sms} from '../../util/Sms';
import '../../assets/img/icon16.png';
import '../../assets/img/icon19.png';
import '../../assets/img/icon32.png';
import '../../assets/img/icon48.png';
import '../../assets/img/icon128.png';

browser.contextMenus.onClicked.addListener(async ({selectionText}) => {
    const text = await Sms.getText(selectionText);

    return await Sms.send(text, null, null, prompt);
});

browser.runtime.onInstalled.addListener(() => browser.contextMenus.create({
    contexts: ['selection'],
    title: 'Send SMS via Sms77.io',
}));