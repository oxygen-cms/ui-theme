# ================================
#             Notification
# ================================

window.Oxygen or= {}
window.Oxygen.Preferences = class Preferences

    @setPreferences: (preferences) ->
        Preferences.preferences = preferences

    @get: (key, fallback = null) ->
        o = Preferences.preferences

        if(!o?)
            return fallback

        parts = key.split('.')
        last = parts.pop()
        l = parts.length
        i = 1
        current = parts[0]

        while((o = o[current]) && i < l)
            current = parts[i]
            i++

        if o
            return o[last]
        else
            return fallback

    @has: (key) ->
        o = Preferences.preferences

        if(!o)
            return false

        parts = key.split('.')
        last = parts.pop()
        l = parts.length
        i = 1
        current = parts[0]

        while((o = o[current]) && i < l)
            current = parts[i]
            i++

        if o
            return true
        else
            return false


