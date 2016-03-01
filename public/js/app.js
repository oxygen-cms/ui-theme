"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//            AjaxRequest
// ================================

var Ajax = function () {
    function Ajax() {
        _classCallCheck(this, Ajax);
    }

    _createClass(Ajax, null, [{
        key: "request",
        value: function request(type, url, data) {
            var promise = new Promise(function (resolve, reject) {
                $.ajax({
                    dataType: "json",
                    type: type,
                    url: url,
                    data: data,
                    processData: false,
                    contentType: false,
                    success: function success(data) {
                        return resolve(data);
                    },
                    error: function error(response, textStatus, errorThrown) {
                        return reject({ response: response, textStatus: textStatus, errorThrown: errorThrown });
                    }
                });
            });
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Ajax.successCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var handler = _step.value;

                    promise = promise.then(handler);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Ajax.errorCallbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var handler = _step2.value;

                    promise = promise.catch(handler);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return promise;
        }
    }]);

    return Ajax;
}();

Ajax.successCallbacks = [];
Ajax.errorCallbacks = [];

Ajax.displayNotification = function (data) {
    console.log(data);
    new Notification(data);
    return data;
};

Ajax.handleRedirect = function (data) {
    if (data.redirect) {
        if (window.smoothState && !(data.hardRedirect === true)) {
            window.smoothState.load(data.redirect, false);
        } else {
            window.location.replace(data.redirect);
        }
    }
    return data;
};

