# ================================
#            AjaxRequest
# ================================

window.Oxygen or= {}
window.Oxygen.Dialog = class Dialog

    @registerEvents: ->
        $("[data-dialog-type=\"confirm\"]").on("click", @handleConfirmClick)
        return

    @handleConfirmClick: (event, customConfig) ->
        target = $(event.currentTarget)

        unless target.attr("data-dialog-disabled") == "true"
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation();

            defaultConfig =
                message: target.attr("data-dialog-message")
                callback: (value) ->
                    if value
                        target.attr("data-dialog-disabled", "true")
                        target[0].click()

            for attribute of customConfig
                defaultConfig[attribute] = customConfig[attribute]

            vex.dialog.confirm(defaultConfig)


