import {Sms} from '../../util/Sms';
import '../../assets/img/icon16.png';
import '../../assets/img/icon19.png';
import '../../assets/img/icon32.png';
import '../../assets/img/icon48.png';
import '../../assets/img/icon128.png';

chrome.contextMenus.onClicked.addListener(async (info, tab) => Sms.send(await Sms.getText(info.selectionText)));

chrome.runtime.onInstalled.addListener(() => chrome.contextMenus.create({
    contexts: ['selection'],
    title: 'Send SMS via Sms77.io',
}));