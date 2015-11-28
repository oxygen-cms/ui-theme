# ================================
#          CodeViewInterface
# ================================

window.Oxygen or= {}
window.Oxygen.Editor.CodeViewInterface = class CodeViewInterface

    constructor: (editor) ->
        @editor = editor
        @view = null

    create: ->
        # edit the textarea
        object = ace.edit(@editor.name + "-ace-editor")

        # set user preferences
        object.getSession().setMode "ace/mode/" + @editor.language
        object.setTheme Preferences.get('editor.ace.theme')
        object.getSession().setUseWrapMode Preferences.get('editor.ace.wordWrap')
        object.setHighlightActiveLine Preferences.get('user.editor.ace.highlightActiveLine')
        object.setShowPrintMargin Preferences.get('editor.ace.showPrintMargin')
        object.setShowInvisibles Preferences.get('editor.ace.showInvisibles')
        object.setReadOnly @editor.readOnly
        $("#" + @editor.name + "-ace-editor").css "font-size", Preferences.get('editor.ace.fontSize')

        # store object
        @view = object

    show: (full) ->
        $("#" + @editor.name + "-ace-editor").removeClass(Editor.classes.state.isHidden)
        if full
            $("#" + @editor.name + "-ace-editor").css("width", "100%")

        setTimeout( =>
            @resize()
        , 300) # after animation is completed

    hide: ->
        console.log "CodeViewInterface.hide"
        $("#" + @editor.name + "-ace-editor").addClass(Editor.classes.state.isHidden)

    valueFromForm: ->
        @view.setValue @editor.textarea.val(), -1

    valueToForm: ->
        @editor.textarea.val @view.getValue()

    resize: ->
        @view.resize()