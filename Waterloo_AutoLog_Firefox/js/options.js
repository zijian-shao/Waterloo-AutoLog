function initOptions() {

    function getFeedbackLink() {
        function _getOS() {
            var OSName = "Unknown";
            if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) OSName = "Windows 10";
            if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName = "Windows 8";
            if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName = "Windows 7";
            if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName = "Windows Vista";
            if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName = "Windows XP";
            if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName = "Windows 2000";
            if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
            if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
            if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
            return OSName;
        }

        function _getBrowser() {
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return {name: 'IE ', version: (tem[1] || '')};
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/);
                if (tem != null) return {name: 'Opera', version: tem[1]};
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
            if (ua.indexOf('Edge') !== -1 || ua.indexOf('Edg') !== -1) {
                M[0] = 'Edge';
            }
            return {name: M[0], version: M[1]};
        }

        var urlTpl = getLink('feedback');
        urlTpl = urlTpl.replace('@@extVersion@@', encodeURI(browser.runtime.getManifest().version));
        urlTpl = urlTpl.replace('@@browser@@', encodeURI(_getBrowser().name + ' ' + _getBrowser().version));
        urlTpl = urlTpl.replace('@@os@@', encodeURI(_getOS()));

        return urlTpl;
    }

    function showToast(content) {
        var tst = $('#autolog-toast');
        if (content !== undefined) {
            tst.html(content);
        } else {
            tst.html('Options Saved');
        }

        tst.removeClass('autolog-toast-hidden');

        window.clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(function () {
            tst.addClass('autolog-toast-hidden');
        }, 2000);
    }

    function onHashChange() {
        var hash = window.location.hash.substring(1);
        if (!hash.length) hash = 'account';
        $('li[data-option-tab-name = "' + hash + '"]').trigger('click');
    }

    function restoreOptions() {

        var configs = getOptionListDefault();

        browser.storage.local.get(configs, function (items) {

            var optionElem;

            for (var key in items) {

                optionElem = $('[data-option-name="' + key + '"]');

                switch (key) {

                    case 'USER_ID':
                    case 'USER_Name':
                        optionElem.val(items[key]);
                        break;

                    case 'USER_Password':
                    case 'USER_CardPIN':
                        optionElem.val(decrypt(items[key], items.GLB_HashKey));
                        break;

                    case 'USER_Extension':
                        optionElem.children('option[value="' + items[key] + '"]').prop('selected', true);
                        break;

                    default:
                        optionElem.prop('checked', items[key]);
                }

            }

            bindEvents();
        });

    }

    function saveOption(obj, callback) {

        browser.storage.local.set(obj, function () {

            showToast();

            if ($.type(callback) === 'function') {
                callback();
            }
        });
    }

    function onOptionChange(elem) {
        var inputType = elem.attr('type');
        var optType = elem.attr('data-option-type');
        var optName = elem.attr('data-option-name');
        var optVal = elem.attr('data-option-value');

        if (inputType == 'checkbox') {

            switch (optType) {

                // simple switch, save as boolean
                case 'switch':

                    var obj = {};
                    obj[optName] = elem.is(':checked');
                    saveOption(obj);

                    break;

                // list of items, save as array string
                case 'item':

                    var contentArr = [];

                    $('input[data-option-name="' + optName + '"]').each(function (index, element) {
                        if ($(element).is(':checked')) {
                            contentArr.push($(element).attr('name'));
                        }
                    });

                    var obj = {};
                    obj[optName] = contentArr;
                    saveOption(obj);

                    break;

            }
        } else if (inputType == 'radio') {

            switch (optType) {
                // save "value" attr of the radio
                case 'enum':

                    var obj = {};
                    obj[optName] = elem.attr('value');
                    saveOption(obj);

                    break;
            }
        }
    }


    function bindEvents() {

        var allowHashChange = true;

        // event
        $('input').on('change', function () {
            onOptionChange($(this));
        });

        // switch between tabs
        $('.nav-tab').on('click', function () {

            if ($(this).hasClass('active'))
                return;

            var prevTabID = $('li.nav-tab.active').attr('data-option-tab-index');
            var thisTabID = $(this).attr('data-option-tab-index');

            $('#nav-tab-' + prevTabID).removeClass('active');
            $(this).addClass('active');

            allowHashChange = false;
            window.scrollTo(0, $('#opt-tab-' + thisTabID).offset().top);
            setTimeout(function () {
                allowHashChange = true;
            }, 200);

            window.location.hash = $(this).attr('data-option-tab-name');

        });

        // auto switch tab
        onHashChange();

        // toggle tips
        $('.option-tip-toggle').on('click', function () {

            $(this).parents('div.option-group').children('div.option-tip').toggleClass('hidden');

        });

        // save user info
        $('input[id^="user-"]').on('focus', function () {
            $(this).removeClass('input-box-error');
        });

        $('#user-save').on('click', function (e) {
            e.preventDefault();
            var id = $('#user-id');
            var name = $('#user-name');
            var password = $('#user-password');
            var pin = $('#user-cardpin');
            var extension = $('#user-extension');

            var alertInfo = '';
            var hasError = false;

            if (!id.val().trim().match(/[0-9]{8}/)) {
                id.addClass('input-box-error');
                alertInfo += '- User ID should be an 8-digit number.\r\n';
                hasError = true;
            }

            if (!name.val().trim().match(/[A-za-z0-9]+/ig)) {
                name.addClass('input-box-error');
                alertInfo += '- Username should contain letters or numbers.\r\n';
                hasError = true;
            }

            if (password.val().length === 0) {
                alertInfo += '- Password is empty. Forms won\'t be submitted automatically.\r\n';
            }

            if (pin.val().length === 0) {
                alertInfo += '- WatCard PIN is empty. Forms won\'t be submitted automatically.\r\n';
            }

            if (hasError) {
                alert('Save failed!\r\n' + alertInfo);
                return;
            } else {
                if (alertInfo.length > 0) {
                    alert(alertInfo);
                }
            }

            var configs = getOptionListDefault();
            browser.storage.local.get(configs, function (items) {
                var obj = {};
                obj['USER_ID'] = id.val();
                obj['USER_Name'] = name.val();
                obj['USER_Password'] = encrypt(password.val(), items.GLB_HashKey);
                obj['USER_CardPIN'] = encrypt(pin.val(), items.GLB_HashKey);
                obj['USER_Extension'] = Number(extension.val());
                saveOption(obj);
            });


        });

        $('#user-clear').on('click', function (e) {
            e.preventDefault();
            var r = confirm('Are you sure to clear local storage?');
            if (r == true) {
                $('#user-id').val('');
                $('#user-name').val('');
                $('#user-password').val('');
                $('#user-cardpin').val('');

                var obj = {};
                obj['USER_ID'] = '';
                obj['USER_Name'] = '';
                obj['USER_Password'] = '';
                obj['USER_CardPIN'] = '';

                saveOption(obj);
            }
        });

        $('#user-id, #user-name,#user-password,#user-cardpin').on('keydown', function (event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        $('#user-save').trigger('click');
                        break;
                }
            }
        });

        // scroll
        $(window).on('scroll', function () {
            if (!allowHashChange)
                return;

            var top = $(window).scrollTop();
            var currID = 0;
            $('.section').each(function (index, elem) {
                if ($(elem).offset().top + $(elem).outerHeight() - $(window).height() / 3 > top) {
                    currID = $(this).attr('data-option-index');
                    return false;
                }
            });

            $('.nav-tab').removeClass('active');
            $('#nav-tab-' + currID).addClass('active');

            window.location.hash = $('#nav-tab-' + currID).attr('data-option-tab-name');
        });
    }

    $(window).on('load', function (e) {

        $('*[data-href]').each(function (idx, elem) {
            $(elem).attr('href', getLink($(elem).attr('data-href')));
        });

        restoreOptions();

        // version #
        $('#autolog-version').text(browser.runtime.getManifest().version);

        // feedback
        $('#feedback-link').attr('href', getFeedbackLink());

    });

    window.addEventListener("hashchange", onHashChange, false);

    var timeoutHandle = setTimeout(function () {

    }, 0);

}

initOptions();