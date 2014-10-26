# ================================
#             ImageEditor
# ================================

Caman.DEBUG = true
#Caman.allowRevert = false

window.Oxygen or= {}
window.Oxygen.ImageEditor = class ImageEditor

    # -----------------
    #      Object
    # -----------------

    constructor: (container) ->
        @container = container
        @image = @container.find("." + ImageEditor.classes.layout.image)

        throw new Error("<img> element doesn't exist")  unless @image.length

        @form = @image.closest("form")

        @progressBar = new ProgressBar(
            @container.find("." + ImageEditor.classes.form.progressBar)
        )
        @fullscreenToggle = new FullscreenToggle(
            @container.find("." + ImageEditor.classes.button.toggleFullscreen),
            @container,
            ( -> ), ( -> )
        )
        @simpleControls = @container.find("." + ImageEditor.classes.form.control)

        @container.find("." + ImageEditor.classes.button.submitMacro).on("click", @handleMacroSubmit)
        @container.find("." + ImageEditor.classes.button.reset).on("click", @handleReset)
        @container.find("." + ImageEditor.classes.button.save).on("click", @handleSave)
        @simpleControls.on("change", @handleControlChange)

        @setMacro(@constructMacroFromString(""))
        @process()

        Caman.Event.listen(@caman, "blockFinished", @handleBlockFinished)
        #Caman.Event.listen(@caman, "revertBlockFinished", @handleRevertBlockFinished)
        Caman.Event.listen(@caman, "renderFinished", @handleRenderFinished)

        ###jcrop_api = null
        @image.Jcrop({
            onChange: @.onChange
            onSelect: @.onSelect
            onRelease: @.onRelease
        }, () ->
                jcrop_api = this;
        );###

        ImageEditor.list.push(this)
        return

    setMacro: (object) ->
        @macro = object
        return

    process: (revert = false) ->
        console.log "ImageEditor.process()"
        @progressBar.setup()
        @blocksFinished = 0
        if revert
            @caman.revert(false)
        @caman = Caman(@image[0], @macro.function)
        return

    handleBlockFinished: (job) =>
        @blocksFinished++
        console.log @blocksFinished + " in " + job.totalBlocks * @macro.stages
        @progressBar.transitionTo(@blocksFinished, job.totalBlocks * @macro.stages)
        return

    ###handleRevertBlockFinished: (job) =>
        console.log "RevertBlockFinished"
        return###

    handleRenderFinished: =>
        console.log "ImageEditor.handleRenderFinished()"
        # Reset the progress bar ready for next time.
        @progressBar.transitionTo 1, 1
        @progressBar.resetAfter 500

        # Find the image again because it has
        # been transformed into a <canvas> element.
        # without this the 2nd render will fail.
        @image = @container.find("." + ImageEditor.classes.layout.image)
        throw new Error("<canvas> element doesn't exist")  unless @image.length
        return

    handleMacroSubmit: (event) =>
        value = @container.find("." + ImageEditor.classes.form.macro).val()
        @setMacro @constructMacroFromString(value)
        @process()
        return

    handleReset: (event) =>
        if @caman
            @caman.reset(false)
            new Notification(
                content: "Reset Successful"
                status: "success"
            )
        else
            new Notification(
                content: "Nothing to Reset"
                status: "failed"
            )

        @simpleControls.each (index, value) ->
            $(value).val(0)
            return
        return

    handleSave: (event) =>
        type = @form.find("[name=type]").val()
        console.log(type)
        @caman.canvas.toBlob(@saveActual, type)
        return

    saveActual: (blob) =>
        formData = Form.getFormDataObject(@form)
        formData.append("image", blob)

        upload = new Upload(
            @container.find("." + ImageEditor.classes.form.progressBar),
            @form
            formData
        )
        upload.send()
        return

    handleControlChange: (event) =>
        values = []
        @simpleControls.each (index, value) ->
            element = $(value)
            values[element.attr("data-controls")] = element.val()
            return
        @setMacro @constructMacroFromValues(values)
        console.log @macro
        @process(true)
        return

    constructMacroFromValues: (values) ->
        string = ""
        for name in ImageEditor.controls
            string += "." + name + "(#{values[name]})"  if values[name] != "0"
        return @constructMacroFromString(string)

    constructMacroFromString: (string) ->
        string = string.trim() # remove whitespace on either side
        string = "." + string  if string.length > 1 and string.charAt(0) isnt "." # the first '.' is optional
        return @constructMacroFromRaw("this" + string + ".render();")

    constructMacroFromRaw: (functionBody) ->
        full = "try {" + functionBody + "} catch(e) { new Oxygen.Notification({ content: \"Invalid Macro\", status: \"failed\", log: e }); }";
        stages = functionBody.match(/\./g).length - 1

        try
            return {
                stages: stages
                function: new Function(full)
            }
        catch e
            new Notification(
              content: "Invalid Macro Syntax"
              status: "failed"
              log:
                exception: e
                macro: full
            )
        return

    # -----------------
    #        Static
    # -----------------

    @list = []

    @initialize: () ->
        $("." + ImageEditor.classes.layout.container).each( ->
            new ImageEditor($(this))
            return
        )
        return

    @classes =
        layout:
            container: "ImageEditor"
            image: "ImageEditor-image"
        button:
            submitMacro: "ImageEditor-submitMacro"
            reset: "ImageEditor-reset"
            save: "ImageEditor-save"
            toggleFullscreen: "ImageEditor-toggleFullscreen"
        form:
            control: "ImageEditor-control"
            progressBar: "ImageEditor-progress"
            macro: "ImageEditor-macro"

    @controls: [
        "brightness",
        "contrast",
        "saturation",
        "vibrance",
        "exposure",
        "hue",
        "sepia",
        "gamma",
        "noise",
        "clip",
        "sharpen",
        "stackBlur"
    ]
