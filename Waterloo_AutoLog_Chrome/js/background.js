var options;

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
            chrome.tabs.create({
                url: chrome.runtime.getURL('/html/options.html?welcome=show')
            });
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

function handleTabChange(tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status && changeInfo.status === 'complete') {

    }
}

function initBackground() {

    console.log('Welcome to Waterloo AutoLog!');
    chrome.runtime.onInstalled.addListener(onInstall);

    var configs = getOptionListDefault();

    chrome.storage.local.get(configs, function (items) {
        options = items;
        onUpdate(options.EXT_Version, chrome.runtime.getManifest().version);
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // execute script
        if (request.action == 'executeScript') {

            // request.data = {code:'', allFrames:false, frameId:123};
            function _executeScript(obj, func) {
                if (typeof func === 'function')
                    chrome.tabs.executeScript(sender.tab.id, obj, function () {
                        func();
                    });
                else
                    chrome.tabs.executeScript(sender.tab.id, obj);
            }

            if (Array.isArray(request.data)) {
                for (var i in request.data) {
                    _executeScript(request.data[i], sendResponse);
                }
            } else {
                _executeScript(request.data, sendResponse);
            }

        }

        // inject css
        else if (request.action == 'insertCSS') {

            function _insertCSS(obj, func) {
                if (typeof func === 'function')
                    chrome.tabs.insertCSS(sender.tab.id, obj, function () {
                        func();
                    });
                else
                    chrome.tabs.insertCSS(sender.tab.id, obj);
            }

            if (Array.isArray(request.data)) {
                for (var i in request.data) {
                    _insertCSS(request.data[i], sendResponse);
                }
            } else {
                _insertCSS(request.data, sendResponse);
            }

        }

        // app.getDetails
        else if (request.action == 'getDetails' || request.action == 'getManifest') {

            var obj = chrome.runtime.getManifest();
            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // open new tab
        else if (request.action == 'createTab') {

            request.data['index'] = sender.tab.index + 1;
            chrome.tabs.create(request.data);

            if (typeof sendResponse === 'function') sendResponse();

        }

    });

    // chrome.tabs.onUpdated.addListener(handleTabChange);
    // chrome.tabs.onCreated.addListener(handleTabChange);

}

initBackground();
