function randomString(len) {
    if (!Number.isInteger(len))
        return null;
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function onInstall(details) {
    if (details.reason === 'install') {
        var key = randomString(getRandomInt(20) + 10);
        browser.storage.local.set({'GLB_HashKey': key}, function () {
            browser.tabs.create({
                url: browser.runtime.getURL('') + 'html/options.html'
            });
        });

    }
}

function onUpdate(oldVer, newVer) {
    if (oldVer == newVer)
        return;

    browser.storage.local.set({'EXT_Version': newVer}, function () {
        console.log('Extension Updated!');
    });
}

function initBackground() {

    console.log('Welcome to Waterloo AutoLog!');
    browser.runtime.onInstalled.addListener(onInstall);

    var configs = getOptionListDefault();
    var options;

    browser.storage.local.get(configs, function (items) {
        options = items;
        onUpdate(options.EXT_Version, browser.runtime.getManifest().version);
    });

    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // request = {action: '', data: {type:'', content:''}}
        var obj = {};

        if (request.action == 'getDetails') {
            obj = browser.runtime.getManifest();
        }

        else if (request.action == 'createTab') {
            browser.tabs.create({
                'url': request.data.url
            });
        }

        if (typeof sendResponse === 'function') {
            sendResponse(obj);
        }

    });

}

initBackground();
