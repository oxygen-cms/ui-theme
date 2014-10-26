# ================================
#             Toggle
# ================================

window.Oxygen or= {}
window.Oxygen.Toggle = class Toggle
    
    @classes =
       ifEnabled:  "Toggle--ifEnabled"
       ifDisabled: "Toggle--ifDisabled"

    constructor: (toggle, enableCallback, disableCallback) ->
        @toggle = toggle
        @enableCallback = enableCallback
        @disableCallback = disableCallback

        @registerEvents();

    registerEvents: () ->
        @toggle.on("click", @handleToggle.bind(this))
        @toggle.attr("data-enabled", "false")

    handleToggle: () ->
        if @toggle.attr("data-enabled") == "true"
            @toggle.attr("data-enabled", "false")
            @disableCallback()
        else
            @toggle.attr("data-enabled", "true")
            @enableCallback()
