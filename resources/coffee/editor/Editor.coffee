# ================================
#                 Editor
# ================================

window.Oxygen or= {}
window.Oxygen.Editor = class Editor

    # -----------------
    #      Static
    # -----------------

    @list = []

    # only create if textarea exists
    @createEditors: (editors) ->
        for editor in editors
            textarea = $("textarea[name=\"" + editor.name + "\"]")
            if textarea.length
                console.log "Editor found"
                editor.mode = user.editor.defaultMode if !editor.mode?
                console.log editor
                new Editor(editor.name, editor.language, editor.mode, editor.readOnly, editor.stylesheets)
            else
                console.log "Editor not found"
                console.log editor
        return

    @classes =
        editor:
            container: "Editor"
            header: "Editor-header"
            content: "Editor-content"
            footer: "Editor-footer"
            preview: "Editor-preview"

        state:
            isHidden: "Editor--hidden"
            contentIsSplit: "Editor-content--isSplit"

        button:
            switchEditor: "Editor--switchEditor"
            fullscreenToggle: "Editor--toggleFullscreen"

    # -----------------
    #      Object
    # -----------------

    constructor: (name, language, currentMode, readOnly, stylesheets = []) ->
        @name = name
        @language = language
        @currentMode = currentMode
        @readOnly = readOnly
        @stylesheets = stylesheets
        @modes = {}
        @textarea = $("textarea[name=\"" + @name + "\"]")
        @container = @textarea.parents("." + Editor.classes.editor.container)
        @fullscreenToggle = new FullscreenToggle(@container.find("." + Editor.classes.button.fullscreenToggle), @container, @enterFullscreen, @exitFullscreen)

        @show()
        @resizeToContent()
        @registerEvents()
        Editor.list.push(@)

    getMode: (mode) ->
        if not mode?
            return @currentMode
        else
            return mode

    registerEvents: ->
        # switch editor button
        @container.find("." + Editor.classes.button.switchEditor).on("click", @handleSwitchEditor)

        # form submit
        $(@container).parents("form").on("submit", @handleFormSubmit)
        return

    create: (m) ->
        mode = @getMode(m)
        switch mode
            when "code"
                @modes.code = new CodeViewInterface(@)
            when "design"
                @modes.design = new DesignViewInterface(@)
            when "preview"
                @modes.preview = new PreviewInterface(@)
            when "split"
                @modes.split = new SplitViewInterface(@)
        @modes[mode].create()
        return

    show: (m, full = true) ->
        mode = @getMode(m)
        @create mode  if not @modes[mode]?
        @modes[mode].show(full)
        @currentMode = mode
        @valueFromForm(mode)
        return

    hide: (m) ->
        mode = @getMode(m)
        @modes[mode].hide()
        @valueToForm(mode)
        return

    valueFromForm: (m) ->
        mode = @getMode(m)
        @modes[mode].valueFromForm()
        return

    valueToForm: (m) ->
        mode = @getMode(m)
        @modes[mode].valueToForm()
        return

    resizeToContainer: ->
        # resize ace
        @modes.code.resize()  if @modes.code
        return

    resizeToContent: ->
        # size to content
        @container.find("." + Editor.classes.editor.content).css "height", @textarea.attr("rows") * 1.5 + "em"

        # resize ace
        @modes.code.resize()  if @modes.code
        return

    # enter fullscreen
    enterFullscreen: =>
        @resizeToContainer()
        return

    # exit fullscreen
    exitFullscreen: =>
        @resizeToContent()
        return

    handleSwitchEditor: (event) =>
        console.log("Editor.handleSwitchEditor")
        editorToSwitch = $(event.target).attr("data-editor")
        @hide()
        @show(editorToSwitch)

    handleFormSubmit: =>
        @valueToForm()
