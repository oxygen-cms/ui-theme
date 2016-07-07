// ================================
//             Notification
// ================================

class Preferences {

    static setPreferences(preferences) {
        return Preferences.preferences = preferences;
    }

    static get(key, fallback = null) {
        var o = Preferences.preferences;

        if(!(typeof o !== "undefined" && o !== null)) {
            return fallback;
        }

        var parts = key.split('.');
        var last = parts.pop();
        var l = parts.length;
        var i = 1;
        var current = parts[0];

        while((o = o[current]) && i < l) {
            current = parts[i];
            i++;
        }

        if (o) {
            return o[last];
        } else {
            return fallback;
        }
    }

    static has(key) {
        var o = Preferences.preferences;

        if(!o) {
            return false;
        }

        var parts = key.split('.');
        var last = parts.pop();
        var l = parts.length;
        var i = 1;
        var current = parts[0];

        while((o = o[current]) && i < l) {
            current = parts[i];
            i++;
        }

        return o;
    }
}


