function getOptionListDefault() {

    var obj = {
        'EXT_Version': '0.0.0',
        'GLB_Enabled': true,
        'GLB_HashKey': '',
        'USER_ID': '',
        'USER_Name': '',
        'USER_Password': '',
        'USER_CardPIN': '',
        'SITE_CAS': true,
        'SITE_IDP': true,
        'SITE_IDM': true,
        'SITE_WATCARD': true,
        'SITE_ECEWO': true,
        'SITE_MYHRINFO': true
    };

    return obj;

}

function getLink(key) {
    var list = {
        darklightStore: 'https://addons.mozilla.org/firefox/addon/learn-darklight/',
        azureStore: 'https://addons.mozilla.org/firefox/addon/waterlooworks-azure/',
        autologStore: 'https://addons.mozilla.org/firefox/addon/waterloo-autolog/',
        raspberryStore: 'https://addons.mozilla.org/firefox/addon/quest-raspberry/',
        feedback: 'https://docs.google.com/forms/d/e/1FAIpQLSf3Wl_Jz8vKXw1xKaFEyeSqQr_wvTaAqazaBgcRoxnhhJG4Xw/viewform?usp=pp_url&entry.332394019=@@extVersion@@&entry.1864752170=@@browser@@&entry.413002758=@@os@@',
        officialWebsite: 'https://www.zijianshao.com/autolog/',
        github: 'https://github.com/SssWind/Waterloo-AutoLog',
        donate: 'https://www.paypal.me/zjshao',
        mailTo: 'mailto:sam.zj.shao@gmail.com?Subject=Waterloo Autolog Extension'
    };
    return list[key];
}