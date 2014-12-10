# ================================
#             Notification
# ================================

window.Oxygen or= {}
window.Oxygen.Preferences = class Preferences

    @setPreferences: (preferences) ->
        Preferences.preferences = preferences

    @get: (key, fallback = null) ->
        o = Preferences.preferences

        if(!o)
            return fallback

        key = key.replace(/\[(\w+)\]/g, '.$1'); # convert indexes to properties
        key = key.replace(/^\./, '');           # strip a leading dot
        parts = key.split('.');
        while parts.length
            n = a.shift()
            if n in o
                o = n
            else
                return fallback
        return o

    @has: (key) ->
        o = Preferences.preferences

        if(!o)
            return false

        key = key.replace(/\[(\w+)\]/g, '.$1'); # convert indexes to properties
        key = key.replace(/^\./, '');           # strip a leading dot
        parts = key.split('.');
        while parts.length
            n = a.shift()
            if n in o
                o = n
            else
                return false
        return true


