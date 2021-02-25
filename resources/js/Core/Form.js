// The Form helper can:
// - display a message upon exit if there are any unsaved changes.
// - send an async request with the form data on submit or change

import vex from 'vex-js/dist/js/vex.combined';
import { NotificationCenter, Notification } from './Notification';
import { FetchOptions, respond } from './Fetch';
import $ from 'jquery';
import Dialog from './Dialog';

class Form {

    static findAll(container) {
        for(let item of container.querySelectorAll('form')) {
            item.formObject = new Form(item);
        }

        // TODO: fix taggable inputs
        // $(container).find(Form.classes.taggableInput).tagging({
        //     'edit-on-delete': false
        // });
    }

    static registerKeydownHandler() {
        return document.addEventListener('keydown', Form.handleKeydown);
    }

    static handleKeydown(event) {
        // check for Command/Control S
        if ((event.ctrlKey || event.metaKey) && event.which === 83) {

            var forms = document.getElementsByTagName('form');
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if(form.classList.contains(Form.classes.submitOnKeydown) && form.formObject) {
                    form.formObject.submit();
                    event.preventDefault();
                }
            }
        }
    }

    constructor(element) {
        this.form = element;
        this.originalData = getFormData(this.form);
        //# content generators are notified before the form content is read
        this.contentGenerators = [];
        this.registerEvents();
    }

    registerEvents() {
        // Exit Dialog
        if (this.form.classList.contains(Form.classes.warnBeforeExit)) {
            for(let item of document.querySelectorAll('a, button[type=\'submit\']')) {
                item.addEventListener('click', event => this.handleExit(event)); // displays exit dialog
            }
        }

        // Submit asynchronously
        this.form.addEventListener('submit', event => this.handleSubmit(event));
        if (this.form.classList.contains(Form.classes.submitAsyncOnChange)) {
            this.form.addEventListener('change', event => {
                event.preventDefault();
                this.submitAsync();
            });
        }

        // Auto Submit
        if (this.form.classList.contains(Form.classes.autoSubmit)) {
            return this.submit();
        }
    }

    handleExit(event) {
        if (event.currentTarget.classList.contains('Form-submit')) { return; }
        if (!document.body.contains(this.form)) { return; }
        this.generateContent();
        var original = this.originalData;
        var current = getFormData(this.form);
        // console.log('original form data:', original);
        // console.log('current form data:', current);
        if(!compareByValue(original, current)) {
            console.log('=> form data differs');
            var target = event.currentTarget;

            if (!(target.getAttribute('data-dialog-disabled') === 'true')) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                const dialog = vex.dialog.confirm({
                    message:  Form.messages.confirmation,
                    className: Dialog.classes.main,
                    buttons: [
                        {
                            text: 'Save',
                            type: 'button',
                            className: 'vex-dialog-button-primary',
                            click: function(event) {
                                dialog.value = 'save';
                                dialog.close();
                            }
                        },
                        $.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'}),
                        {
                            text: 'Don\'t Save',
                            type: 'button',
                            className: 'vex-dialog-button-secondary vex-dialog-button-left',
                            click: function(event) {
                                dialog.value = 'continue';
                                dialog.close();
                            }
                        }
                    ],
                    callback: (value) => {
                        if(value === 'continue') {
                            console.log('not saving form');
                            target.setAttribute('data-dialog-disabled', 'true');
                            return target.click();
                        } else if(value === 'save') {
                            console.log('saving form');
                            if (this.form.classList.contains(Form.classes.submitAsync)) {
                                this.submitAsync(true);
                                target.setAttribute('data-dialog-disabled', 'true');
                                target.click();
                            } else {
                                // not sure if this works
                                this.submit();
                                //target.attr('data-dialog-disabled', 'true');
                                //target.click();
                            }
                        }
                    }
                });
            }
        }
    }

    submit() {
        this.form.querySelector('button[type="submit"]').click();
    }

    generateContent() {
        for (var generator of this.contentGenerators) {
            generator(this);
        }
    }

    handleSubmit(event) {
        this.generateContent();
        if (this.form.classList.contains(Form.classes.submitAsync) && !Form.disableAsync) {
            event.preventDefault();
            this.submitAsync();
        }
    }

    submitAsync(ignoreRedirectResponse) {
        const saveData = (data) => {
            if (data.status === 'success') {
                this.originalData = getFormData(this.form);
                console.log('Form Saved Successfully');
            }
            return data;
        };

        const data = getFormData(this.form);
        // console.log('Submitting Form with Data: ', data);

        let promise = window.fetch(
            this.form.action,
            FetchOptions.default()
                .method(this.form.method)
                .body(getFormDataObject(data))
                .wantJson()
        )
            .then(respond.checkStatus)
            .then(respond.json)
            .then(saveData);

        let modifyPromise = this.form.modifyPromise;
        if(modifyPromise === undefined) {
            modifyPromise = function(promise) { return promise; };
        }

        promise = promise.then(respond.notification);

        if(!ignoreRedirectResponse) {
            promise = promise.then(respond.redirect);
        }

        promise = modifyPromise(promise);
        promise = promise.catch(respond.handleAPIError);

        return promise;
    }
}

