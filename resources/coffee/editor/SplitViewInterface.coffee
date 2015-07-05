# ==========================
#     SplitViewInterface
# ==========================

window.Oxygen or= {}
window.Oxygen.Editor.SplitViewInterface = class SplitViewInterface

    constructor: (editor) ->
        @editor = editor
        @view = null

    create : ->

    show : ->
        @editor.container.find("." + Editor.classes.editor.content).addClass Editor.classes.state.contentIsSplit
        @editor.show "code", false
        @editor.show "preview", false
        $("#" + @editor.name + "-ace-editor, #" + @editor.name + "-preview").css "width", "50%"
        @editor.modes.code.view.on "change", @synchronize.bind(this)

    hide : ->
        @editor.container.find("." + Editor.classes.editor.content).removeClass Editor.classes.state.contentIsSplit
        @editor.hide "code"
        @editor.hide "preview"

    valueFromForm : ->

    valueToForm : ->

    onChange : ->
        @hasChanged = true

    synchronize : ->
        if @editor.currentMode is "split"
            console.log "SplitViewInterface.synchronize"
            @editor.valueToForm "code"
            @editor.valueFromForm "preview"
            @hasChanged = false
