// ================================
//             ImageEditor
// ================================

class ImageEditor {

    // -----------------
    //      Object
    // -----------------

    constructor(container) {
        this.container = container;
        this.jCropApi = null;
        this.cropDisableCounter = 0;
        this.cropOrigin = { x: 0, y: 0 };
        this.image = this.container.querySelector("." + ImageEditor.classes.layout.image);
        this.$image = $(this.image);
        if (!this.image) { throw new Error("<img> element doesn't exist"); }

        this.forms = {
            simple: this.image.parentNode.parentNode.querySelector("." + ImageEditor.classes.form.simple),
            advanced: this.image.parentNode.parentNode.querySelector("." + ImageEditor.classes.form.advanced)
        };

        this.fields = {
            crop: {
                x: this.container.querySelector('[name="crop[x]"]'),
                y: this.container.querySelector('[name="crop[y]"]'),
                width: this.container.querySelector('[name="crop[width]"]'),
                height: this.container.querySelector('[name="crop[height]"]')
            },
            resize: {
                width: this.container.querySelector('[name="resize[width]"]'),
                height: this.container.querySelector('[name="resize[height]"]'),
                keepAspectRatio: this.container.querySelector('[name="resize[keepAspectRatio]"][value="true"]')
            },
            macro: this.container.querySelector('[name="macro"]'),
            name: this.container.querySelector('[name="name"]'),
            slug: this.container.querySelector('[name="slug"]')
        };

        this.image.addEventListener("load", (event) => {
            console.log('Image Loaded');
            let image = event.currentTarget;
            this.imageAspectRatio = image.naturalWidth / image.naturalHeight;
            this.fields.resize.width.value = image.naturalWidth;
            this.fields.resize.height.value = image.naturalHeight;
            this.enableCropping();
        });

        this.fullscreenToggle = new FullscreenToggle(this.container.querySelector("." + ImageEditor.classes.button.toggleFullscreen), this.container);

        this.container.querySelector("." + ImageEditor.classes.button.apply).addEventListener("click", this.handlePreview.bind(this));
        this.container.querySelector("." + ImageEditor.classes.button.save).addEventListener("click", this.handleSave.bind(this));
        this.container.querySelectorAll("." + ImageEditor.classes.form.crop).forEach(item => {
            item.addEventListener("input", this.handleCropInputChange.bind(this));
        })
        this.container.querySelectorAll("." + ImageEditor.classes.form.resize).forEach(item => {
            item.addEventListener("input", this.handleResizeInputChange.bind(this));
        })
    }

    handlePreview() {
        this.applyChanges(this.gatherData());
    }

    handleSave() {
        var data = this.gatherData();
        data.save = true;
        data.name = this.fields.name.value;
        data.slug = this.fields.slug.value;
        this.applyChanges(data);

        this.progressNotification = new Notification({
            content: "Saving Image",
            status: "success"
        });
        NotificationCenter.present(this.progressNotification);
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
        return this.removeDefaultFields(getFormData(this.forms.simple));
    }

