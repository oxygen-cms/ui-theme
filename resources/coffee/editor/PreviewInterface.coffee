# ================================
#          PreviewInterface
#   ================================

window.Oxygen or= {}
window.Oxygen.Editor.PreviewInterface = class PreviewInterface

    constructor: (editor) ->
        @editor = editor
        @view = null

    create: ->
        preview = $("<iframe id=\"" + @editor.name + "-preview\" class=\"" + Editor.classes.editor.preview + "\"></iframe>")
        preview.appendTo @editor.container.find(".Editor-content")
        @view = preview

    show: (full) ->
        $("#" + @editor.name + "-preview").removeClass(Editor.classes.state.isHidden)

        if full
            $("#" + @editor.name + "-preview").css("width", "100%")

        # create the stylesheets
        head = ""
        for stylesheet in @editor.stylesheets
            head += "<link rel=\"stylesheet\" href=\"" + stylesheet + "\">"
        @view.contents().find("head").html head
        @view.contents().find("html").addClass "no-js " + $("html").attr("class").replace("js ", "")

    hide: ->
        $("#" + @editor.name + "-preview").addClass(Editor.classes.state.isHidden)

    valueFromForm: ->
        @view.contents().find("body").html @editor.textarea.val()

    # we can't and don't want to do this
    valueToForm: ->
