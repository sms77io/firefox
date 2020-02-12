browser.runtime.onMessage.addListener(async ({action, notification}) => {
    if ('NOTIFY' === action) {
        notification = {
            ...{
                type: 'basic',
                title: 'Sms77 has something to say...',
            },
            ...notification
        };

        await browser.notifications.create(notification);
    }
});

browser.contextMenus.onClicked.addListener(async ({selectionText}) => {
    const activeTab = [...await browser.tabs.query({active: true})].shift();

    await browser.tabs.sendMessage(activeTab.id, {selectionText});
});

browser.runtime.onInstalled.addListener(() => browser.contextMenus.create({
    contexts: ['selection'],
    title: 'Send SMS via Sms77.io',
}));
