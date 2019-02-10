function loginCAS() {
    var form = $('form[id="fm1"]');
    if (!form.length)
        return;

    $('#username').val(options.USER_Name);
    $('#password').val(options.USER_Password);

    if ($('#status').length)
        return;

    $('input[name="submit"]').trigger('click');
}

function loginQuest() {
    var form = $('form[method="post"]');
    if (!form.length ||
        (!form.attr('action').match(/\/idp\/profile\/SAML2\/Unsolicited\/SSO/gi)
            && !form.attr('action').match(/\/idp\/profile\/SAML2\/Redirect\/SSO/gi)
        )
    )
        return;

    $('#username').val(options.USER_Name);
    $('#password').val(options.USER_Password);

    if ($('p.form-error').length)
        return;

    if (options.USER_Password != '')
        form.find('input[type="submit"]').first().trigger('click');
}

function loginWatIAM() {
    var form = $('#loginForm');
    if (!form.length)
        return;

    $('input[id="loginForm:accountId"]').val(options.USER_Name);
    $('input[id="loginForm:password"]').val(options.USER_Password);

    if ($('span[id="loginForm:loginErrors"]').length)
        return;

    if (options.USER_Password != '')
        $('input[id="loginForm:loginButton"]').trigger('click');
}

function loginECEWO() {

    if (!currURL.match(/\/cgi-bin\/WebObjects\//gi))
        return;

    var form;

    // ECE Survey f_0_1_0 Survey
    if (currURL.match(/Survey/gi)) {
        form = $('form[name="f_0_1_0"]');
    }
    // Course Book f_1_3_9_1 CourseBook
    else if (currURL.match(/CourseBook/gi)) {
        form = $('form[name="f_1_3_9_1"]');
    }
    // Student Blocks f_3 SBO
    else if (currURL.match(/SBO/gi)) {
        form = $('form[name="f_3"]');
    }
    // FOEAUA Online f_9 FOEAUA
    else if (currURL.match(/FOEAUA/gi)) {
        form = $('form[name="f_9"]');
    }
    // ECE Work Requests x WorkRequest
    else if (currURL.match(/WorkRequest/gi)) {
        return;
    }
    // TA application Online f_0_1_7_0 TAO
    else if (currURL.match(/TAO/gi)) {
        form = $('form[name="f_0_1_7_0"]');
    }
    // Graduate Program Extensions f_11 ProgExt
    else if (currURL.match(/ProgExt/gi)) {
        form = $('form[name="f_11"]');
    }
    // Preliminary Course Selection Survey f_9 PCSS
    else if (currURL.match(/PCSS/gi)) {
        form = $('form[name="f_9"]');
    }
    // Term Activity Reports f_11 WebStar
    else if (currURL.match(/WebStar/gi)) {
        form = $('form[name="f_11"]');
    }
    // ECE Vacations f Vacation
    else if (currURL.match(/Vacation/gi)) {
        form = $('form[name="f"]');
    }
    // ECE MyVote f_1_3_1 MyVote
    else if (currURL.match(/MyVote/gi)) {
        form = $('form[name="f_1_3_1"]');
    }
    // ECE Work Reports f_5 ECEWorkReports
    else if (currURL.match(/ECEWorkReports/gi)) {
        form = $('form[name="f_5"]');
    }
    // NanoEng Work Reports f_5 NEWorkReports
    else if (currURL.match(/NEWorkReports/gi)) {
        form = $('form[name="f_5"]');
    }
    // MTE Work Reports f_5 MTEWorkReports
    else if (currURL.match(/MTEWorkReports/gi)) {
        form = $('form[name="f_5"]');
    }
    // FYDP Inventory x FYDP-Inventory
    else if (currURL.match(/FYDP-Inventory/gi)) {
        return;
    }

    if (!form.length)
        return;

    var uname = form.find('input[type="text"]');
    var pwd = form.find('input[type="password"]');
    var submit = form.find('input[type="submit"]');
    if (!uname.length || !pwd.length || !submit.length)
        return;

    uname.val(options.USER_Name);
    pwd.val(options.USER_Password);

    var err = $('font, div');
    if (err.text().match(/Authentication Failed/gi)
        || err.text().match(/Access denied/gi)
        || err.text().match(/invalid login/gi)
        || err.text().match(/does not exist/gi)
        || $('font.error, div.error').length
    )
        return;

    if (options.USER_Password != '')
        submit.trigger('click');

}

function loginWatCard() {
    var form = $('form[method="post"]');
    if (!form.length || !form.attr('action').match(/\/OneWeb\/Account\/LogOn/gi))
        return;

    $('#Account').val(options.USER_ID);
    $('#Password').val(options.USER_CardPIN);

    if ($('div.validation-summary-errors').length)
        return;

    if (options.USER_CardPIN != '')
        form.find('button[type="submit"]').first().trigger('click');
}

function loginMyHRinfo() {
    var form = $('form[id="login"]');
    if (!form.length)
        return;

    $('#userid').val(options.USER_Name);
    $('#pwd').val(options.USER_Password);

    if ($('td.PSERRORTEXT').text().match(/Your User ID and\/or Password are invalid/gi))
        return;

    if (currURL.match(/cmd=logout/gi))
        return;

    if (options.USER_Password != '')
        form.find('input[type="submit"]').trigger('click');
}

function initAutoLogIdle() {

    if (!options.GLB_Enabled)
        return;

    if (options.USER_Name == '' || options.USER_Password == '')
        return;

    if (currURL.match(/cas\.uwaterloo\.ca\/cas\/login/gi) && options.SITE_CAS) {
        loginCAS();
    }
    else if (
        (currURL.match(/idp\.uwaterloo\.ca\/idp\/profile\/SAML2\/Unsolicited\/SSO/gi)
            || currURL.match(/idp\.uwaterloo\.ca\/idp\/profile\/SAML2\/Redirect\/SSO/gi))
        && options.SITE_IDP) {
        loginQuest();
    }
    else if (currURL.match(/idm\.uwaterloo\.ca\/watiam\/login\.js/gi) && options.SITE_IDM) {
        loginWatIAM();
    }
    else if (currURL.match(/ecewo\.uwaterloo\.ca/gi) && options.SITE_ECEWO) {
        loginECEWO();
    }
    else if (currURL.match(/watcard\.uwaterloo\.ca\/OneWeb\/Account\/LogOn/gi) && options.SITE_WATCARD) {
        loginWatCard();
    }
    else if (currURL.match(/myhrinfo\.hrms\.uwaterloo\.ca\/psp\/SS\//gi) && options.SITE_MYHRINFO) {
        loginMyHRinfo();
    }

}

initAutoLogIdle();