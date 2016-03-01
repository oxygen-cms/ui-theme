// ================================
//             ImageEditor
// ================================

class ImageEditor {

    // -----------------
    //      Object
    // -----------------

    constructor(container) {
        this.handlePreview = this.handlePreview.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onRequestEnd = this.onRequestEnd.bind(this);
        this.handleCropEnable = this.handleCropEnable.bind(this);
        this.handleCropDisable = this.handleCropDisable.bind(this);
        this.handleCropSelect = this.handleCropSelect.bind(this);
        this.handleCropInputChange = this.handleCropInputChange.bind(this);
        this.handleCropRelease = this.handleCropRelease.bind(this);
        this.handleResizeInputChange = this.handleResizeInputChange.bind(this);
        this.container = container;
        this.image = this.container.find("." + ImageEditor.classes.layout.image);
        if (!this.image.length) { throw new Error("<img> element doesn't exist"); }

        this.forms = {
            simple: this.image.parent().parent().find("." + ImageEditor.classes.form.simple),
            advanced: this.image.parent().parent().find("." + ImageEditor.classes.form.advanced)
        };

        this.fields = {
            crop: {
                x: this.container.find('[name="crop[x]"]'),
                y: this.container.find('[name="crop[y]"]'),
                width: this.container.find('[name="crop[width]"]'),
                height: this.container.find('[name="crop[height]"]')
            },
            resize: {
                width: this.container.find('[name="resize[width]"]'),
                height: this.container.find('[name="resize[height]"]'),
                keepAspectRatio: this.container.find('[name="resize[keepAspectRatio]"][value="true"]')
            },
            macro: this.container.find('[name="macro"]'),
            name: this.container.find('[name="name"]'),
            slug: this.container.find('[name="slug"]')
        };

        var that = this;
        this.image[0].onload = function() {
            console.log('Image Loaded');
            if (!(that.imageDimensions != null)) { that.imageDimensions = { cropX: 0, cropY: 0 }; }
            that.imageDimensions.width = this.clientWidth;
            that.imageDimensions.height = this.clientHeight;
            that.imageDimensions.naturalWidth = this.naturalWidth;
            that.imageDimensions.naturalHeight = this.naturalHeight;
            that.imageDimensions.ratio = this.naturalWidth / this.naturalHeight;
            that.fields.resize.width.val(that.imageDimensions.naturalWidth);
            that.fields.resize.height.val(that.imageDimensions.naturalHeight);
            return that.handleCropEnable();
        };

        this.fullscreenToggle = new FullscreenToggle(this.container.find("." + ImageEditor.classes.button.toggleFullscreen),this.container, function(){} , function() {});

        this.container.find("." + ImageEditor.classes.button.apply).on("click", this.handlePreview);
        this.container.find("." + ImageEditor.classes.button.save).on("click", this.handleSave);
        this.container.find("." + ImageEditor.classes.form.crop).on("change", this.handleCropInputChange);
        this.container.find("." + ImageEditor.classes.form.resize).on("change", this.handleResizeInputChange);

        this.jCropApi = null;
        this.cropDisableCounter = 2;
    }

    handlePreview() {
        this.applyChanges(this.gatherData());

        return this.progressNotification = new Notification({
            content: "Processing Image",
            status: "success"
        });
    }

    handleSave() {
        var data = this.gatherData();
        data.save = true;
        data.name = this.fields.name.val();
        data.slug = this.fields.slug.val();
        this.applyChanges(data);

        return this.progressNotification = new Notification({
            content: "Saving Image",
            status: "success"
        });
    }

    gatherData() {
        var mode = TabSwitcher.list[0].current;
        switch (mode) {
            case "simple": return this.getSimpleData();
            case "advanced": return this.getAdvancedData();
            default: return {};
        }
    }

    getSimpleData() {
        return this.removeDefaultFields(Form.getFormData(this.forms.simple));
    }

    removeDefaultFields(formData) {
        var resize = (formData) => {
            return (!formData["resize[width]"] || formData["resize[width]"] === this.imageDimensions.naturalWidth.toString()) &&(!formData["resize[height]"] || formData["resize[height]"] === this.imageDimensions.naturalHeight.toString());
        };

        var defaults = {
            "fit[position]": (item) => {
                return item === "center";
            },
            "resize[width]": (item, formData) => {
                return resize(formData);
            },
            "resize[height]": (item, formData) => {
                return resize(formData);
            },
            "resize[keepAspectRatio]": (item, formData) => {
                return resize(formData);
            },
            "gamma": (item) => {
                return item === "1";
            },
            "greyscale": (item) => {
                return item === "false";
            },
            "invert": (item) => {
                return item === "false";
            },
            "rotate[backgroundColor]": (item) => {
                return item === "#ffffff";
            },
            "crop[x]": (item) => {
                return this.imageDimensions.cropX = item === "" ? 0 : parseInt(item);
            },
            "crop[y]": (item) => {
                return this.imageDimensions.cropY = item === "" ? 0 : parseInt(item);
            }
        };

        for (var key in formData) {
            var item = formData[key];
            if(defaults[key] && defaults[key](item, formData)) {
                delete formData[key];
            } else if(item === "0" || item === "") {
                delete formData[key];
            }
        }

        return formData;
    }

    getAdvancedData() {
        return JSON.parse(this.fields.macro.val());
    }

