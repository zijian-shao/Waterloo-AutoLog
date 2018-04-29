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
        chrome.storage.local.set({'GLB_HashKey': key}, function () {
            chrome.runtime.openOptionsPage();
        });

    }
}

function onUpdate(oldVer, newVer) {
    if (oldVer == newVer)
        return;

    chrome.storage.local.set({'EXT_Version': newVer}, function () {
        console.log('Extension Updated!');
    });
}

function initBackground() {

    console.log('Welcome to Waterloo AutoLog!');
    chrome.runtime.onInstalled.addListener(onInstall);

    var configs = getOptionListDefault();
    var options;

    chrome.storage.local.get(configs, function (items) {
        options = items;
        onUpdate(options.EXT_Version, chrome.runtime.getManifest().version);
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // request = {action: '', data: {type:'', content:''}}
        var obj = {};

        if (request.action == 'getDetails') {
            obj = chrome.runtime.getManifest();
        }

        else if (request.action == 'createTab') {
            chrome.tabs.create({
                'url': request.data.url
            });
        }

        if (typeof sendResponse === 'function') {
            sendResponse(obj);
        }

    });

}

initBackground();
