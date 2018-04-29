function encrypt(msg, key) {
    if (!msg) msg = "";
    msg = (msg == "undefined" || msg == "null") ? "" : msg;
    msg = btoa(msg);
    try {
        var pos = 0;
        var ostr = '';
        while (pos < msg.length) {
            ostr = ostr + String.fromCharCode(msg.charCodeAt(pos) ^ key);
            pos += 1;
        }
        return ostr;
    } catch (ex) {
        return '';
    }
}

function decrypt(msg, key) {
    if (!msg) msg = "";
    msg = (msg == "undefined" || msg == "null") ? "" : msg;
    try {
        var pos = 0;
        var ostr = '';
        while (pos < msg.length) {
            ostr = ostr + String.fromCharCode(key ^ msg.charCodeAt(pos));
            pos += 1;
        }
        ostr = atob(ostr);
        return ostr;
    } catch (ex) {
        return '';
    }
}

