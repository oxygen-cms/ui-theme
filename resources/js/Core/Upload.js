class Upload {

    static registerEvents(container) {
        for(let item of container.querySelectorAll(Upload.selectors.uploadElement)) {
            var dropzone = item.querySelector(Upload.selectors.dropzoneElement);
            dropzone.addEventListener("dragover", Upload.handleDragOver);
            dropzone.addEventListener("dragleave", Upload.handleDragLeave);
            dropzone.addEventListener("drop", Upload.handleDrop);
            item.querySelector("input[type=file]").addEventListener("change", Upload.handleChange);
        }
    };

    static handleDragOver(event) {
        event.preventDefault();
        return event.currentTarget.classList.add(Upload.states.onDragOver);
    };

    static handleDragLeave(event) {
        return event.currentTarget.classList.remove(Upload.states.onDragOver);
    };

    static handleDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove(Upload.states.onDragOver);
        var upload = parentMatchingSelector(event.currentTarget, Upload.selectors.uploadElement);
        Upload.addFiles(upload, event.dataTransfer.files);
    };

    static handleChange(event) {
        Upload.addFiles(parentMatchingSelector(event.currentTarget, Upload.selectors.uploadElement), event.currentTarget.files);
        console.dir(event.currentTarget);
        event.currentTarget.value = ""; // reset the input field, so that the change event is always called.
    };

    static addFiles(upload, files) {
        let input = upload.querySelector('input[type="file"]');
        for(let file of files) {
            let imageType = /^image\//;
            console.log(file.type);
            let preview = document.createElement("div");
            preview.classList.add("FileUpload-preview");
            preview.innerHTML = '<div class="FileUpload-preview-info">' +
                    '<span>' + file.name + '</span>' +
                    '<button type="button" class="FileUpload-preview-remove Button--transparent Icon Icon-times"></button>' +
                    '<span class="FileUpload-preview-size">' + fileSize(file.size) + '</span>' +
                '</div>';
            upload.insertBefore(preview, upload.firstChild);
            preview.querySelector(Upload.selectors.removeFile).addEventListener("click", function(event) {
                var button, index;
                button = event.currentTarget;
                preview = parentMatchingSelector(button, Upload.selectors.previewElement);
                index = input.filesToUpload.indexOf(file);

                if(index > -1) {
                    input.filesToUpload.splice(index, 1)
                }
                Upload.recalculateDropzoneVisibility(upload, files);
                preview.parentNode.removeChild(preview);
            });
            if (input.filesToUpload == null) {
                input.filesToUpload = [];
            }
            input.filesToUpload.push(file);
            if (imageType.test(file.type)) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    preview.style.backgroundImage = 'url(' + e.target.result + ')';
                };
                reader.readAsDataURL(file);
            } else {
                let container = document.createElement("div");
                container.classList.add("Icon-container");
                let icon = document.createElement("span");
                icon.classList.add("Icon", "Icon--gigantic", "Icon--light", "Icon-file-text");
                container.appendChild(icon);
                preview.insertBefore(container, preview.firstChild);
            }
        }
        Upload.recalculateDropzoneVisibility(upload);
        console.log(files);
    };

    static recalculateDropzoneVisibility(upload, files) {
        var input = upload.querySelector('input[type="file"]');
        var dropzone = upload.querySelector(Upload.selectors.dropzoneElement);
        if(!input.multiple && input.filesToUpload.length > 0) {
            dropzone.style.display = "none";
        } else {
            dropzone.style.display = "block";
        }
    }

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