    // --------------------------------------------
    //                     REQUEST
    // --------------------------------------------

    applyChanges(data) {
        if (this.applyingChanges) {
            new Notification({
                content: "Already Processing",
                status: "failed"
            });
            return;
        }

        $.ajax({
            type:           "GET",
            url:            this.image.attr("data-root"),
            data:           data,
            contentType:    false,
            success:        this.onRequestEnd,
            error:          () => {
                this.progressNotification.hide();
                return Ajax.handleError();
            },
            xhr:            () => {
                var object = window.ActiveXObject ? new ActiveXObject("XMLHttp") : new XMLHttpRequest();
                object.overrideMimeType("text/plain; charset=x-user-defined");
                return object;
            }
        });
        return this.applyingChanges = true;
    }

    onRequestEnd(response, status, request) {
        this.applyingChanges = false;
        this.progressNotification.hide();
        if ((this.jCropApi != null)) { this.jCropApi.destroy(); }
        this.jCropApi = null;
        this.forms.simple.attr("data-changed", false);
        this.forms.advanced.attr("data-changed", false);

        return this.image[0].src = "data:image/jpeg;base64," + base64Encode(response);
    }

    // --------------------------------------------
    //                     CROP
    // --------------------------------------------

    handleCropEnable() {
        if((this.jCropApi != null)) {
            return this.jCropApi.enable();
        } else {
            var that = this;
            return this.image.Jcrop({
                    onChange: this.handleCropSelect,
                    onSelect: this.handleCropSelect,
                    onRelease: this.handleCropRelease
                }, function() {
                    return that.jCropApi = this;
                }
            );
        }
    }

    handleCropDisable() {
        return this.jCropApi.disable();
    }

    handleCropSelect(c) {
        if(this.cropDisableCounter > 1) {
            this.fields.crop.x.val(Math.round(c.x / this.imageDimensions.width * this.imageDimensions.naturalWidth + this.imageDimensions.cropX));
            this.fields.crop.y.val(Math.round(c.y / this.imageDimensions.height * this.imageDimensions.naturalHeight + this.imageDimensions.cropY));
            this.fields.crop.width.val(Math.round(c.w / this.imageDimensions.width * this.imageDimensions.naturalWidth));
            return this.fields.crop.height.val(Math.round(c.h / this.imageDimensions.height * this.imageDimensions.naturalHeight));
        } else {
            return this.cropDisableCounter++;
        }
    }

    handleCropInputChange() {
        if(!(this.jCropApi != null)) { return; }
        var x = this.fields.crop.x.val() / this.imageDimensions.naturalWidth * this.imageDimensions.width - this.imageDimensions.cropX;
        var y = this.fields.crop.y.val() / this.imageDimensions.naturalHeight * this.imageDimensions.height - this.imageDimensions.cropY;
        this.cropDisableCounter = 0;
        return this.jCropApi.setSelect([
            x,
            y,
            x + this.fields.crop.width.val() / this.imageDimensions.naturalWidth * this.imageDimensions.width,
            y + this.fields.crop.height.val() / this.imageDimensions.naturalHeight * this.imageDimensions.height
        ]);
    }

    handleCropRelease() {
        this.fields.crop.x.val(0);
        this.fields.crop.y.val(0);
        this.fields.crop.width.val(0);
        return this.fields.crop.height.val(0);
    }

    handleResizeInputChange(e) {
        if(this.fields.resize.keepAspectRatio[0].checked) {
            var name = e.target.name;
            var value = $(e.target).val();
            console.log(name, value);
            if(name === 'resize[width]') {
                return this.fields.resize.height.val(Math.round(value / this.imageDimensions.ratio));
            } else {
                return this.fields.resize.width.val(Math.round(value * this.imageDimensions.ratio));
            }
        }
    }

    static initialize(container) {
        return container.find("." + ImageEditor.classes.layout.container).each( function() {
                return ImageEditor.list.push(new ImageEditor($(this)));
            }
        );
    }

};


var base64Encode = function(inputStr) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var outputStr = "";
    var i = 0;
    while (i < inputStr.length) {

        //all three "& 0xff" added below are there to fix a known bug
        //with bytes returned by xhr.responseText
        var byte1 = inputStr.charCodeAt(i++) & 0xff;
        var byte2 = inputStr.charCodeAt(i++) & 0xff;
        var byte3 = inputStr.charCodeAt(i++) & 0xff;
        var enc1 = byte1 >> 2;
        var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
        var enc3 = undefined;
        var enc4 = undefined;
        if (isNaN(byte2)) {
            enc3 = enc4 = 64;
        } else {
            enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
            if (isNaN(byte3)) {
                enc4 = 64;
            } else {
                enc4 = byte3 & 63;
            }
        }
        outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
    }
    return outputStr;
};

ImageEditor.list = [];

ImageEditor.classes = {
    layout: {
        container: "ImageEditor",
        image: "ImageEditor-image"
    },
    button: {
        toggleFullscreen: "ImageEditor-toggleFullscreen",
        save: "ImageEditor-save",
        apply: "ImageEditor-apply"
    },
    form: {
        simple: "ImageEditor-form--simple",
        advanced: "ImageEditor-form--advanced",
        crop: "ImageEditor-crop-input",
        resize: "ImageEditor-resize-input"
    }
};