Ajax.handleError = function (error) {
    console.log(error);
    // handle network errors
    if (error.response.readyState === 0) {
        console.error(response);
        new Notification({
            content: "Cannot connect to the server",
            status: "info"
        });
    }

    // try to build a flash message from the error response
    try {
        var content = $.parseJSON(error.response.responseText);

        if (content.content) {
            new Notification(content);
        } else {
            console.error(content);

            new Notification({
                content: "Exception of type <code class=\"no-wrap\">" + content.error.type + "</code> with message <code class=\"no-wrap\">" + content.error.message + "</code> thrown at <code class=\"no-wrap\">" + content.error.file + ":" + content.error.line + "</code>",
                status: "failed"
            });
        }
    } catch (e) {
        console.error(error.response.responseText);

        new Notification({
            content: "Whoops, looks like something went wrong.",
            status: "failed"
        });
    }
    return error;
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//            AjaxRequest
// ================================

var Dialog = function () {
    function Dialog() {
        _classCallCheck(this, Dialog);
    }

    _createClass(Dialog, null, [{
        key: "registerEvents",
        value: function registerEvents(container) {
            container.find("[data-dialog-type=\"confirm\"]").on("click", this.handleConfirmClick);
            return container.find("[data-dialog-type=\"alert\"]").on("click", this.handleAlertClick);
        }
    }, {
        key: "handleAlertClick",
        value: function handleAlertClick(event) {
            var target = $(event.currentTarget);
            return vex.dialog.alert(target.attr("data-dialog-message"));
        }
    }, {
        key: "handleConfirmClick",
        value: function handleConfirmClick(event, customConfig) {
            var target = $(event.currentTarget);

            if (!(target.attr("data-dialog-disabled") === "true")) {
                var defaultConfig;
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation(), defaultConfig = {
                    message: target.attr("data-dialog-message"),
                    callback: function callback(value) {
                        if (value) {
                            target.attr("data-dialog-disabled", "true");
                            return target[0].click();
                        }
                    }
                };

                for (var attribute in customConfig) {
                    defaultConfig[attribute] = customConfig[attribute];
                }

                return vex.dialog.confirm(defaultConfig);
            }
        }
    }]);

    return Dialog;
}();

;
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//             Dropdown
// ================================

var Dropdown = function () {
    function Dropdown() {
        _classCallCheck(this, Dropdown);
    }

    _createClass(Dropdown, null, [{
        key: "registerGlobalEvent",
        value: function registerGlobalEvent() {
            return $(document).on("click", this.handleGlobalClick.bind(this));
        }
    }, {
        key: "registerEvents",
        value: function registerEvents(container) {
            return container.find("." + Dropdown.classes.dropdownToggle).on("click", this.handleClick.bind(this));
        }
    }, {
        key: "handleClick",
        value: function handleClick(event) {
            var container = $(event.target);
            while (!container.hasClass(Dropdown.classes.dropdownToggle)) {
                if (container.is("a[href], form")) {
                    return;
                }
                container = container.parent();
            }
            var dropdown = container.find("." + Dropdown.classes.dropdownList);
            if (dropdown.hasClass(Dropdown.classes.isActive)) {
                return dropdown.removeClass(Dropdown.classes.isActive);
            } else {
                $("." + Dropdown.classes.dropdownList).removeClass(Dropdown.classes.isActive);
                return dropdown.addClass(Dropdown.classes.isActive);
            }
        }
    }, {
        key: "handleGlobalClick",
        value: function handleGlobalClick(event) {
            var target = $(event.target);
            var targetHasClass = target.hasClass(Dropdown.classes.dropdownToggle);
            var parentHasClass = target.parent().hasClass(Dropdown.classes.dropdownToggle);
            var ancestorExists = target.parents("." + Dropdown.classes.dropdownToggle).length;
            if (!targetHasClass && !parentHasClass && !ancestorExists) {
                return $("." + Dropdown.classes.dropdownList).removeClass(Dropdown.classes.isActive);
            }
        }
    }]);

    return Dropdown;
}();

;

Dropdown.classes = {
    dropdownToggle: "Dropdown-container",
    dropdownList: "Dropdown",
    isActive: "is-active"
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//              Form
// ================================

var EditableList = function () {
    function EditableList() {
        _classCallCheck(this, EditableList);
    }

    _createClass(EditableList, null, [{
        key: "registerEvents",
        value: function registerEvents(container) {
            container.find("." + EditableList.classes.add).on("click", EditableList.handleAdd);
            return container.on("click", "." + EditableList.classes.remove, EditableList.handleRemove);
        }
    }, {
        key: "handleAdd",
        value: function handleAdd(event) {
            var container = $(event.currentTarget).siblings("." + EditableList.classes.container);
            var template = container.find("." + EditableList.classes.template);
            template = template.clone().removeClass(EditableList.classes.template);
            console.log(template);
            container.append(template);
            return console.log('add');
        }
    }, {
        key: "handleRemove",
        value: function handleRemove(event) {
            var row = $(event.currentTarget).closest("." + EditableList.classes.row);
            row.remove();
            return console.log('remove');
        }
    }]);

    return EditableList;
}();

;

EditableList.classes = {
    container: "EditableList",
    template: "EditableList-template",
    row: "EditableList-row",
    remove: "EditableList-remove",
    add: "EditableList-add"
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//              Form
// ================================

//
// The Form helper can:
// - display a message upon exit if there are any unsaved changes.
// - send an ajax request with the form data on submit or change
//

var Form = function () {
    _createClass(Form, null, [{
        key: "findAll",
        value: function findAll(container) {
            container.find("form").each(function () {
                this.formObject = new Form(this);
            });

            return container.find(Form.classes.taggableInput).tagging({
                "edit-on-delete": false
            });
        }
    }, {
        key: "registerKeydownHandler",
        value: function registerKeydownHandler() {
            return $(document).on("keydown", Form.handleKeydown);
        }
    }, {
        key: "handleKeydown",
        value: function handleKeydown() {
            // check for Command/Control S
            if ((event.ctrlKey || event.metaKey) && event.which === 83) {

                var forms = document.getElementsByTagName("form");
                for (var i = 0; i < forms.length; i++) {
                    var form = forms[i];
                    if (form.classList.contains(Form.classes.submitOnKeydown) && form.formObject) {
                        form.formObject.submit();
                        event.preventDefault();
                    }
                }
            }
        }
    }]);

    function Form(element) {
        _classCallCheck(this, Form);

        this.form = element;
        this.originalData = $(element).serializeArray();
        //# content generators are notified before the form content is read
        this.contentGenerators = [];
        this.registerEvents();
    }

    _createClass(Form, [{
        key: "registerEvents",
        value: function registerEvents() {
            var _this = this;

            // Exit Dialog
            if (this.form.classList.contains(Form.classes.warnBeforeExit)) {
                $("a, button[type=\"submit\"]").on("click", this.handleExit.bind(this)); // displays exit dialog
            }

            // Submit via AJAX
            this.form.addEventListener("submit", this.handleSubmit.bind(this));
            if (this.form.classList.contains(Form.classes.sendAjaxOnChange)) {
                this.form.addEventListener("change", function (event) {
                    event.preventDefault();
                    _this.submitViaAjax();
                });
            }

            // Auto Submit
            if (this.form.classList.contains(Form.classes.autoSubmit)) {
                return this.submit();
            }
        }
    }, {
        key: "handleExit",
        value: function handleExit(event) {
            var _this2 = this;

            if ($(event.currentTarget).hasClass("Form-submit")) {
                return;
            }
            this.generateContent();
            if (JSON.stringify($(this.form).serializeArray()) !== JSON.stringify(this.originalData)) {
                var target = $(event.currentTarget);

                if (!(target.attr("data-dialog-disabled") === "true")) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation(), vex.dialog.confirm({
                        message: Form.messages.confirmation,
                        buttons: [{
                            text: 'Save',
                            type: 'button',
                            className: 'vex-dialog-button-primary',
                            click: function click($vexContent, event) {
                                $vexContent.data().vex.value = "save";
                                vex.close($vexContent.data().vex.id);
                            }
                        }, $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' }), {
                            text: 'Don\'t Save',
                            type: 'button',
                            className: 'vex-dialog-button-secondary vex-dialog-button-left',
                            click: function click($vexContent, event) {
                                $vexContent.data().vex.value = "continue";
                                vex.close($vexContent.data().vex.id);
                            }
                        }],
                        callback: function callback(value) {
                            if (value == "continue") {
                                target.attr("data-dialog-disabled", "true");
                                return target[0].click();
                            } else if (value == "save") {
                                if (_this2.form.classList.contains(Form.classes.sendAjax)) {
                                    _this2.submitViaAjax(true);
                                    target.attr("data-dialog-disabled", "true");
                                    target[0].click();
                                } else {
                                    // not sure if this works
                                    _this2.submit();
                                    //target.attr("data-dialog-disabled", "true");
                                    //target[0].click();
                                }
                            }
                        }
                    });
                }
            }
        }
    }, {
        key: "submit",
        value: function submit() {
            this.form.querySelector('button[type="submit"]').click();
        }
    }, {
        key: "generateContent",
        value: function generateContent() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.contentGenerators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var generator = _step.value;

                    generator(this);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "handleSubmit",
        value: function handleSubmit(event) {
            this.generateContent();
            if (this.form.classList.contains(Form.classes.sendAjax)) {
                event.preventDefault();
                this.submitViaAjax();
            }
        }
    }, {
        key: "submitViaAjax",
        value: function submitViaAjax(ignoreRedirectResponse) {
            var _this3 = this;

            var saveData = function saveData(data) {
                if (data.status === 'success') {
                    _this3.originalData = $(_this3.form).serializeArray();
                    console.log('Form Saved Successfully');
                }
                return data;
            };

            var promise = Ajax.request($(this.form).attr("method"), $(this.form).attr("action"), Form.getFormDataObject(this.form)).then(saveData).then(Ajax.displayNotification).catch(Ajax.handleError);

            if (!ignoreRedirectResponse) {
                promise = promise.then(Ajax.handleRedirect);
            }

            return promise;
        }
    }], [{
        key: "getFormDataObject",
        value: function getFormDataObject(form) {
            var data = new FormData();
            $(form).find("[name]").each(function () {
                var name = $(this).attr("name");
                var value = $(this).val();

                if ($(this).is("[type=\"checkbox\"]") && !$(this).is(":checked")) {
                    return;
                }

                if ($(this).is("[type=\"file\"]")) {
                    var ref;
                    var files = (ref = this.filesToUpload) != null ? ref : this.files;
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
    }]);

    return Form;
}();

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
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//             MainNav
// ================================

var MainNav = function () {
    function MainNav() {
        _classCallCheck(this, MainNav);
    }

    _createClass(MainNav, null, [{
        key: "headroom",
        value: function headroom() {
            var header = $(".MainNav");

            if (header.length > 0) {
                if ($(window).width() > 768) {
                    var headroom = new Headroom(header[0], {
                        "tolerance": 20,
                        "offset": 50,
                        "classes": { "initial": "Headroom",
                            "pinned": "Headroom--pinned",
                            "unpinned": "Headroom--unpinned",
                            "top": "Headroom--top",
                            "notTop": "Headroom--not-top"
                        }
                    });
                    headroom.init();
                }
            }
        }
    }]);

    return MainNav;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//             Notification
// ================================

var Notification = function () {
    _createClass(Notification, null, [{
        key: "initializeExistingMessages",
        value: function initializeExistingMessages() {

            $("." + Notification.classes.container).find("." + Notification.classes.item).each(function (index, value) {
                new Notification({ message: $(this) });
            });
        }
    }]);

    function Notification(options) {
        _classCallCheck(this, Notification);

        if (options.log) {
            console.log(options.log);
        }

        if (options.message) {
            // Constructs a Notification object
            // using a pre-existing message element.
            this.message = options.message;
            this.message.removeClass("is-hidden");
            this.registerHide();
        } else if (options.status && options.content) {
            // Constructs a Notification object,
            // creating a new message element.
            this.message = $("<div class=\"" + Notification.classes.item + " Notification--" + options.status + "\">" + options.content + "<span class=\"Notification-dismiss Icon Icon-times\"></span></div>");
            this.show();
        } else {
            console.log("Invalid Arguments For New Notification");
            console.log(options);
        }
    }

    _createClass(Notification, [{
        key: "show",
        value: function show() {
            this.message.appendTo("." + Notification.classes.container);
            this.registerHide();
        }
    }, {
        key: "registerHide",
        value: function registerHide() {
            this.message.click(this.hide.bind(this));
            setTimeout(this.hide.bind(this), 20000);
        }
    }, {
        key: "hide",
        value: function hide() {
            this.message.addClass("is-sliding-up");
            setTimeout(this.remove.bind(this), 500);
        }
    }, {
        key: "remove",
        value: function remove() {
            this.message.remove();
        }
    }]);

    return Notification;
}();

Notification.classes = {
    container: "Notification-container",
    item: "Notification"
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//             Notification
// ================================

var Preferences = function () {
    function Preferences() {
        _classCallCheck(this, Preferences);
    }

    _createClass(Preferences, null, [{
        key: 'setPreferences',
        value: function setPreferences(preferences) {
            return Preferences.preferences = preferences;
        }
    }, {
        key: 'get',
        value: function get(key) {
            var fallback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            var o = Preferences.preferences;

            if (!(typeof o !== "undefined" && o !== null)) {
                return fallback;
            }

            var parts = key.split('.');
            var last = parts.pop();
            var l = parts.length;
            var i = 1;
            var current = parts[0];

            while ((o = o[current]) && i < l) {
                current = parts[i];
                i++;
            }

            if (o) {
                return o[last];
            } else {
                return fallback;
            }
        }
    }, {
        key: 'has',
        value: function has(key) {
            var o = Preferences.preferences;

            if (!o) {
                return false;
            }

            var parts = key.split('.');
            var last = parts.pop();
            var l = parts.length;
            var i = 1;
            var current = parts[0];

            while ((o = o[current]) && i < l) {
                current = parts[i];
                i++;
            }

            return o;
        }
    }]);

    return Preferences;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//            Slider
// ================================

var Slider = function () {
    _createClass(Slider, null, [{
        key: "findAll",
        value: function findAll(container) {
            return container.find(Slider.selectors.slider).each(function () {
                return Slider.list.push(new Slider($(this)));
            });
        }

        // -----------------
        //       Object
        // -----------------

    }]);

    function Slider(container) {
        _classCallCheck(this, Slider);

        this.container = container;
        this.list = this.container.find(Slider.selectors.list);
        this.items = this.container.find(Slider.selectors.item);

        this.total = this.items.length;
        this.interval = this.container.attr("data-interval") || 5000;

        this.previousId = 0;
        this.currentId = 0;
        this.nextId = 0;
        this.animating = false;
        this.animationTime = 1000;

        this.registerEvents();
        this.hideAll();
        this.next();

        if (this.container.attr("data-autoplay") === "true") {
            this.play();
        }
    }

    _createClass(Slider, [{
        key: "registerEvents",
        value: function registerEvents() {
            this.container.find(Slider.selectors.back).on("click", this.previous.bind(this));
            this.container.find(Slider.selectors.forward).on("click", this.next.bind(this));
        }
    }, {
        key: "play",
        value: function play() {
            var callback = this.container.attr("data-direction") === "reverse" ? this.previous.bind(this) : this.next.bind(this);
            this.timer = setInterval(callback, this.interval);
        }
    }, {
        key: "pause",
        value: function pause() {
            clearInterval(this.timer);
        }
    }, {
        key: "getItem",
        value: function getItem(id) {
            return this.list.children(":nth-child(" + id + ")");
        }
    }, {
        key: "hideAll",
        value: function hideAll() {
            this.items.removeClass();
            this.items.addClass(Slider.classes.item + " " + Slider.classes.isHidden);
        }
    }, {
        key: "next",
        value: function next() {
            if (!this.shouldAnimate()) {
                return false;
            }

            this.previousId = this.currentId;

            this.currentId += 1;
            if (this.currentId > this.total) {
                this.currentId = 1;
            }

            this.nextId = this.currentId + 1;
            if (this.nextId > this.total) {
                this.nextId = 1;
            }

            current = this.getItem(this.currentId);
            previous = this.getItem(this.previousId);

            this.hideAll();

            previous.removeClass(Slider.allClasses()).addClass(Slider.classes.slideOutLeft);

            current.removeClass(Slider.allClasses()).addClass(Slider.classes.slideInRight);
        }
    }, {
        key: "previous",
        value: function previous() {
            if (!this.shouldAnimate()) {
                return false;
            }

            this.nextId = this.currentId;

            this.currentId -= 1;
            if (this.currentId < 1) {
                this.currentId = this.total;
            }

            this.previousId = this.currentId - 1;
            if (this.nextId < 1) {
                this.nextId = this.total;
            }

            current = this.getItem(this.currentId);
            next = this.getItem(this.nextId);

            this.hideAll();

            next.removeClass(Slider.allClasses()).addClass(Slider.classes.slideOutRight);

            current.removeClass(Slider.allClasses()).addClass(Slider.classes.slideInLeft);
        }
    }, {
        key: "shouldAnimate",
        value: function shouldAnimate() {
            var _this = this;

            if (this.animating) {
                return false;
            }

            this.animating = true;
            setTimeout(function () {
                _this.animating = false;
            }, this.animationTime);

            return true;
        }
    }], [{
        key: "allClasses",
        value: function allClasses() {
            return Slider.classes.isHidden + " " + Slider.classes.slideInLeft + " " + Slider.classes.slideInRight + " " + Slider.classes.slideOutLeft + " " + Slider.classes.slideOutRight;
        }
    }]);

    return Slider;
}();

;

Slider.selectors = {
    slider: ".Slider",
    list: ".Slider-list",
    item: ".Slider-item",
    back: ".Slider-back",
    forward: ".Slider-forward"
};

Slider.classes = {
    item: "Slider-item",
    isCurrent: "Slider-item--current",
    isHidden: "Slider-item--hidden",
    slideInLeft: "Slider-item--slideInLeft",
    slideInRight: "Slider-item--slideInRight",
    slideOutLeft: "Slider-item--slideOutLeft",
    slideOutRight: "Slider-item--slideOutRight",
    isAfter: "Slider-item--after",
    noTransition: "Slider--noTransition"
};

Slider.list = [];
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SmoothState = function () {
    function SmoothState() {
        _classCallCheck(this, SmoothState);

        this.loading = false;
        this.smoothState = $("#page").smoothState({
            anchors: ".Link--smoothState",
            root: $(document),
            cacheLength: 0,
            forms: "null",
            onStart: {
                duration: 350,
                render: this.onStart
            },
            onProgress: {
                duration: 0,
                render: this.onProgress
            },
            onReady: {
                duration: 0,
                render: this.onReady
            },
            onAfter: this.onAfter
        }).data('smoothState');
    }

    _createClass(SmoothState, [{
        key: "onStart",
        value: function onStart(container) {
            var elements;
            $("html, body").animate({
                scrollTop: 0
            });
            this.loading = true;
            elements = $('.Block');
            $(elements.get().reverse()).each(function (index) {
                var block, timeout;
                block = $(this);
                timeout = index * 100;
                return setTimeout(function () {
                    return block.addClass('Block--isExiting');
                }, timeout);
            });
            return setTimeout(function () {
                if (this.loading) {
                    return $(".pace-activity").addClass("pace-activity-active");
                }
            }, elements.length * 100);
        }
    }, {
        key: "onProgress",
        value: function onProgress(container) {
            return $("html, body").css('cursor', 'wait').find('a').css('cursor', 'wait');
        }
    }, {
        key: "onReady",
        value: function onReady(container, content) {
            $("html, body").css('cursor', 'auto').find('a').css('cursor', 'auto');
            Oxygen.reset();
            container.hide();
            container.html(content);
            $(".pace-activity").removeClass("pace-activity-active");
            $('.Block').each(function (index) {
                var block, timeout;
                block = $(this);
                timeout = index * 100;
                block.addClass('Block--isHidden');
                return setTimeout(function () {
                    block.removeClass('Block--isHidden');
                    block.addClass('Block--isEntering');
                    return setTimeout(function () {
                        return block.removeClass('Block--isEntering');
                    }, 350);
                }, timeout);
            });
            return container.show();
        }
    }, {
        key: "onAfter",
        value: function onAfter(container, content) {
            this.loading = false;
            $(".pace-activity").removeClass("pace-activity-active");
            return Oxygen.init($("#page"));
        }
    }, {
        key: "load",
        value: function load(url, push) {
            return this.smoothState.load(url, push);
        }
    }], [{
        key: "setTheme",
        value: function setTheme(theme) {
            return $("#page").addClass('Page-transition--' + theme);
        }
    }]);

    return SmoothState;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//          ProgressBar
// ================================

var TabSwitcher = function () {
    _createClass(TabSwitcher, null, [{
        key: "findAll",
        value: function findAll(container) {
            return container.find("." + TabSwitcher.classes.tabs).each(function () {
                var tabs = $(this);
                if (tabs.hasClass(TabSwitcher.classes.content)) {
                    container = tabs;
                } else {
                    container = tabs.siblings("." + TabSwitcher.classes.content);
                }

                if (container.length === 0) {
                    container = tabs.parent().siblings("." + TabSwitcher.classes.content);
                }

                return TabSwitcher.list.push(new TabSwitcher(tabs, container));
            });
        }

        // -----------------
        //       Object
        // -----------------

    }]);

    function TabSwitcher(tabs, container) {
        _classCallCheck(this, TabSwitcher);

        this.handleClick = this.handleClick.bind(this);
        this.tabs = tabs;
        this.container = container;
        this.findDefault();
        this.registerEvents();
    }

    _createClass(TabSwitcher, [{
        key: "findDefault",
        value: function findDefault() {
            var tab = this.tabs.children("[data-default-tab]").attr("data-switch-to-tab");
            return this.setTo(tab);
        }
    }, {
        key: "registerEvents",
        value: function registerEvents() {
            return this.tabs.children("[data-switch-to-tab]").on("click", this.handleClick);
        }
    }, {
        key: "handleClick",
        value: function handleClick(event) {
            var tab = $(event.currentTarget).attr("data-switch-to-tab");
            return this.setTo(tab);
        }
    }, {
        key: "setTo",
        value: function setTo(tab) {
            this.current = tab;
            this.container.children("[data-tab]").removeClass(TabSwitcher.classes.active);
            this.container.children("[data-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active);
            this.tabs.children("[data-switch-to-tab]").removeClass(TabSwitcher.classes.active);
            return this.tabs.children("[data-switch-to-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active);
        }
    }]);

    return TabSwitcher;
}();

// -----------------
//       Static
// -----------------

TabSwitcher.classes = {
    tabs: "TabSwitcher-tabs",
    content: "TabSwitcher-content",
    active: "TabSwitcher--isActive"
};

TabSwitcher.list = [];
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//             Toggle
// ================================

var Toggle = function () {
    function Toggle(toggle, enableCallback, disableCallback) {
        _classCallCheck(this, Toggle);

        this.toggle = toggle;
        this.enableCallback = enableCallback;
        this.disableCallback = disableCallback;

        this.registerEvents();
    }

    _createClass(Toggle, [{
        key: "registerEvents",
        value: function registerEvents() {
            var _this = this;

            this.toggle.on("click", function (event) {
                return _this.handleToggle(event);
            });
            this.toggle.attr("data-enabled", "false");
        }
    }, {
        key: "handleToggle",
        value: function handleToggle(event) {
            if (this.toggle.attr("data-enabled") === "true") {
                this.toggle.attr("data-enabled", "false");
                this.disableCallback(event);
            } else {
                this.toggle.attr("data-enabled", "true");
                this.enableCallback(event);
            }
        }
    }]);

    return Toggle;
}();

Toggle.classes = {
    ifEnabled: "Toggle--ifEnabled",
    ifDisabled: "Toggle--ifDisabled"
};

// ================================
//        FullscreenToggle
// ================================

var FullscreenToggle = function (_Toggle) {
    _inherits(FullscreenToggle, _Toggle);

    function FullscreenToggle(toggle, fullscreenElement, enterFullscreenCallback, exitFullscreenCallback) {
        _classCallCheck(this, FullscreenToggle);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(FullscreenToggle).call(this, toggle, null, null));

        _this2.fullscreenElement = fullscreenElement;
        _this2.enableCallback = _this2.enterFullscreen;
        _this2.disableCallback = _this2.exitFullscreen;
        _this2.enterFullscreenCallback = enterFullscreenCallback;
        _this2.exitFullscreenCallback = exitFullscreenCallback;
        return _this2;
    }

    _createClass(FullscreenToggle, [{
        key: "enterFullscreen",
        value: function enterFullscreen() {
            this.fullscreenElement.addClass("FullscreenToggle--isFullscreen");
            $(document.body).addClass("Body--noScroll");

            var elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }

            this.enterFullscreenCallback();
        }
    }, {
        key: "exitFullscreen",
        value: function exitFullscreen() {
            this.fullscreenElement.removeClass("FullscreenToggle--isFullscreen");
            $(document.body).removeClass("Body--noScroll");

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }

            this.exitFullscreenCallback();
        }
    }]);

    return FullscreenToggle;
}(Toggle);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Upload = function () {
    function Upload() {
        _classCallCheck(this, Upload);
    }

    _createClass(Upload, null, [{
        key: "registerEvents",
        value: function registerEvents(container) {
            var elements;
            elements = container.find(Upload.selectors.uploadElement);
            elements.find(Upload.selectors.dropzoneElement).on("dragover", Upload.handleDragOver).on("dragleave", Upload.handleDragLeave).on("drop", Upload.handleDrop);
            return elements.find("input[type=file]").on("change", Upload.handleChange);
        }
    }, {
        key: "handleDragOver",
        value: function handleDragOver(event) {
            event.preventDefault();
            return $(event.currentTarget).addClass(Upload.states.onDragOver);
        }
    }, {
        key: "handleDragLeave",
        value: function handleDragLeave(event) {
            return $(event.currentTarget).removeClass(Upload.states.onDragOver);
        }
    }, {
        key: "handleDrop",
        value: function handleDrop(event) {
            var upload;
            event.preventDefault();
            $(event.currentTarget).removeClass(Upload.states.onDragOver);
            upload = $(event.currentTarget).closest(Upload.selectors.uploadElement);
            return Upload.addFiles(upload, event.originalEvent.dataTransfer.files);
        }
    }, {
        key: "handleChange",
        value: function handleChange(event) {
            return Upload.addFiles($(event.currentTarget).closest(Upload.selectors.uploadElement), event.currentTarget.files);
        }
    }, {
        key: "addFiles",
        value: function addFiles(upload, files) {
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

                    if (index > -1) {
                        input.filesToUpload.splice(index, 1);
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
        }
    }]);

    return Upload;
}();

;

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
"use strict";

window.Oxygen || (window.Oxygen = {});
Oxygen.reset = function () {
    window.editors = [];
    Oxygen.load = [];
    Ajax.errorCallbacks = [];
    Ajax.successCallbacks = [];
    return Dropdown.handleGlobalClick({ target: document.body });
};

Oxygen.init = function (container) {

    //
    // -------------------------
    //       FLASH MESSAGE
    // -------------------------
    //
    // This small delay helps to
    // reduce lag on page load.
    //

    setTimeout(Notification.initializeExistingMessages, 250);

    Dialog.registerEvents(container);

    //
    // -------------------------
    //       IMAGE EDITOR
    // -------------------------
    //
    // Initialises image editors for the page.
    //

    ImageEditor.initialize(container);

    //
    // -------------------------
    //           LOGIN
    // -------------------------
    //
    // Login form animations.
    //

    if ($(".Login-form").length > 0) {
        Oxygen.initLogin();
    }

    //
    // -------------------------
    //           OTHER
    // -------------------------
    //
    // Other event handlers.
    //

    Dropdown.registerEvents(container);
    EditableList.registerEvents(container);
    Form.findAll(container);
    Upload.registerEvents(container);
    TabSwitcher.findAll(container);
    Slider.findAll(container);

    //
    // -------------------------
    //       CODE EDITOR
    // -------------------------
    //
    // Initialises code editors for the page.
    //

    if (typeof editors !== "undefined" && editors !== null) {
        Editor.createEditors(editors);
    }

    var load = Oxygen.load || [];
    for (var i = 0, callback; i < load.length; i++) {
        callback = load[i];
        callback();
    }
};

$().ready(function () {
    MainNav.headroom();

    if (typeof user !== "undefined" && user !== null) {
        Preferences.setPreferences(user);
    }

    Oxygen.init($(document));

    if (Preferences.get('pageLoad.smoothState.enabled', true) === true) {
        window.smoothState = new SmoothState();
        SmoothState.setTheme(Preferences.get('pageLoad.smoothState.theme', 'slide'));
    }

    var progressThemes = Preferences.get('pageLoad.progress.theme', ["minimal", "spinner"]);
    for (var i = 0, theme; i < progressThemes.length; i++) {
        theme = progressThemes[i];
        $(document.body).addClass("Page-progress--" + theme);
    }

    Form.registerKeydownHandler();
    Dropdown.registerGlobalEvent();
});
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//          CodeViewInterface
// ================================

var CodeViewInterface = function () {
    function CodeViewInterface(editor) {
        _classCallCheck(this, CodeViewInterface);

        this.editor = editor;
        this.view = null;
    }

    _createClass(CodeViewInterface, [{
        key: "create",
        value: function create() {
            // edit the textarea
            var object = ace.edit(this.editor.name + "-ace-editor");

            // set user preferences
            object.getSession().setMode("ace/mode/" + this.editor.language);
            object.setTheme(Preferences.get('editor.ace.theme'));
            object.getSession().setUseWrapMode(Preferences.get('editor.ace.wordWrap'));
            object.setHighlightActiveLine(Preferences.get('user.editor.ace.highlightActiveLine'));
            object.setShowPrintMargin(Preferences.get('editor.ace.showPrintMargin'));
            object.setShowInvisibles(Preferences.get('editor.ace.showInvisibles'));
            object.setReadOnly(this.editor.readOnly);
            $("#" + this.editor.name + "-ace-editor").css("font-size", Preferences.get('editor.ace.fontSize'));

            // store object
            return this.view = object;
        }
    }, {
        key: "show",
        value: function show(full) {
            var _this = this;

            var editor = $("#" + this.editor.name + "-ace-editor");
            editor.removeClass(Editor.classes.state.isHidden);
            if (full) {
                return editor.css("width", "100%");
            }

            // after animation is completed
            setTimeout(function () {
                _this.resize();
            }, 300);
        }
    }, {
        key: "hide",
        value: function hide() {
            console.log("CodeViewInterface.hide");
            return $("#" + this.editor.name + "-ace-editor").addClass(Editor.classes.state.isHidden);
        }
    }, {
        key: "valueFromForm",
        value: function valueFromForm() {
            this.view.setValue(this.editor.textarea.val(), -1);
        }
    }, {
        key: "valueToForm",
        value: function valueToForm() {
            this.editor.textarea.val(this.view.getValue());
        }
    }, {
        key: "resize",
        value: function resize() {
            this.view.resize();
        }
    }]);

    return CodeViewInterface;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//          DesignViewInterface
//   ================================

var DesignViewInterface = function () {
    function DesignViewInterface(editor) {
        _classCallCheck(this, DesignViewInterface);

        this.editor = editor;
        this.view = null;
    }

    _createClass(DesignViewInterface, [{
        key: 'create',
        value: function create() {
            var config = Preferences.get('editor.ckeditor', {});
            config.customConfig = config.customConfig || '';
            config.contentsCss = this.editor.stylesheets;

            console.log(config);

            // create instance
            var object = CKEDITOR.replace(this.editor.name + "-editor", config);

            // store object
            return this.view = object;
        }
    }, {
        key: 'show',
        value: function show(full) {
            $("#cke_" + this.editor.name + "-editor").show();
            if (full) {
                $("#" + this.editor.name + "-ace-editor").css("width", "100%");
            }
            return;
        }
    }, {
        key: 'hide',
        value: function hide() {
            $("#cke_" + this.editor.name + "-editor").hide();
        }
    }, {
        key: 'valueFromForm',
        value: function valueFromForm() {
            return this.view.setData(this.editor.textarea.val());
        }
    }, {
        key: 'valueToForm',
        value: function valueToForm() {
            return $("textarea[name=\"" + this.editor.name + "\"]").val(this.view.getData());
        }
    }]);

    return DesignViewInterface;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//                 Editor
// ================================

var Editor = function () {
    _createClass(Editor, null, [{
        key: "createEditors",


        // only create if textarea exists
        value: function createEditors(editors) {
            for (var i = 0, editor; i < editors.length; i++) {
                editor = editors[i];
                var textarea = $("textarea[name=\"" + editor.name + "\"]");
                if (textarea.length) {
                    console.log("Editor found");
                    if (!(editor.mode != null)) {
                        editor.mode = user.editor.defaultMode;
                    }
                    console.log(editor);
                    var e = new Editor(editor.name, editor.language, editor.mode, editor.readOnly, editor.stylesheets);
                    Editor.list.push(e);
                } else {
                    console.log("Editor not found");
                    console.log(editor);
                }
            }
        }
    }]);

    function Editor(name, language, currentMode, readOnly) {
        var stylesheets = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

        _classCallCheck(this, Editor);

        this.enterFullscreen = this.enterFullscreen.bind(this);
        this.exitFullscreen = this.exitFullscreen.bind(this);
        this.handleSwitchEditor = this.handleSwitchEditor.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.name = name;
        this.language = language;
        this.currentMode = currentMode;
        this.readOnly = readOnly;
        this.stylesheets = stylesheets;
        this.modes = {};
        this.textarea = $("textarea[name=\"" + this.name + "\"]");
        this.container = this.textarea.parents("." + Editor.classes.editor.container);
        var toggle = this.container.find("." + Editor.classes.button.fullscreenToggle);
        this.fullscreenToggle = new FullscreenToggle(toggle, this.container, this.enterFullscreen, this.exitFullscreen);

        this.show();
        this.resizeToContent();
        this.registerEvents();
    }

    _createClass(Editor, [{
        key: "getMode",
        value: function getMode(mode) {
            if (!(typeof mode !== "undefined" && mode !== null)) {
                return this.currentMode;
            } else {
                return mode;
            }
        }
    }, {
        key: "registerEvents",
        value: function registerEvents() {
            var _this = this;

            // switch editor button
            this.container.find("." + Editor.classes.button.switchEditor).on("click", this.handleSwitchEditor);

            // ask the form to tell us when its data is being read,
            // so we can flush changes to the underlying <input>/<textarea> element
            var form = $(this.container).parents("form")[0];
            if (form !== undefined && form.formObject) {
                form.formObject.contentGenerators.push(function (form) {
                    return _this.valueToForm();
                });
            }
        }
    }, {
        key: "create",
        value: function create(m) {
            var mode = this.getMode(m);
            switch (mode) {
                case "code":
                    this.modes.code = new CodeViewInterface(this);
                    break;
                case "design":
                    this.modes.design = new DesignViewInterface(this);
                    break;
                case "preview":
                    this.modes.preview = new PreviewInterface(this);
                    break;
                case "split":
                    this.modes.split = new SplitViewInterface(this);
                    break;
            }
            this.modes[mode].create();
        }
    }, {
        key: "show",
        value: function show(m) {
            var full = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            var mode = this.getMode(m);
            if (!(this.modes[mode] != null)) {
                this.create(mode);
            }
            this.modes[mode].show(full);
            this.currentMode = mode;
            this.valueFromForm(mode);
        }
    }, {
        key: "hide",
        value: function hide(m) {
            var mode = this.getMode(m);
            this.modes[mode].hide();
            this.valueToForm(mode);
        }
    }, {
        key: "valueFromForm",
        value: function valueFromForm(m) {
            var mode = this.getMode(m);
            this.modes[mode].valueFromForm();
        }
    }, {
        key: "valueToForm",
        value: function valueToForm(m) {
            var mode = this.getMode(m);
            this.modes[mode].valueToForm();
        }
    }, {
        key: "resizeToContainer",
        value: function resizeToContainer() {
            // resize ace
            if (this.modes.code) {
                this.modes.code.resize();
            }
        }
    }, {
        key: "resizeToContent",
        value: function resizeToContent() {
            // size to content
            this.container.find("." + Editor.classes.editor.content).css("height", this.textarea.attr("rows") * 1.5 + "em");

            // resize ace
            if (this.modes.code) {
                this.modes.code.resize();
            }
        }

        // enter fullscreen

    }, {
        key: "enterFullscreen",
        value: function enterFullscreen() {
            console.log("fullscreen");
            this.resizeToContainer();
        }

        // exit fullscreen

    }, {
        key: "exitFullscreen",
        value: function exitFullscreen() {
            console.log("exit");
            console.trace();
            this.resizeToContent();
        }
    }, {
        key: "handleSwitchEditor",
        value: function handleSwitchEditor(event) {
            console.log("Editor.handleSwitchEditor");
            var editorToSwitch = $(event.target).attr("data-editor");
            this.hide();
            return this.show(editorToSwitch);
        }
    }, {
        key: "handleFormSubmit",
        value: function handleFormSubmit() {
            return this.valueToForm();
        }
    }]);

    return Editor;
}();

Editor.list = [];
Editor.classes = {
    editor: {
        container: "Editor",
        header: "Editor-header",
        content: "Editor-content",
        footer: "Editor-footer",
        preview: "Editor-preview"
    },
    state: {
        isHidden: "Editor--hidden",
        contentIsSplit: "Editor-content--isSplit"
    },
    button: {
        switchEditor: "Editor--switchEditor",
        fullscreenToggle: "Editor--toggleFullscreen"
    }
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//          PreviewInterface
// ================================

var PreviewInterface = function () {
    function PreviewInterface(editor) {
        _classCallCheck(this, PreviewInterface);

        this.editor = editor;
        this.view = null;
    }

    _createClass(PreviewInterface, [{
        key: "create",
        value: function create() {
            var preview = $("<iframe id=\"" + this.editor.name + "-preview\" class=\"" + Editor.classes.editor.preview + "\"></iframe>");
            preview.appendTo(this.editor.container.find(".Editor-content"));
            return this.view = preview;
        }
    }, {
        key: "show",
        value: function show(full) {
            var preview = $("#" + this.editor.name + "-preview");
            preview.removeClass(Editor.classes.state.isHidden);

            if (full) {
                preview.css("width", "100%");
            }

            // create the stylesheets
            var head = "";
            var iterable = this.editor.stylesheets;
            for (var i = 0, stylesheet; i < iterable.length; i++) {
                stylesheet = iterable[i];
                head += "<link rel=\"stylesheet\" href=\"" + stylesheet + "\">";
            }
            this.view.contents().find("head").html(head);
            return this.view.contents().find("html").addClass("no-js " + $("html").attr("class").replace("js ", ""));
        }
    }, {
        key: "hide",
        value: function hide() {
            return $("#" + this.editor.name + "-preview").addClass(Editor.classes.state.isHidden);
        }
    }, {
        key: "valueFromForm",
        value: function valueFromForm() {
            return this.view.contents().find("body").html(this.editor.textarea.val());
        }

        // we can't and don't want to do this

    }, {
        key: "valueToForm",
        value: function valueToForm() {}
    }]);

    return PreviewInterface;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================
//     SplitViewInterface
// ==========================

var SplitViewInterface = function () {
    function SplitViewInterface(editor) {
        _classCallCheck(this, SplitViewInterface);

        this.editor = editor;
        this.view = null;
    }

    _createClass(SplitViewInterface, [{
        key: "create",
        value: function create() {}
    }, {
        key: "show",
        value: function show() {
            this.editor.container.find("." + Editor.classes.editor.content).addClass(Editor.classes.state.contentIsSplit);
            this.editor.show("code", false);
            this.editor.show("preview", false);
            $("#" + this.editor.name + "-ace-editor, #" + this.editor.name + "-preview").css("width", "50%");
            return this.editor.modes.code.view.on("change", this.synchronize.bind(this));
        }
    }, {
        key: "hide",
        value: function hide() {
            this.editor.container.find("." + Editor.classes.editor.content).removeClass(Editor.classes.state.contentIsSplit);
            this.editor.hide("code");
            return this.editor.hide("preview");
        }
    }, {
        key: "valueFromForm",
        value: function valueFromForm() {}
    }, {
        key: "valueToForm",
        value: function valueToForm() {}
    }, {
        key: "onChange",
        value: function onChange() {
            return this.hasChanged = true;
        }
    }, {
        key: "synchronize",
        value: function synchronize() {
            if (this.editor.currentMode === "split") {
                console.log("SplitViewInterface.synchronize");
                this.editor.valueToForm("code");
                this.editor.valueFromForm("preview");
                return this.hasChanged = false;
            }
        }
    }]);

    return SplitViewInterface;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================
//             ImageEditor
// ================================

var ImageEditor = function () {

    // -----------------
    //      Object
    // -----------------

    function ImageEditor(container) {
        _classCallCheck(this, ImageEditor);

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
        if (!this.image.length) {
            throw new Error("<img> element doesn't exist");
        }

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
        this.image[0].onload = function () {
            console.log('Image Loaded');
            if (!(that.imageDimensions != null)) {
                that.imageDimensions = { cropX: 0, cropY: 0 };
            }
            that.imageDimensions.width = this.clientWidth;
            that.imageDimensions.height = this.clientHeight;
            that.imageDimensions.naturalWidth = this.naturalWidth;
            that.imageDimensions.naturalHeight = this.naturalHeight;
            that.imageDimensions.ratio = this.naturalWidth / this.naturalHeight;
            that.fields.resize.width.val(that.imageDimensions.naturalWidth);
            that.fields.resize.height.val(that.imageDimensions.naturalHeight);
            return that.handleCropEnable();
        };

        this.fullscreenToggle = new FullscreenToggle(this.container.find("." + ImageEditor.classes.button.toggleFullscreen), this.container, function () {}, function () {});

        this.container.find("." + ImageEditor.classes.button.apply).on("click", this.handlePreview);
        this.container.find("." + ImageEditor.classes.button.save).on("click", this.handleSave);
        this.container.find("." + ImageEditor.classes.form.crop).on("change", this.handleCropInputChange);
        this.container.find("." + ImageEditor.classes.form.resize).on("change", this.handleResizeInputChange);

        this.jCropApi = null;
        this.cropDisableCounter = 2;
    }

    _createClass(ImageEditor, [{
        key: "handlePreview",
        value: function handlePreview() {
            this.applyChanges(this.gatherData());

            return this.progressNotification = new Notification({
                content: "Processing Image",
                status: "success"
            });
        }
    }, {
        key: "handleSave",
        value: function handleSave() {
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
    }, {
        key: "gatherData",
        value: function gatherData() {
            var mode = TabSwitcher.list[0].current;
            switch (mode) {
                case "simple":
                    return this.getSimpleData();
                case "advanced":
                    return this.getAdvancedData();
                default:
                    return {};
            }
        }
    }, {
        key: "getSimpleData",
        value: function getSimpleData() {
            return this.removeDefaultFields(Form.getFormData(this.forms.simple));
        }
    }, {
        key: "removeDefaultFields",
        value: function removeDefaultFields(formData) {
            var _this = this;

            var resize = function resize(formData) {
                return (!formData["resize[width]"] || formData["resize[width]"] === _this.imageDimensions.naturalWidth.toString()) && (!formData["resize[height]"] || formData["resize[height]"] === _this.imageDimensions.naturalHeight.toString());
            };

            var defaults = {
                "fit[position]": function fitPosition(item) {
                    return item === "center";
                },
                "resize[width]": function resizeWidth(item, formData) {
                    return resize(formData);
                },
                "resize[height]": function resizeHeight(item, formData) {
                    return resize(formData);
                },
                "resize[keepAspectRatio]": function resizeKeepAspectRatio(item, formData) {
                    return resize(formData);
                },
                "gamma": function gamma(item) {
                    return item === "1";
                },
                "greyscale": function greyscale(item) {
                    return item === "false";
                },
                "invert": function invert(item) {
                    return item === "false";
                },
                "rotate[backgroundColor]": function rotateBackgroundColor(item) {
                    return item === "#ffffff";
                },
                "crop[x]": function cropX(item) {
                    return _this.imageDimensions.cropX = item === "" ? 0 : parseInt(item);
                },
                "crop[y]": function cropY(item) {
                    return _this.imageDimensions.cropY = item === "" ? 0 : parseInt(item);
                }
            };

            for (var key in formData) {
                var item = formData[key];
                if (defaults[key] && defaults[key](item, formData)) {
                    delete formData[key];
                } else if (item === "0" || item === "") {
                    delete formData[key];
                }
            }

            return formData;
        }
    }, {
        key: "getAdvancedData",
        value: function getAdvancedData() {
            return JSON.parse(this.fields.macro.val());
        }

        // --------------------------------------------
        //                     REQUEST
        // --------------------------------------------

    }, {
        key: "applyChanges",
        value: function applyChanges(data) {
            var _this2 = this;

            if (this.applyingChanges) {
                new Notification({
                    content: "Already Processing",
                    status: "failed"
                });
                return;
            }

            $.ajax({
                type: "GET",
                url: this.image.attr("data-root"),
                data: data,
                contentType: false,
                success: this.onRequestEnd,
                error: function error() {
                    _this2.progressNotification.hide();
                    return Ajax.handleError();
                },
                xhr: function xhr() {
                    var object = window.ActiveXObject ? new ActiveXObject("XMLHttp") : new XMLHttpRequest();
                    object.overrideMimeType("text/plain; charset=x-user-defined");
                    return object;
                }
            });
            return this.applyingChanges = true;
        }
    }, {
        key: "onRequestEnd",
        value: function onRequestEnd(response, status, request) {
            this.applyingChanges = false;
            this.progressNotification.hide();
            if (this.jCropApi != null) {
                this.jCropApi.destroy();
            }
            this.jCropApi = null;
            this.forms.simple.attr("data-changed", false);
            this.forms.advanced.attr("data-changed", false);

            return this.image[0].src = "data:image/jpeg;base64," + base64Encode(response);
        }

        // --------------------------------------------
        //                     CROP
        // --------------------------------------------

    }, {
        key: "handleCropEnable",
        value: function handleCropEnable() {
            if (this.jCropApi != null) {
                return this.jCropApi.enable();
            } else {
                var that = this;
                return this.image.Jcrop({
                    onChange: this.handleCropSelect,
                    onSelect: this.handleCropSelect,
                    onRelease: this.handleCropRelease
                }, function () {
                    return that.jCropApi = this;
                });
            }
        }
    }, {
        key: "handleCropDisable",
        value: function handleCropDisable() {
            return this.jCropApi.disable();
        }
    }, {
        key: "handleCropSelect",
        value: function handleCropSelect(c) {
            if (this.cropDisableCounter > 1) {
                this.fields.crop.x.val(Math.round(c.x / this.imageDimensions.width * this.imageDimensions.naturalWidth + this.imageDimensions.cropX));
                this.fields.crop.y.val(Math.round(c.y / this.imageDimensions.height * this.imageDimensions.naturalHeight + this.imageDimensions.cropY));
                this.fields.crop.width.val(Math.round(c.w / this.imageDimensions.width * this.imageDimensions.naturalWidth));
                return this.fields.crop.height.val(Math.round(c.h / this.imageDimensions.height * this.imageDimensions.naturalHeight));
            } else {
                return this.cropDisableCounter++;
            }
        }
    }, {
        key: "handleCropInputChange",
        value: function handleCropInputChange() {
            if (!(this.jCropApi != null)) {
                return;
            }
            var x = this.fields.crop.x.val() / this.imageDimensions.naturalWidth * this.imageDimensions.width - this.imageDimensions.cropX;
            var y = this.fields.crop.y.val() / this.imageDimensions.naturalHeight * this.imageDimensions.height - this.imageDimensions.cropY;
            this.cropDisableCounter = 0;
            return this.jCropApi.setSelect([x, y, x + this.fields.crop.width.val() / this.imageDimensions.naturalWidth * this.imageDimensions.width, y + this.fields.crop.height.val() / this.imageDimensions.naturalHeight * this.imageDimensions.height]);
        }
    }, {
        key: "handleCropRelease",
        value: function handleCropRelease() {
            this.fields.crop.x.val(0);
            this.fields.crop.y.val(0);
            this.fields.crop.width.val(0);
            return this.fields.crop.height.val(0);
        }
    }, {
        key: "handleResizeInputChange",
        value: function handleResizeInputChange(e) {
            if (this.fields.resize.keepAspectRatio[0].checked) {
                var name = e.target.name;
                var value = $(e.target).val();
                console.log(name, value);
                if (name === 'resize[width]') {
                    return this.fields.resize.height.val(Math.round(value / this.imageDimensions.ratio));
                } else {
                    return this.fields.resize.width.val(Math.round(value * this.imageDimensions.ratio));
                }
            }
        }
    }], [{
        key: "initialize",
        value: function initialize(container) {
            return container.find("." + ImageEditor.classes.layout.container).each(function () {
                return ImageEditor.list.push(new ImageEditor($(this)));
            });
        }
    }]);

    return ImageEditor;
}();

;

var base64Encode = function base64Encode(inputStr) {
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
        var enc2 = (byte1 & 3) << 4 | byte2 >> 4;
        var enc3 = undefined;
        var enc4 = undefined;
        if (isNaN(byte2)) {
            enc3 = enc4 = 64;
        } else {
            enc3 = (byte2 & 15) << 2 | byte3 >> 6;
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
"use strict";

Oxygen || (Oxygen = {});
Oxygen.initLogin = function () {
    var loginForm = $(".Login-form").addClass("Login--noTransition").addClass("Login--slideDown");

    loginForm[0].offsetHeight;
    loginForm.removeClass("Login--noTransition");

    setTimeout(function () {
        $("body").removeClass("Login--isHidden");
    }, 500);

    $(".Login-scrollDown").on("click", function () {
        $(".Login-message").addClass("Login--slideUp");
        loginForm.removeClass("Login--slideDown");
        $(".Login-background--blur").addClass("Login--isHidden");
    });

    loginForm.on("submit", function () {
        loginForm.addClass("Login--slideUp");
    });

    Ajax.errorCallbacks.push(function (error) {
        loginForm.removeClass("Login--slideUp");
        return error;
    });

    Ajax.successCallbacks.push(function (data) {
        if (data.status == "failed") {
            loginForm.removeClass("Login--slideUp");
        }
        return data;
    });
};