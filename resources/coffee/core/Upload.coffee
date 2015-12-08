# ================================
#            Upload
# ================================

window.Oxygen or= {}
window.Oxygen.Upload = class Upload

    # -----------------
    #       Static
    # -----------------

    @selectors =
        uploadElement: ".FileUpload"
        previewElement: ".FileUpload-preview"
        dropzoneElement: ".FileUpload-dropzone"
        removeFile: ".FileUpload-preview-remove"

    @states =
        onDragOver: "FileUpload--onDragOver"

    @registerEvents: (container) ->
        elements = container.find(Upload.selectors.uploadElement)
        elements.find(Upload.selectors.dropzoneElement)
            .on("dragover", Upload.handleDragOver)
            .on("dragleave", Upload.handleDragLeave)
            .on("drop", Upload.handleDrop)
        elements.find("input[type=file]").on("change", Upload.handleChange)

    @handleDragOver = (event) ->
        event.preventDefault()
        $(event.currentTarget).addClass(Upload.states.onDragOver)

    @handleDragLeave = (event) ->
        $(event.currentTarget).removeClass(Upload.states.onDragOver)

    @handleDrop = (event) ->
        event.preventDefault()
        $(event.currentTarget).removeClass(Upload.states.onDragOver)

        #@files = event.originalEvent.dataTransfer.files
        upload = $(event.currentTarget).closest(Upload.selectors.uploadElement)
        #input = upload.find('input[type="file"]')[0]

        Upload.addFiles(upload, event.originalEvent.dataTransfer.files)
        ###/*form = $(event.currentTarget).parents("form")
        input = $(event.currentTarget).find("input")[0]

        formData = Form.getFormDataObject(form)
        for file in files
            formData.append(input.name, file)

        upload = new Upload(
            $(event.currentTarget).parent().find(Upload.selectors.progressBarElement),
            form,
            formData
        )

        upload.send()
        return###

    @handleChange = (event) ->
        Upload.addFiles($(event.currentTarget).closest(Upload.selectors.uploadElement), event.currentTarget.files)

    @addFiles = (upload, files) =>
        input = upload.find('input[type="file"]')[0]
        for file in files
            imageType = /^image\//;

            console.log file.type

            preview = $('
                <div class="FileUpload-preview">
                    <div class="FileUpload-preview-info"><span>' + file.name + '</span><button type="button" class="FileUpload-preview-remove Button--transparent Icon Icon-times"></button><span class="FileUpload-preview-size">' + fileSize(file.size) + '</span></div>
                </div>'
            )

            # handle remove
            preview.find(Upload.selectors.removeFile).on("click", (event) ->
                button = $(event.currentTarget)
                preview = button.closest(Upload.selectors.previewElement)

                # remove it from the list of files to upload
                index = input.filesToUpload.indexOf(file)
                if index > -1
                    input.filesToUpload.splice(index, 1)

                preview.remove()
            )

            upload.prepend(preview)
            input.filesToUpload = [] unless input.filesToUpload?
            input.filesToUpload.push(file)

            continue unless imageType.test(file.type)

            reader = new FileReader()
            reader.onload = (e) =>
                console.log e
                preview.css("background-image", 'url(' + e.target.result + ')')
                console.log preview.css("background-image")
            reader.readAsDataURL(file)

        console.log(files)


    # -----------------
    #       Object
    # -----------------

    ###constructor: (progressBar, form, data) ->
        @progressBar = new ProgressBar(progressBar)
        @form = form
        @data = data

    send: () ->
        $.ajax({
            dataType:       "json"
            type:           @form.attr("method")
            url:            @form.attr("action")
            data:           @data
            contentType:    false
            processData:    false
            success:        @handleSuccess.bind(this)
            error:          Ajax.handleError
            xhr:            @createCustomRequest.bind(this)
        })

    # Creates a custom XMLHttpRequest
    # object with a progress event.
    createCustomRequest: () ->
        object = if window.ActiveXObject then new ActiveXObject("XMLHttp") else new XMLHttpRequest()
        object.upload.addEventListener("progress", @handleProgress.bind(this))
        return object

    handleProgress: (event) ->
        if event.lengthComputable
            @progressBar.transitionTo(event.loaded, event.total)

    handleSuccess: (data) ->
        Ajax.handleSuccess(data)
        @progressBar.reset()###

fileSize = (sizeInBytes) ->
    output = sizeInBytes + " bytes"
    multiples = [
        'KB'
        'MB'
        'GB'
        'TB'
        'PB'
        'EB'
        'ZB'
        'YB'
    ]
    multiple = 0
    approx = sizeInBytes / 1024
    while approx > 1
        output = approx.toFixed(3) + ' ' + multiples[multiple]
        approx /= 1024
        multiple++
    output