function getFormData(form) {
    let data = {};

    for(let item of form.querySelectorAll('[name]')) {
        if(item.type == 'checkbox' || item.type == 'radio') {
            if(!item.checked) {
                continue;
            }
        }

        if(item.name == undefined) {
            console.dir(item);
        }
        if (item.type == 'select-multiple') {
            data[item.name] = [];
            for(let option of item.options) {
                if(option.selected) {
                    data[item.name].push(option.value);
                }
            }
        } else if(item.type == 'file') {
            var ref;
            var files = ((ref = item.filesToUpload) != null) ? ref : item.files;
            data[item.name] = [];
            for (var i = 0, file; i < files.length; i++) {
                file = files[i];
                data[item.name].push(file);
            }
        } else if(item.name.endsWith('[]')) {
            if(typeof data[item.name] == 'undefined' || data[item.name] === null) {
                data[item.name] = [];
            }
            data[item.name].push(item.value);
        } else {
            data[item.name] = item.value;
        }
    }

    return data;
}

function getFormDataObject(data) {
    let formData = new FormData();

    for(let key in data) {
        if(data[key] instanceof Array) {
            for(let value of data[key]) {
                formData.append(key, value);
            }
        } else {
            formData.append(key, data[key]);
        }
    }

    return formData;
}

/// The `===` operator or `Object.is` doesn't cut it.
/// https://gist.github.com/nicbell/6081098
function compareByValue(obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
            return false;
        }

		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!compareByValue(obj1[p], obj2[p])) { return false; }
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) {
                    return false;
                }
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) { return false; }
		}
	}

	//Check object 2 for any extra properties
	for (var p in obj2) {
        if(obj2.hasOwnProperty(p)) {
            if (typeof (obj1[p]) == 'undefined') {
                return false;
            }
        }
	}
	return true;
}

Form.disableAsync = false;

/**
 * Toggles whether asynchronous form submission is enabled globally, using Alt + Command/Control + J
 */
document.addEventListener('keydown', function(event) {
    if(event.altKey && (event.ctrlKey || event.metaKey) && event.key === 'j') {
        Form.disableAsync = !Form.disableAsync;
        event.preventDefault();
        NotificationCenter.present(new Notification({
            content: 'Asynchronous form submission ' + (Form.disableAsync ? 'disabled' : 'enabled'),
            status: 'info'
        }));
    }
});

Form.messages = {
    confirmation: 'Do you want to save changes?'
};

Form.classes = {
    warnBeforeExit: 'Form--warnBeforeExit',
    submitOnKeydown: 'Form--submitOnKeydown',
    submitAsync: 'Form--sendAjax',
    submitAsyncOnChange: 'Form--sendAjaxOnChange',
    autoSubmit: 'Form--autoSubmit',
    taggableInput: '.Form-taggable'
};


export { Form, getFormDataObject, getFormData };
