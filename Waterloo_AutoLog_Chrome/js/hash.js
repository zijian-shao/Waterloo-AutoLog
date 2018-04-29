function encrypt(msg, key) {
    try {
        var enc = CryptoJS.AES.encrypt(btoa(msg), key);
        return enc;
    }
    catch (err) {
        return null;
    }
}

function decrypt(msg, key) {
    try {
        var dec = atob(CryptoJS.AES.decrypt(msg, key).toString(CryptoJS.enc.Utf8));
        return dec;
    } catch (err) {
        return null;
    }
}

