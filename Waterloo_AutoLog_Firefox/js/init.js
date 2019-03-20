var baseURL, currURL, options, configs;

function initAutoLog() {

    function init() {
        $(function () {
            browser.runtime.sendMessage({
                action: 'executeScript',
                data: {
                    file: 'js/init_idle.js'
                }
            });
        });
    }

    baseURL = browser.runtime.getURL('');
    currURL = window.location.href;
    configs = getOptionListDefault();
    browser.storage.local.get(configs, function (e) {
        options = e;
        options.USER_Password = decrypt(options.USER_Password, options.GLB_HashKey);
        options.USER_CardPIN = decrypt(options.USER_CardPIN, options.GLB_HashKey);
        init();
    });
}

initAutoLog();