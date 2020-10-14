browser.runtime.onMessage.addListener(async ({action, notification}) => {
    if ('NOTIFY' !== action) {
        // noinspection JSForgottenDebugStatementInspection
        console.warn(`Unknown Action "${action}".`);
    }

    await browser.notifications.create({
        title: browser.i18n.getMessage('notification_title'),
        type: 'basic',
        ...notification
    });
});

browser.contextMenus.onClicked.addListener(async ({selectionText}) => {
    await browser.tabs.sendMessage(
        (await browser.tabs.query({active: true})).shift().id, {selectionText});
});

browser.runtime.onInstalled.addListener(() => browser.contextMenus.create({
    contexts: ['selection'],
    title: browser.i18n.getMessage('send_via_us'),
}));
