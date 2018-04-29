var baseURL, currURL, options, configs;

function initAutoLog() {

    function init() {

    }

    baseURL = chrome.runtime.getURL('');
    currURL = window.location.href;
    configs = getOptionListDefault();
    chrome.storage.local.get(configs, function (e) {
        options = e;
        options.USER_Password = decrypt(options.USER_Password, options.GLB_HashKey);
        options.USER_CardPIN = decrypt(options.USER_CardPIN, options.GLB_HashKey);
        init();
    });
}

initAutoLog();