    removeDefaultFields(formData) {
        var resize = (formData) => {
            return (!formData["resize[width]"] || formData["resize[width]"] === this.image.naturalWidth.toString()) &&(!formData["resize[height]"] || formData["resize[height]"] === this.image.naturalHeight.toString());
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
                //return item === ""  0 : parseInt(item)
                if(this.pendingCropOrigin === undefined) { this.pendingCropOrigin = {}; }
                this.pendingCropOrigin.x = parseInt(item);
            },
            "crop[y]": (item) => {
                if(this.pendingCropOrigin === undefined) { this.pendingCropOrigin = {}; }
                this.pendingCropOrigin.y = parseInt(item);
                //this.imageDimensions.cropY = item === "" ? 0 : parseInt(item);
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
        return JSON.parse(this.fields.macro.value);
    }

    // --------------------------------------------
    //                     REQUEST
    // --------------------------------------------

    applyChanges(data) {
        if(this.applyingChanges) {
            NotificationCenter.present(new Notification({
                content: "Already Processing",
                status: "failed"
            }));
            return;
        } else {
            this.progressNotification = new Notification({
                content: "Processing Image",
                status: "success"
            });
            NotificationCenter.present(this.progressNotification);
        }

        this.applyingChanges = true;

        console.log("Processing Image Using Commands: ", data);

        window.fetch(
            this.image.getAttribute("data-root") + "?" + serializeToQueryString(data),
            FetchOptions.default()
                .method("GET")
                .wantJson()
        )
            .then(Oxygen.respond.checkStatus)
            .then(response => {
                return response.blob();
            })
            .then(myBlob => {
                if ((this.jCropApi != null)) { this.jCropApi.destroy(); }
                this.jCropApi = null;
                this.cropOrigin = this.pendingCropOrigin;

                let objectURL = URL.createObjectURL(myBlob);
                this.image.style.removeProperty('width');
                this.image.style.removeProperty('height');
                this.image.src = objectURL;

                //this.image[0].src = "data:image/jpeg;base64," + base64Encode(response);
            })
            .then(
                r => {
                    NotificationCenter.present(new Notification({content: "Image Processing Successful", status: "success"}));
                    this.applyingChanges = false;
                },
                e => {
                    this.applyingChanges = false; throw e;
                }
            )
            .catch(Oxygen.respond.handleAPIError);
        /*$.ajax({
            type:           "GET",
            url:            this.image.attr("data-root"),
            data:           data,
            contentType:    false,
            success:        this.onRequestEnd.bind(this),
            error:          () => {
                //this.progressNotification.hide();
                //return Ajax.handleError();
            },
            xhr:            () => {
                var object = window.ActiveXObject ? new ActiveXObject("XMLHttp") : new XMLHttpRequest();
                object.overrideMimeType("text/plain; charset=x-user-defined");
                return object;
            }
        });*/
    }

    // --------------------------------------------
    //                     CROP
    // --------------------------------------------

    enableCropping() {
        /*if(this.jCropApi != null) {
            this.jCropApi.enable();
        } else {*/
            var that = this;
            this.$image.Jcrop({
                    trueSize: [this.image.naturalWidth, this.image.naturalHeight],
                    onChange: this.handleCropSelect.bind(this),
                    onSelect: this.handleCropSelect.bind(this),
                    onRelease: this.handleCropRelease.bind(this)
                }, function() {
                    that.jCropApi = this;
                }
            );
        //}
    }

    handleCropSelect(c) {
        if(this.cropDisableCounter <= 0) {
            this.fields.crop.x.value = Math.round(c.x + this.cropOrigin.x).toString();
            this.fields.crop.y.value = Math.round(c.y + this.cropOrigin.y).toString();
            this.fields.crop.width.value = Math.round(c.w).toString();
            this.fields.crop.height.value = Math.round(c.h).toString();
        } else {
            this.cropDisableCounter--;
        }
    }

    handleCropInputChange(event) {
        if(this.jCropApi === null) { return; }
        let x = parseInt(this.fields.crop.x.value === "" ? 0 : this.fields.crop.x.value);
        let y = parseInt(this.fields.crop.y.value === "" ? 0 : this.fields.crop.y.value);
        let w = parseInt(this.fields.crop.width.value === "" ? 0 : this.fields.crop.width.value);
        let h = parseInt(this.fields.crop.height.value === "" ? 0 : this.fields.crop.height.value);

        // this counts down from 2, so the next two events generated by Jcrop are ignored.
        this.cropDisableCounter = 2;

        return this.jCropApi.setSelect([
            x,
            y,
            x + w,
            y + h
        ]);
        console.log("end");
    }

    handleCropRelease() {
        this.fields.crop.x.value = 0;
        this.fields.crop.y.value = 0;
        this.fields.crop.width.value = 0;
        this.fields.crop.height.value = 0;
    }

    handleResizeInputChange(e) {
        if(this.fields.resize.keepAspectRatio[0].checked) {
            var name = e.target.name;
            var value = e.target.value;
            console.log(name, value);
            if(name === 'resize[width]') {
                return this.fields.resize.height.value = Math.round(value / this.imageAspectRatio);
            } else {
                return this.fields.resize.width.value = Math.round(value * this.imageAspectRatio.ratio);
            }
        }
    }

    static initialize(container) {
        for(let item of container.querySelectorAll("." + ImageEditor.classes.layout.container)) {
            ImageEditor.list.push(new ImageEditor(item));
        }
    }

};

function serializeToQueryString(object) {
    return Object.keys(object).reduce(function(a,k){a.push(k+'='+encodeURIComponent(object[k]));return a},[]).join('&');
}

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
