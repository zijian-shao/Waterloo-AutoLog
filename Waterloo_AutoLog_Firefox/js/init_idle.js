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

    if (options.USER_Password.length > 0)
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

    if (options.USER_Password.length > 0)
        $('input[id="loginForm:loginButton"]').trigger('click');
}

function loginECEWO() {

    if (!currURL.match(/\/cgi-bin\/WebObjects\//gi))
        return;

    var form;

    // ECE Survey f_0_1_0 Survey
    if (currURL.match(/Survey/gi)) {
        var fontTxt = $("font:contains('Please enter your login and password')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // Course Book f_1_3_9_1 CourseBook
    else if (currURL.match(/CourseBook/gi)) {
        var fontTxt = $("font:contains('Please enter your login and password')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // Student Blocks f_3 SBO
    else if (currURL.match(/SBO/gi)) {
        form = $('form[action="https://ecewo.uwaterloo.ca/cgi-bin/WebObjects/SBO.woa/wa/login"]');
    }
    // FOEAUA Online f_9 FOEAUA
    else if (currURL.match(/FOEAUA/gi)) {
        var fontTxt = $("h1:contains('Please enter your User ID and Password')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // ECE Work Requests x WorkRequest
    else if (currURL.match(/WorkRequest/gi)) {
        var fontTxt = $("h1:contains('Please enter your User ID and Password')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // TA application Online f_0_1_7_0 TAO
    else if (currURL.match(/TAO/gi)) {
        var fontTxt = $("label:contains('Password:')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // Graduate Program Extensions f_11 ProgExt
    else if (currURL.match(/ProgExt/gi)) {
        var fontTxt = $("h1:contains('Please enter your User ID and Password')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // Preliminary Course Selection Survey f_9 PCSS
    else if (currURL.match(/PCSS/gi)) {
        var fontTxt = $("h1:contains('Please enter your User ID and Password')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // Term Activity Reports f_11 WebStar
    else if (currURL.match(/WebStar/gi)) {
        var fontTxt = $("h1:contains('Please enter your User ID and Password')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // ECE WebForms
    else if (currURL.match(/WebForms/gi)) {
        var fontTxt = $("h1:contains('Please enter your User ID and Password')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // ECE MyVote f_1_3_1 MyVote
    else if (currURL.match(/MyVote/gi)) {
        return;
        // form = $('form[name="f_1_3_1"]');
    }
    // ECE Work Reports f_5 ECEWorkReports
    else if (currURL.match(/ECEWorkReports/gi)) {
        var fontTxt = $("b:contains('Password:')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // NanoEng Work Reports f_5 NEWorkReports
    else if (currURL.match(/NEWorkReports/gi)) {
        var fontTxt = $("b:contains('Password:')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
    }
    // MTE Work Reports f_5 MTEWorkReports
    else if (currURL.match(/MTEWorkReports/gi)) {
        var fontTxt = $("b:contains('Password:')");
        if (fontTxt.length > 0) {
            form = fontTxt.closest('form');
        }
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

    if (options.USER_Password.length > 0)
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

    if (options.USER_CardPIN.length > 0)
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

    if (options.USER_Password.length > 0)
        form.find('input[type="submit"]').trigger('click');
}

function loginConnect() {
    var lgnDiv = $('#lgnDiv');

    if (!lgnDiv.length) return;

    lgnDiv.find('#username').val(options.USER_Name);
    lgnDiv.find('#password').val(options.USER_Password);

    if (lgnDiv.find('#signInErrorDiv').text().trim().length > 0)
        return;

    if (currURL.match(/reason=[0-9]{1}/gi) && !currURL.match(/reason=0/gi))
        return;

    lgnDiv.find('.signInEnter .signinbutton').trigger('click');
}

function loginADFS() {
    var authArea = $('#authArea');
    if (!authArea.length) return;

    // if (currURL.match(/SAMLRequest/gi))
    //     authArea.find('#userNameInput').val(options.USER_Name + '@uwaterloo.ca');
    // else
    //     authArea.find('#userNameInput').val(options.USER_Name + '@edu.uwaterloo.ca');

    if (options.USER_Extension === 0)
        authArea.find('#userNameInput').val(options.USER_Name + '@edu.uwaterloo.ca');
    else
        authArea.find('#userNameInput').val(options.USER_Name + '@uwaterloo.ca');

    authArea.find('#passwordInput').val(options.USER_Password);

    if (authArea.find('#errorText').text().trim().length > 0)
        return;

    authArea.find('#submitButton').trigger('click');
}

function initAutoLogIdle() {

    if (!options.GLB_Enabled)
        return;

    if (options.USER_Name.length === 0 || options.USER_Password.length === 0)
        return;

    if (currURL.match(/cas\.uwaterloo\.ca\/cas\/login/gi) && options.SITE_CAS) {
        loginCAS();
    } else if (
        (currURL.match(/idp\.uwaterloo\.ca\/idp\/profile\/SAML2\/Unsolicited\/SSO/gi)
            || currURL.match(/idp\.uwaterloo\.ca\/idp\/profile\/SAML2\/Redirect\/SSO/gi))
        && options.SITE_IDP) {
        loginQuest();
    } else if (currURL.match(/idm\.uwaterloo\.ca\/watiam\/login\.js/gi) && options.SITE_IDM) {
        loginWatIAM();
    } else if (currURL.match(/ecewo\.uwaterloo\.ca/gi) && options.SITE_ECEWO) {
        loginECEWO();
    } else if (currURL.match(/watcard\.uwaterloo\.ca\/OneWeb\/Account\/LogOn/gi) && options.SITE_WATCARD) {
        loginWatCard();
    } else if (currURL.match(/myhrinfo\.hrms\.uwaterloo\.ca\/psp\/SS\//gi) && options.SITE_MYHRINFO) {
        loginMyHRinfo();
    } else if (currURL.match(/connect\.uwaterloo\.ca\/owa\/auth\/logon\.aspx/gi) && options.SITE_CONNECT) {
        loginConnect();
    } else if (currURL.match(/adfs\.uwaterloo\.ca\/adfs\//gi) && options.SITE_ADFS) {
        loginADFS();
    }

}

initAutoLogIdle();