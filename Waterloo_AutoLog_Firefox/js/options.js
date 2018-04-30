function initOptions() {

    function restoreOptions() {

        var configs = getOptionListDefault();

        browser.storage.local.get(configs, function (items) {

            var optionElem;

            for (var key in items) {

                optionElem = $('input[data-option-name="' + key + '"]');

                switch (key) {

                    case 'USER_ID':
                    case 'USER_Name':
                        optionElem.val(items[key]);
                        break;

                    case 'USER_Password':
                    case 'USER_CardPIN':
                        optionElem.val(decrypt(items[key], items.GLB_HashKey));
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

            $('#autolog-toast').removeClass('autolog-toast-hidden');

            window.clearTimeout(timeoutHandle);
            timeoutHandle = setTimeout(function () {
                $('#autolog-toast').addClass('autolog-toast-hidden');
            }, 1000);

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
        }

        else if (inputType == 'radio') {

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

    function onHashChange() {
        var hash = window.location.hash.substring(1);
        if (!hash.length) hash = 'global';
        $('li[data-option-tab-name = "' + hash + '"]').trigger('click');
    }

    function bindEvents() {
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

            $('#opt-tab-' + prevTabID).fadeOut(200, function () {
                $('#opt-tab-' + prevTabID).addClass('hidden');
                $('#opt-tab-' + thisTabID).fadeIn(200).removeClass('hidden');
            });


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

            if (password.val() == '') {
                alertInfo += '- Password is empty. Forms won\'t be submitted automatically.\r\n';
            }

            if (pin.val() == '') {
                alertInfo += '- WatCard PIN is empty. Forms won\'t be submitted automatically.\r\n';
            }

            if (hasError) {
                alert('Save failed!\r\n' + alertInfo);
                return;
            } else {
                if (alertInfo != '') {
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

        $('#user-id, #user-name,#user-password,#user-cardpin').bind('keydown', function (event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        $('#user-save').trigger('click');
                        break;
                }
            }
        });
    }

    $(window).load(function () {

        restoreOptions();

        // version #
        $('#autolog-version').text(browser.runtime.getManifest().version);

    });

    window.addEventListener("hashchange", onHashChange, false);

    var timeoutHandle = setTimeout(function () {

    }, 0);

}

initOptions();