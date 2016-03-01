class Upload {

    static registerEvents(container) {
        var elements;
        elements = container.find(Upload.selectors.uploadElement);
        elements.find(Upload.selectors.dropzoneElement).on("dragover", Upload.handleDragOver).on("dragleave", Upload.handleDragLeave).on("drop", Upload.handleDrop);
        return elements.find("input[type=file]").on("change", Upload.handleChange);
    };

    static handleDragOver(event) {
        event.preventDefault();
        return $(event.currentTarget).addClass(Upload.states.onDragOver);
    };

    static handleDragLeave(event) {
        return $(event.currentTarget).removeClass(Upload.states.onDragOver);
    };

    static handleDrop(event) {
        var upload;
        event.preventDefault();
        $(event.currentTarget).removeClass(Upload.states.onDragOver);
        upload = $(event.currentTarget).closest(Upload.selectors.uploadElement);
        return Upload.addFiles(upload, event.originalEvent.dataTransfer.files);
    };

    static handleChange(event) {
        return Upload.addFiles($(event.currentTarget).closest(Upload.selectors.uploadElement), event.currentTarget.files);
    };

    static addFiles(upload, files) {
        var file, i, imageType, input, len, preview, reader;
        input = upload.find('input[type="file"]')[0];
        for (i = 0, len = files.length; i < len; i++) {
            file = files[i];
            imageType = /^image\//;
            console.log(file.type);
            preview = $('<div class="FileUpload-preview"> <div class="FileUpload-preview-info"><span>' + file.name + '</span><button type="button" class="FileUpload-preview-remove Button--transparent Icon Icon-times"></button><span class="FileUpload-preview-size">' + fileSize(file.size) + '</span></div> </div>');
            preview.find(Upload.selectors.removeFile).on("click", function (event) {
                var button, index;
                button = $(event.currentTarget);
                preview = button.closest(Upload.selectors.previewElement);
                index = input.filesToUpload.indexOf(file);

                if(index > -1) {
                    input.filesToUpload.splice(index, 1)
                }
                return preview.remove();
            });
            upload.prepend(preview);
            if (input.filesToUpload == null) {
                input.filesToUpload = [];
            }
            input.filesToUpload.push(file);
            if (!imageType.test(file.type)) {
                continue;
            }
            reader = new FileReader();
            reader.onload = function (e) {
                console.log(e);
                preview.css("background-image", 'url(' + e.target.result + ')');
                return console.log(preview.css("background-image"));
            };
            reader.readAsDataURL(file);
        }
        return console.log(files);
    };

};

Upload.selectors = {
    uploadElement: ".FileUpload",
    previewElement: ".FileUpload-preview",
    dropzoneElement: ".FileUpload-dropzone",
    removeFile: ".FileUpload-preview-remove"
};

Upload.states = {
    onDragOver: "FileUpload--onDragOver"
};

function fileSize(sizeInBytes) {
    var approx, multiple, multiples, output;
    output = sizeInBytes + " bytes";
    multiples = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    multiple = 0;
    approx = sizeInBytes / 1024;
    while (approx > 1) {
        output = approx.toFixed(3) + ' ' + multiples[multiple];
        approx /= 1024;
        multiple++;
    }
    return output;
}