# ================================
#             ImageEditor
# ================================

window.Oxygen or= {}
window.Oxygen.ImageEditor = class ImageEditor

    # -----------------
    #      Object
    # -----------------

    constructor: (container) ->
        @container = container
        @image = @container.find("." + ImageEditor.classes.layout.image)
        throw new Error("<img> element doesn't exist")  unless @image.length

        @forms = {
          simple: @image.parent().parent().find("." + ImageEditor.classes.form.simple)
          advanced: @image.parent().parent().find("." + ImageEditor.classes.form.advanced)
        }

        @fields = {
          crop: {
            x: @container.find('[name="crop[x]"]')
            y: @container.find('[name="crop[y]"]')
            width: @container.find('[name="crop[width]"]')
            height: @container.find('[name="crop[height]"]')
          },
          resize: {
            width: @container.find('[name="resize[width]"]')
            height: @container.find('[name="resize[height]"]')
            keepAspectRatio: @container.find('[name="resize[keepAspectRatio]"][value="true"]')
          },
          macro: @container.find('[name="macro"]')
          name: @container.find('[name="name"]')
          slug: @container.find('[name="slug"]')
        }

        that = @
        @image[0].onload = ->
            console.log 'Image Loaded'
            that.imageDimensions = { cropX: 0, cropY: 0 } unless that.imageDimensions?
            that.imageDimensions.width = this.clientWidth
            that.imageDimensions.height = this.clientHeight
            that.imageDimensions.naturalWidth = this.naturalWidth
            that.imageDimensions.naturalHeight = this.naturalHeight
            that.imageDimensions.ratio = this.naturalWidth / this.naturalHeight
            that.fields.resize.width.val(that.imageDimensions.naturalWidth)
            that.fields.resize.height.val(that.imageDimensions.naturalHeight)
            that.handleCropEnable()

        @fullscreenToggle = new FullscreenToggle(
            @container.find("." + ImageEditor.classes.button.toggleFullscreen),
            @container,
            ( -> ), ( -> )
        )

        @container.find("." + ImageEditor.classes.button.apply).on("click", @handlePreview)
        @container.find("." + ImageEditor.classes.button.save).on("click", @handleSave)
        @container.find("." + ImageEditor.classes.form.crop).on("change", @handleCropInputChange)
        @container.find("." + ImageEditor.classes.form.resize).on("change", @handleResizeInputChange)

        @jCropApi = null
        @cropDisableCounter = 2

    handlePreview: () =>
        @applyChanges @gatherData()

        @progressNotification = new Notification({
          content: "Processing Image"
          status: "success"
        })

    handleSave: () =>
        data = @gatherData()
        data.save = true
        data.name = @fields.name.val()
        data.slug = @fields.slug.val()
        @applyChanges data

        @progressNotification = new Notification({
          content: "Saving Image"
          status: "success"
        })

    gatherData: () ->
        mode = TabSwitcher.list[0].current
        switch mode
            when "simple" then @getSimpleData()
            when "advanced" then @getAdvancedData()
            else {}

    getSimpleData: () ->
        @removeDefaultFields(Form.getFormData(@forms.simple))

    removeDefaultFields: (formData) ->
        resize = (formData) =>
            return \
                (!formData["resize[width]"] || formData["resize[width]"] == @imageDimensions.naturalWidth.toString()) &&
                (!formData["resize[height]"] || formData["resize[height]"] == @imageDimensions.naturalHeight.toString())

        defaults = {
            "fit[position]": (item) =>
                return item == "center"
            "resize[width]": (item, formData) =>
                resize(formData)
            "resize[height]": (item, formData) =>
                resize(formData)
            "resize[keepAspectRatio]": (item, formData) =>
                resize(formData)
            "gamma": (item) =>
                return item == "1"
            "greyscale": (item) =>
                return item == "false"
            "invert": (item) =>
                return item == "false"
            "rotate[backgroundColor]": (item) =>
                return item == "#ffffff"
            "crop[x]": (item) =>
                @imageDimensions.cropX = if item == "" then 0 else parseInt(item)
            "crop[y]": (item) =>
                @imageDimensions.cropY = if item == "" then 0 else parseInt(item)
        }

        for key, item of formData
            if(defaults[key] and defaults[key](item, formData))
                delete formData[key]
            else if(item == "0" || item == "")
                delete formData[key]

        return formData

    getAdvancedData: () ->
        JSON.parse @fields.macro.val()

    # --------------------------------------------
    #                     REQUEST
    # --------------------------------------------

    applyChanges: (data) ->
        if @applyingChanges
            new Notification({
                content: "Already Processing"
                status: "failed"
            })
            return

        $.ajax({
            type:           "GET"
            url:            @image.attr("data-root")
            data:           data
            contentType:    false
            success:        @onRequestEnd
            error:          =>
                @progressNotification.hide()
                Ajax.handleError()
            xhr:            =>
                object = if window.ActiveXObject then new ActiveXObject("XMLHttp") else new XMLHttpRequest()
                object.overrideMimeType("text/plain; charset=x-user-defined");
                return object
        })
        @applyingChanges = true

    onRequestEnd: (response, status, request) =>
        @applyingChanges = false
        @progressNotification.hide()
        @jCropApi.destroy() if @jCropApi?
        @jCropApi = null
        @forms.simple.attr("data-changed", false)
        @forms.advanced.attr("data-changed", false)

        @image[0].src = "data:image/jpeg;base64," + base64Encode(response);

    # --------------------------------------------
    #                     CROP
    # --------------------------------------------

    handleCropEnable: () =>
        if(@jCropApi?)
            @jCropApi.enable();
        else
            that = @
            @image.Jcrop({
                onChange: @handleCropSelect
                onSelect: @handleCropSelect
                onRelease: @handleCropRelease
            }, () ->
                that.jCropApi = @
            );

    handleCropDisable: () =>
        @jCropApi.disable()

    handleCropSelect: (c) =>
        if(@cropDisableCounter > 1)
            @fields.crop.x.val(Math.round(c.x / @imageDimensions.width * @imageDimensions.naturalWidth + @imageDimensions.cropX))
            @fields.crop.y.val(Math.round(c.y / @imageDimensions.height * @imageDimensions.naturalHeight + @imageDimensions.cropY))
            @fields.crop.width.val(Math.round(c.w / @imageDimensions.width * @imageDimensions.naturalWidth))
            @fields.crop.height.val(Math.round(c.h / @imageDimensions.height * @imageDimensions.naturalHeight))
        else
            @cropDisableCounter++

    handleCropInputChange: () =>
        if(!@jCropApi?) then return
        x = @fields.crop.x.val() / @imageDimensions.naturalWidth * @imageDimensions.width - @imageDimensions.cropX
        y = @fields.crop.y.val() / @imageDimensions.naturalHeight * @imageDimensions.height - @imageDimensions.cropY
        @cropDisableCounter = 0
        @jCropApi.setSelect([
            x,
            y,
            x + @fields.crop.width.val() / @imageDimensions.naturalWidth * @imageDimensions.width,
            y + @fields.crop.height.val() / @imageDimensions.naturalHeight * @imageDimensions.height
        ])

    handleCropRelease: () =>
        @fields.crop.x.val(0)
        @fields.crop.y.val(0)
        @fields.crop.width.val(0)
        @fields.crop.height.val(0)

    handleResizeInputChange: (e) =>
        if(@fields.resize.keepAspectRatio[0].checked)
            name = e.target.name
            value = $(e.target).val()
            console.log(name, value)
            if(name == 'resize[width]')
                @fields.resize.height.val(Math.round(value / @imageDimensions.ratio))
            else
                @fields.resize.width.val(Math.round(value * @imageDimensions.ratio))

    # -----------------
    #        Static
    # -----------------

    @list: []

    @initialize: (container) ->
        container.find("." + ImageEditor.classes.layout.container).each( ->
            ImageEditor.list.push new ImageEditor($(this))
        )

    @classes: {
        layout:
          container: "ImageEditor"
          image: "ImageEditor-image"
        button:
          toggleFullscreen: "ImageEditor-toggleFullscreen"
          save: "ImageEditor-save"
          apply: "ImageEditor-apply"
        form:
          simple: "ImageEditor-form--simple"
          advanced: "ImageEditor-form--advanced"
          crop: "ImageEditor-crop-input"
          resize: "ImageEditor-resize-input"
    }


base64Encode = (inputStr) ->
    b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    outputStr = ""
    i = 0
    while i < inputStr.length

        #all three "& 0xff" added below are there to fix a known bug
        #with bytes returned by xhr.responseText
        byte1 = inputStr.charCodeAt(i++) & 0xff
        byte2 = inputStr.charCodeAt(i++) & 0xff
        byte3 = inputStr.charCodeAt(i++) & 0xff
        enc1 = byte1 >> 2
        enc2 = ((byte1 & 3) << 4) | (byte2 >> 4)
        enc3 = undefined
        enc4 = undefined
        if isNaN(byte2)
            enc3 = enc4 = 64
        else
            enc3 = ((byte2 & 15) << 2) | (byte3 >> 6)
            if isNaN(byte3)
                enc4 = 64
            else
                enc4 = byte3 & 63
        outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4)
    outputStr