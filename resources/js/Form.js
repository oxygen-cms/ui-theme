// ================================
//              Form
// ================================

//
// The Form helper can:
// - display a message upon exit if there are any unsaved changes.
// - send an ajax request with the form data on submit or change
//

class Form {

    static findAll(container) {
        container.find("form").each(function() {
            this.formObject = new Form(this);
        });

        return container.find(Form.classes.taggableInput).tagging({
            "edit-on-delete": false
        });
    }

    static registerKeydownHandler() {
        return $(document).on("keydown", Form.handleKeydown);
    }

    static handleKeydown() {
        // check for Command/Control S
        if ((event.ctrlKey || event.metaKey) && event.which === 83) {

            var forms = document.getElementsByTagName("form");
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
        this.originalData = $(element).serializeArray();
        //# content generators are notified before the form content is read
        this.contentGenerators = [];
        this.registerEvents();
    }

    registerEvents() {
        // Exit Dialog
        if (this.form.classList.contains(Form.classes.warnBeforeExit)) {
            $("a, button[type=\"submit\"]").on("click", this.handleExit.bind(this)); // displays exit dialog
        }

        // Submit via AJAX
        this.form.addEventListener("submit", this.handleSubmit.bind(this));
        if (this.form.classList.contains(Form.classes.sendAjaxOnChange)) {
            this.form.addEventListener("change", event => {
                event.preventDefault();
                this.submitViaAjax();
            });
        }

        // Auto Submit
        if (this.form.classList.contains(Form.classes.autoSubmit)) {
            return this.submit();
        }
    }

    handleExit(event) {
        if ($(event.currentTarget).hasClass("Form-submit")) { return; }
        this.generateContent();
        if (JSON.stringify($(this.form).serializeArray()) !== JSON.stringify(this.originalData)) {
            var target = $(event.currentTarget);

            if (!(target.attr("data-dialog-disabled") === "true")) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation(),

                vex.dialog.confirm({
                    message:  Form.messages.confirmation,
                    buttons: [
                        {
                            text: 'Save',
                            type: 'button',
                            className: 'vex-dialog-button-primary',
                            click: function($vexContent, event) {
                                $vexContent.data().vex.value = "save";
                                vex.close($vexContent.data().vex.id);
                            }
                        },
                        $.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'}),
                        {
                            text: 'Don\'t Save',
                            type: 'button',
                            className: 'vex-dialog-button-secondary vex-dialog-button-left',
                            click: function($vexContent, event) {
                                $vexContent.data().vex.value = "continue";
                                vex.close($vexContent.data().vex.id);
                            }
                        }
                    ],
                    callback: (value) => {
                        if(value == "continue") {
                            target.attr("data-dialog-disabled", "true");
                            return target[0].click();
                        } else if(value == "save") {
                            if (this.form.classList.contains(Form.classes.sendAjax)) {
                                this.submitViaAjax(true);
                                target.attr("data-dialog-disabled", "true");
                                target[0].click();
                            } else {
                                // not sure if this works
                                this.submit();
                                //target.attr("data-dialog-disabled", "true");
                                //target[0].click();
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
        if (this.form.classList.contains(Form.classes.sendAjax)) {
            event.preventDefault();
            this.submitViaAjax();
        }
    }

    submitViaAjax(ignoreRedirectResponse) {
        var saveData = (data) => {
            if (data.status === 'success') {
                this.originalData = $(this.form).serializeArray();
                console.log('Form Saved Successfully');
            }
            return data;
        };

        var promise = Ajax.request(
            $(this.form).attr("method"),
            $(this.form).attr("action"),
            Form.getFormDataObject(this.form)
        ).then(saveData).then(Ajax.displayNotification).catch(Ajax.handleError);

        if(!ignoreRedirectResponse) {
            promise = promise.then(Ajax.handleRedirect);
        }

        return promise;
    }

    static getFormDataObject(form) {
        var data = new FormData();
        $(form).find("[name]").each(function() {
            var name = $(this).attr("name");
            var value = $(this).val();

            if ($(this).is("[type=\"checkbox\"]") && !$(this).is(":checked")) {
                return;
            }

            if ($(this).is("[type=\"file\"]")) {
                var ref;
                var files = ((ref = this.filesToUpload) != null) ? ref : this.files;
                for (var i = 0, file; i < files.length; i++) {
                    file = files[i];
                    data.append(name, file);
                }
                return;
            }

            return data.append(name, value);
        });

        return data;
    }
}

Form.messages = {
    confirmation: "Do you want to save changes?"
};

Form.classes = {
    warnBeforeExit: "Form--warnBeforeExit",
    submitOnKeydown: "Form--submitOnKeydown",
    sendAjax: "Form--sendAjax",
    sendAjaxOnChange: "Form--sendAjaxOnChange",
    autoSubmit: "Form--autoSubmit",
    taggableInput: ".Form-taggable"
};