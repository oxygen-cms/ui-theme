// ================================
//             ImageEditor
// ================================

import Croppr from 'croppr';
import 'croppr/dist/croppr.min.css';
import {FullscreenToggle} from '../Core/Toggle';
import TabSwitcher from '../Core/TabSwitcher';
import {Notification, NotificationCenter} from '../Core/Notification';
import {respond} from '../Core/Fetch';
import {getFormData} from '../Core/Form';

class ImageEditor {

    // -----------------
    //      Object
    // -----------------

    constructor(container) {
        this.container = container;
        this.cropDisableCounter = 0;
        this.cropOrigin = { x: 0, y: 0 };
        this.croppr = null;
        this.image = this.container.querySelector("." + ImageEditor.classes.layout.image);
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
            content: 'Saving Image',
            status: 'success'
        });
        NotificationCenter.present(this.progressNotification);
    }

    gatherData() {
        var mode = TabSwitcher.list[0].current;
        switch (mode) {
            case 'simple': return this.getSimpleData();
            case 'advanced': return this.getAdvancedData();
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
                content: 'Already Processing',
                status: 'failed'
            }));
            return;
        }

        this.applyingChanges = true;

        console.log('Processing Image Using Commands: ', data);

        var url = this.image.getAttribute('data-root') + '?' + serializeToQueryString(data);
        var headers = new Headers();
        headers.set('Accept', 'application/json');
        var options = {
            method: 'GET',
            credentials: 'same-origin',
            headers: headers
        };

        console.log('Requesting URL: ', url, options);

        window.fetch(url, options)
            .then(respond.checkStatus)
            .then(response => {
                return response.blob();
            })
            .then(myBlob => {
                if ((this.croppr !== null)) { this.croppr.destroy(); }
                this.croppr = null;
                this.cropOrigin = this.pendingCropOrigin;

                let objectURL = URL.createObjectURL(myBlob);
                this.image.style.removeProperty('width');
                this.image.style.removeProperty('height');
                this.image.src = objectURL;
            })
            .then(
                r => {
                    NotificationCenter.present(new Notification({content: 'Image Processing Successful', status: 'success'}));
                    this.applyingChanges = false;
                },
                e => {
                    this.applyingChanges = false; throw e;
                }
            )
            .catch(respond.handleAPIError);
    }

    // --------------------------------------------
    //                     CROP
    // --------------------------------------------

    enableCropping() {
        this.croppr = new Croppr(this.image, {
            onCropMove: this.handleCropSelect.bind(this)
            // options
        });
    }

    handleCropSelect(c) {
        this.fields.crop.x.value = Math.round(c.x + this.cropOrigin.x).toString();
        this.fields.crop.y.value = Math.round(c.y + this.cropOrigin.y).toString();
        this.fields.crop.width.value = Math.round(c.width).toString();
        this.fields.crop.height.value = Math.round(c.height).toString();
    }

    handleCropInputChange(event) {
        if(this.croppr === null) { return; }
        let x = parseInt(this.fields.crop.x.value === "" ? 0 : this.fields.crop.x.value);
        let y = parseInt(this.fields.crop.y.value === "" ? 0 : this.fields.crop.y.value);
        let w = parseInt(this.fields.crop.width.value === "" ? 0 : this.fields.crop.width.value);
        let h = parseInt(this.fields.crop.height.value === "" ? 0 : this.fields.crop.height.value);

        console.log(w, h, x, y);
        return this.croppr.resizeTo([
            w,
            h,
            [x, y]
        ]);
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

export default ImageEditor;