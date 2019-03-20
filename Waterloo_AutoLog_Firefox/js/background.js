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
        browser.storage.local.set({'GLB_HashKey': key}, function () {
            browser.tabs.create({
                url: browser.runtime.getURL('/html/options.html?welcome=show')
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

function handleTabChange(tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status && changeInfo.status === 'complete') {

    }
}

function initBackground() {

    console.log('Welcome to Waterloo AutoLog!');
    browser.runtime.onInstalled.addListener(onInstall);

    var configs = getOptionListDefault();

    browser.storage.local.get(configs, function (items) {
        options = items;
        onUpdate(options.EXT_Version, browser.runtime.getManifest().version);
    });

    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // execute script
        if (request.action == 'executeScript') {

            // request.data = {code:'', allFrames:false, frameId:123};
            function _executeScript(obj, func) {
                if (typeof func === 'function')
                    browser.tabs.executeScript(sender.tab.id, obj, function () {
                        func();
                    });
                else
                    browser.tabs.executeScript(sender.tab.id, obj);
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
                    browser.tabs.insertCSS(sender.tab.id, obj, function () {
                        func();
                    });
                else
                    browser.tabs.insertCSS(sender.tab.id, obj);
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

            var obj = browser.runtime.getManifest();
            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // open new tab
        else if (request.action == 'createTab') {

            request.data['index'] = sender.tab.index + 1;
            browser.tabs.create(request.data);

            if (typeof sendResponse === 'function') sendResponse();

        }

    });

    // browser.tabs.onUpdated.addListener(handleTabChange);
    // browser.tabs.onCreated.addListener(handleTabChange);

}

initBackground();
