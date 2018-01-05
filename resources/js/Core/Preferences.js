// ================================
//             Notification
// ================================

class Preferences {

    static setPreferences(preferences) {
        return Preferences.preferences = preferences;
    }

    static isDefined(o) {
        return typeof o !== "undefined" && o !== null;
    }

    static get(key, fallback = null) {
        var o = Preferences.preferences;

        if(!Preferences.isDefined(o)) {
            return fallback;
        }

        var parts = key.split('.');
        //var last = parts.pop();
        var l = parts.length;
        var i = 0;

        while(Preferences.isDefined(o) && i < l) {
            var idx = parts[i];
            o = o[idx];
            i++;
        }

        if (Preferences.isDefined(o)) {
            return o;
        } else {
            console.log("Preferences key ", key, "was not defined, using default ", fallback);
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


