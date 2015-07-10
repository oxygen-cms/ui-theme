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
        progressBarElement: ".ProgressBar"
        progressBarFill: ".ProgressBar-fill"

    @states =
        onDragOver: "FileUpload--onDragOver"

    @registerEvents: (container) ->
        container.find(Upload.selectors.uploadElement)
            .on("dragover", Upload.handleDragOver)
            .on("dragleave", Upload.handleDragLeave)
            .on("drop", Upload.handleDrop)
            .find("input[type=file]").on("change", Upload.handleChange)

    @handleDragOver = (event) ->
        $(event.currentTarget).addClass(Upload.states.onDragOver)

    @handleDragLeave = (event) ->
        $(event.currentTarget).removeClass(Upload.states.onDragOver)

    @handleDrop = (event) ->
        event.preventDefault()
        $(event.currentTarget).removeClass(Upload.states.onDragOver)

        files = event.originalEvent.dataTransfer.files
        form = $(event.currentTarget).parents("form")
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
        return

    @handleChange = (event) ->
        event.target.form.trigger('submit')
        return

    # -----------------
    #       Object
    # -----------------

    constructor: (progressBar, form, data) ->
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
        @progressBar.reset()
