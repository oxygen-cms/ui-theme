# ================================
#          DesignViewInterface
#   ================================

window.Oxygen or= {}
window.Oxygen.Editor.DesignViewInterface = class DesignViewInterface

    constructor: (editor) ->
        @editor = editor
        @view = null

    create: ->
        config = user.editor.ckeditor
        config.customConfig = config.customConfig ? ''
        config.contentsCss = @editor.stylesheets

        console.log(config)

        # create instance
        object = CKEDITOR.replace(
            @editor.name + "-editor",
            config
        )

        # store object
        @view = object

    show: (full) ->
        $("#cke_" + @editor.name + "-editor").show()
        if full
            $("#" + @editor.name + "-ace-editor").css("width", "100%")
        return

    hide: ->
        $("#cke_" + @editor.name + "-editor").hide()
        return

    valueFromForm: ->
        @view.setData @editor.textarea.val()

    valueToForm: ->
        $("textarea[name=\"" + @editor.name + "\"]").val @view.getData()