# ================================
#          CodeViewInterface
# ================================

window.Oxygen or= {}
window.Oxygen.Editor.CodeViewInterface = class CodeViewInterface

    constructor: (editor) ->
        @editor = editor
        @view = null

    create: ->
        console.log "CodeViewInterface.create"

        # edit the textarea
        object = ace.edit(@editor.name + "-ace-editor")

        # set user preferences
        object.getSession().setMode "ace/mode/" + @editor.language
        object.setTheme Preferences.get('editor.ace.theme')
        object.getSession().setUseWrapMode Preferences.get('editor.ace.wordWrap')
        object.setHighlightActiveLine Preferences.get('user.editor.ace.highlightActiveLine')
        object.setShowPrintMargin Preferences.get('user.editor.ace.showPrintMargin')
        object.setShowInvisibles Preferences.get('user.editor.ace.showInvisibles')
        object.setReadOnly @editor.readOnly
        $("#" + @editor.name + "-ace-editor").css "font-size", Preferences.get('user.editor.ace.fontSize')

        # store object
        @view = object

    show: (full) ->
        console.log "CodeViewInterface.show"
        $("#" + @editor.name + "-ace-editor").removeClass(Editor.classes.state.isHidden)
        if full
            $("#" + @editor.name + "-ace-editor").css("width", "100%")
        @resize()

    hide: ->
        console.log "CodeViewInterface.hide"
        $("#" + @editor.name + "-ace-editor").addClass(Editor.classes.state.isHidden)

    valueFromForm: ->
        console.log "CodeViewInterface.valueFromForm"
        @view.setValue @editor.textarea.val(), -1

    valueToForm: ->
        console.log "CodeViewInterface.valueToForm"
        @editor.textarea.val @view.getValue()

    resize: ->
        @view.resize()