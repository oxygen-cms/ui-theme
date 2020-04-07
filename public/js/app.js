"use strict";

/**
 * Get closest DOM element up the tree matches the selector
 * @param  {Node} elem The base element
 * @param  {String} selector The selector to look for
 * @return {Node} Null if no match
 */
var parentMatchingSelector = function parentMatchingSelector(elem, selector) {
  // Get closest match
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matchesSelector(selector)) {
      return elem;
    }
  }

  return null;
};

var parentOrSelfMatchingSelector = function parentOrSelfMatchingSelector(elem, selector) {
  if (elem.matchesSelector(selector)) {
    return elem;
  } // Get closest match


  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matchesSelector(selector)) {
      return elem;
    }
  }

  return null;
};

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

var matchesMethod = function () {
  var ElemProto = Element.prototype; // check for the standard method name first

  if (ElemProto.matches) {
    return 'matches';
  } // check un-prefixed


  if (ElemProto.matchesSelector) {
    return 'matchesSelector';
  } // check vendor prefixes


  var prefixes = ['webkit', 'moz', 'ms', 'o'];

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var method = prefix + 'MatchesSelector';

    if (ElemProto[method]) {
      return method;
    }
  }
}();

Element.prototype.matchesSelector = function (selector) {
  return this[matchesMethod](selector);
};
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//            AjaxRequest
// ================================
var Dialog = /*#__PURE__*/function () {
  function Dialog() {
    _classCallCheck(this, Dialog);
  }

  _createClass(Dialog, null, [{
    key: "registerEvents",
    value: function registerEvents(container) {
      var _iterator = _createForOfIteratorHelper(container.querySelectorAll("[data-dialog-type=\"confirm\"]")),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          item.addEventListener("click", Dialog.handleConfirmClick);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var _iterator2 = _createForOfIteratorHelper(container.querySelectorAll("[data-dialog-type=\"alert\"]")),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _item = _step2.value;

          _item.addEventListener("click", Dialog.handleAlertClick);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "handleAlertClick",
    value: function handleAlertClick(event) {
      vex.dialog.alert(event.currentTarget.getAttribute("data-dialog-message"));
    }
  }, {
    key: "handleConfirmClick",
    value: function handleConfirmClick(event, customConfig) {
      var target = event.currentTarget;

      if (!(target.getAttribute("data-dialog-disabled") === "true")) {
        var defaultConfig;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        defaultConfig = {
          message: target.getAttribute("data-dialog-message"),
          callback: function callback(value) {
            if (value) {
              target.setAttribute("data-dialog-disabled", "true");
              target.click();
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

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//             Dropdown
// ================================
var Dropdown = /*#__PURE__*/function () {
  function Dropdown() {
    _classCallCheck(this, Dropdown);
  }

  _createClass(Dropdown, null, [{
    key: "registerGlobalEvent",
    value: function registerGlobalEvent() {
      return document.addEventListener("click", Dropdown.handleGlobalClick);
    }
  }, {
    key: "registerEvents",
    value: function registerEvents(container) {
      var _iterator = _createForOfIteratorHelper(container.querySelectorAll("." + Dropdown.classes.dropdownToggle)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          item.addEventListener("click", Dropdown.handleClick);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      var c = event.target;

      while (!c.classList.contains(Dropdown.classes.dropdownToggle)) {
        if (c.matchesSelector("a[href], form")) {
          return;
        }

        c = c.parentNode;
      }

      var dropdown = c.querySelector("." + Dropdown.classes.dropdownList);

      if (dropdown.classList.contains(Dropdown.classes.isActive)) {
        dropdown.classList.remove(Dropdown.classes.isActive);
      } else {
        Dropdown.reset();
        dropdown.classList.add(Dropdown.classes.isActive);
      }
    }
  }, {
    key: "handleGlobalClick",
    value: function handleGlobalClick(event) {
      if (parentMatchingSelector(event.target, "." + Dropdown.classes.dropdownToggle) == null) {
        Dropdown.reset();
      }
    }
  }, {
    key: "reset",
    value: function reset(event) {
      var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll("." + Dropdown.classes.dropdownList)),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          item.classList.remove(Dropdown.classes.isActive);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
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

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//              Form
// ================================
var EditableList = /*#__PURE__*/function () {
  function EditableList() {
    _classCallCheck(this, EditableList);
  }

  _createClass(EditableList, null, [{
    key: "registerEvents",
    value: function registerEvents(container) {
      var _iterator = _createForOfIteratorHelper(container.getElementsByClassName(EditableList.classes.add)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          item.addEventListener("click", EditableList.handleAdd);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      container.addEventListener("click", EditableList.handleRemove);
    }
  }, {
    key: "handleAdd",
    value: function handleAdd(event) {
      var container = event.currentTarget.parentNode.querySelector("." + EditableList.classes.container);
      var template = container.querySelector("." + EditableList.classes.template);
      var template2 = template.cloneNode(true);
      template2.classList.remove(EditableList.classes.template);
      container.appendChild(template2);
    }
  }, {
    key: "handleRemove",
    value: function handleRemove(event) {
      var item = parentOrSelfMatchingSelector(event.target, "." + EditableList.classes.remove);

      if (item) {
        var row = parentMatchingSelector(event.target, "." + EditableList.classes.row);

        if (row.parentNode) {
          row.parentNode.removeChild(row);
          console.log('removed node');
        }
      }
    }
  }]);

  return EditableList;
}();

EditableList.classes = {
  container: "EditableList",
  template: "EditableList-template",
  row: "EditableList-row",
  remove: "EditableList-remove",
  add: "EditableList-add"
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//            AjaxRequest
// ================================
window.Oxygen || (window.Oxygen = {});

var FetchOptions = /*#__PURE__*/function () {
  function FetchOptions() {
    _classCallCheck(this, FetchOptions);

    this.headers = new Headers();
  }

  _createClass(FetchOptions, [{
    key: "wantJson",
    value: function wantJson() {
      this.headers.set("Accept", "application/json");
      return this;
    }
  }, {
    key: "contentType",
    value: function contentType(type) {
      this.headers.set("Content-Type", type);
      return this;
    }
  }, {
    key: "method",
    value: function method(_method) {
      this.method = _method;
      return this;
    }
  }, {
    key: "body",
    value: function body(_body) {
      this.body = _body;
      return this;
    }
  }, {
    key: "cookies",
    value: function cookies() {
      this.credentials = "same-origin";
      return this;
    }
  }], [{
    key: "default",
    value: function _default() {
      return new FetchOptions().cookies();
    }
  }]);

  return FetchOptions;
}();

Oxygen.respond = {};

Oxygen.respond.text = function (response) {
  return response.text();
};

Oxygen.respond.json = function (response) {
  return response.json();
};

Oxygen.respond.checkStatus = function (response) {
  if (response.ok) {
    return response;
  } else {
    var error = new Error();
    error.response = response;
    throw error;
    /*.catch(error => {
        response.text().then(text => {
            Oxygen.error.jsonParseError(error, text);
        });
        throw error;
    })*/
  }
};

Oxygen.respond.notification = function (data) {
  if (Notification.isNotification(data)) {
    NotificationCenter.present(new Notification(data));
  }

  return data;
};

Oxygen.respond.redirect = function (data) {
  if (data.redirect) {
    if (window.smoothState && !(data.hardRedirect === true)) {
      window.smoothState.load(data.redirect, false);
    } else {
      window.location.replace(data.redirect);
    }
  }

  return data;
}; // handle network errors
// if(error.response.readyState === 0) {
//     console.error(response);
// }
// Oxygen.error.jsonParseError = function(error, text) {
//     console.error("Error while parsing JSON: ", error);
//     console.log("Raw response: ", text);
//
//     new Notification({
//         content: "Could not parse JSON response. This is a bug.",
//         status: "failed"
//     });
// };


Oxygen.respond.handleAPIError = function (error) {
  if (error.response && error.response instanceof Response) {
    error.response.json().then(Oxygen.handleAPIError)["catch"](function (err) {
      console.error("Error response did not contain valid JSON: ", err);
      NotificationCenter.present(new Notification({
        content: "Whoops, looks like something went wrong.",
        status: "bug"
      }));
    });
  } else {
    throw error;
  }
};

Oxygen.handleAPIError = function (content) {
  console.error(content);

  if (Notification.isNotification(content)) {
    NotificationCenter.present(new Notification(content));
  } else if (content.error) {
    NotificationCenter.present(new Notification({
      content: "PHP Exception of type <code class=\"no-wrap\">" + content.error.type + "</code> with message <code class=\"no-wrap\">" + content.error.message + "</code> thrown at <code class=\"no-wrap\">" + content.error.file + ":" + content.error.line + "</code>",
      status: "bug"
    }));
  } else {
    console.log("JSON error response unhandled: ", content);
    NotificationCenter.present(new Notification({
      content: "Whoops, looks like something went wrong.",
      status: "bug"
    }));
  }
};
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//              Form
// ================================
//
// The Form helper can:
// - display a message upon exit if there are any unsaved changes.
// - send an async request with the form data on submit or change
var Form = /*#__PURE__*/function () {
  _createClass(Form, null, [{
    key: "findAll",
    value: function findAll(container) {
      var _iterator = _createForOfIteratorHelper(container.querySelectorAll("form")),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          item.formObject = new Form(item);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      $(container).find(Form.classes.taggableInput).tagging({
        "edit-on-delete": false
      });
    }
  }, {
    key: "registerKeydownHandler",
    value: function registerKeydownHandler() {
      return document.addEventListener("keydown", Form.handleKeydown);
    }
  }, {
    key: "handleKeydown",
    value: function handleKeydown(event) {
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
    this.originalData = getFormData(this.form); //# content generators are notified before the form content is read

    this.contentGenerators = [];
    this.registerEvents();
  }

  _createClass(Form, [{
    key: "registerEvents",
    value: function registerEvents() {
      var _this = this;

      // Exit Dialog
      if (this.form.classList.contains(Form.classes.warnBeforeExit)) {
        var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll("a, button[type=\"submit\"]")),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;
            item.addEventListener("click", function (event) {
              return _this.handleExit(event);
            }); // displays exit dialog
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      } // Submit asynchronously


      this.form.addEventListener("submit", function (event) {
        return _this.handleSubmit(event);
      });

      if (this.form.classList.contains(Form.classes.submitAsyncOnChange)) {
        this.form.addEventListener("change", function (event) {
          event.preventDefault();

          _this.submitAsync();
        });
      } // Auto Submit


      if (this.form.classList.contains(Form.classes.autoSubmit)) {
        return this.submit();
      }
    }
  }, {
    key: "handleExit",
    value: function handleExit(event) {
      var _this2 = this;

      if (event.currentTarget.classList.contains("Form-submit")) {
        return;
      }

      if (!document.body.contains(this.form)) {
        return;
      }

      this.generateContent();
      var original = this.originalData;
      var current = getFormData(this.form);
      console.log("original form data:", original);
      console.log("current form data:", current);

      if (!compareByValue(original, current)) {
        console.log("=> form data differs");
        var target = event.currentTarget;

        if (!(target.getAttribute("data-dialog-disabled") === "true")) {
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
            }, $.extend({}, vex.dialog.buttons.NO, {
              text: 'Cancel'
            }), {
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
                target.setAttribute("data-dialog-disabled", "true");
                return target.click();
              } else if (value == "save") {
                if (_this2.form.classList.contains(Form.classes.submitAsync)) {
                  _this2.submitAsync(true);

                  target.setAttribute("data-dialog-disabled", "true");
                  target.click();
                } else {
                  // not sure if this works
                  _this2.submit(); //target.attr("data-dialog-disabled", "true");
                  //target.click();

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
      var _iterator3 = _createForOfIteratorHelper(this.contentGenerators),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var generator = _step3.value;
          generator(this);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(event) {
      this.generateContent();

      if (this.form.classList.contains(Form.classes.submitAsync) && !Form.disableAsync) {
        event.preventDefault();
        this.submitAsync();
      }
    }
  }, {
    key: "submitAsync",
    value: function submitAsync(ignoreRedirectResponse) {
      var _this3 = this;

      var saveData = function saveData(data) {
        if (data.status === 'success') {
          _this3.originalData = getFormData(_this3.form);
          console.log('Form Saved Successfully');
        }

        return data;
      };

      var data = getFormData(this.form);
      console.log("Submitting Form with Data: ", data);
      var promise = window.fetch(this.form.action, FetchOptions["default"]().method(this.form.method).body(getFormDataObject(data)).wantJson()).then(Oxygen.respond.checkStatus).then(Oxygen.respond.json).then(saveData);
      var modifyPromise = this.form.modifyPromise;

      if (modifyPromise === undefined) {
        modifyPromise = function modifyPromise(promise) {
          return promise;
        };
      }

      promise = promise.then(Oxygen.respond.notification);

      if (!ignoreRedirectResponse) {
        promise = promise.then(Oxygen.respond.redirect);
      }

      promise = modifyPromise(promise);
      promise = promise["catch"](Oxygen.respond.handleAPIError);
      return promise;
    }
  }]);

  return Form;
}();

function getFormData(form) {
  var data = {};

  var _iterator4 = _createForOfIteratorHelper(form.querySelectorAll("[name]")),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var item = _step4.value;

      if (item.type == "checkbox" || item.type == "radio") {
        if (!item.checked) {
          continue;
        }
      }

      if (item.name == undefined) {
        console.dir(item);
      }

      if (item.type == "select-multiple") {
        data[item.name] = [];

        var _iterator5 = _createForOfIteratorHelper(item.options),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var option = _step5.value;

            if (option.selected) {
              data[item.name].push(option.value);
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      } else if (item.type == "file") {
        var ref;
        var files = (ref = item.filesToUpload) != null ? ref : item.files;
        data[item.name] = [];

        for (var i = 0, file; i < files.length; i++) {
          file = files[i];
          data[item.name].push(file);
        }
      } else if (item.name.endsWith("[]")) {
        if (typeof data[item.name] == 'undefined' || data[item.name] === null) {
          data[item.name] = [];
        }

        data[item.name].push(item.value);
      } else {
        data[item.name] = item.value;
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  return data;
}

function getFormDataObject(data) {
  var formData = new FormData();

  for (var key in data) {
    if (data[key] instanceof Array) {
      var _iterator6 = _createForOfIteratorHelper(data[key]),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var value = _step6.value;
          formData.append(key, value);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    } else {
      formData.append(key, data[key]);
    }
  }

  return formData;
} /// The `===` operator or `Object.is` doesn't cut it.
/// https://gist.github.com/nicbell/6081098


function compareByValue(obj1, obj2) {
  //Loop through properties in object 1
  for (var p in obj1) {
    //Check property exists on both objects
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
      return false;
    }

    switch (_typeof(obj1[p])) {
      //Deep compare objects
      case 'object':
        if (!compareByValue(obj1[p], obj2[p])) {
          return false;
        }

        break;
      //Compare function code

      case 'function':
        if (typeof obj2[p] == 'undefined' || p != 'compare' && obj1[p].toString() != obj2[p].toString()) {
          return false;
        }

        break;
      //Compare values

      default:
        if (obj1[p] != obj2[p]) {
          return false;
        }

    }
  } //Check object 2 for any extra properties


  for (var p in obj2) {
    if (obj2.hasOwnProperty(p)) {
      if (typeof obj1[p] == 'undefined') {
        return false;
      }
    }
  }

  return true;
}

;
Form.disableAsync = false;
/**
 * Toggles whether asynchronous form submission is enabled globally, using Alt + Command/Control + J
 */

document.addEventListener("keydown", function (event) {
  if (event.altKey && (event.controlKey || event.metaKey) && event.which == 74) {
    Form.disableAsync = !Form.disableAsync;
    event.preventDefault();
    NotificationCenter.present(new Notification({
      content: "Asynchronous form submission " + (Form.disableAsync ? "disabled" : "enabled"),
      status: "info"
    }));
  }
});
Form.messages = {
  confirmation: "Do you want to save changes?"
};
Form.classes = {
  warnBeforeExit: "Form--warnBeforeExit",
  submitOnKeydown: "Form--submitOnKeydown",
  submitAsync: "Form--sendAjax",
  submitAsyncOnChange: "Form--sendAjaxOnChange",
  autoSubmit: "Form--autoSubmit",
  taggableInput: ".Form-taggable"
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//             MainNav
// ================================
var MainNav = /*#__PURE__*/function () {
  function MainNav() {
    _classCallCheck(this, MainNav);
  }

  _createClass(MainNav, null, [{
    key: "headroom",
    value: function headroom() {
      var header = document.querySelector(".MainNav");

      if (header && window.innerWidth > 768) {
        var headroom = new Headroom(header, {
          "tolerance": 20,
          "offset": 50,
          "classes": {
            "initial": "Headroom",
            "pinned": "Headroom--pinned",
            "unpinned": "Headroom--unpinned",
            "top": "Headroom--top",
            "notTop": "Headroom--not-top"
          }
        });
        headroom.init();
      }
    }
  }]);

  return MainNav;
}();
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//             Notification
// ================================
var NotificationCenter = /*#__PURE__*/function () {
  function NotificationCenter() {
    _classCallCheck(this, NotificationCenter);
  }

  _createClass(NotificationCenter, null, [{
    key: "initializeExistingMessages",
    value: function initializeExistingMessages() {
      var notifications = document.querySelector("." + Notification.classes.container).querySelectorAll("." + Notification.classes.item);

      var _iterator = _createForOfIteratorHelper(notifications),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          NotificationCenter.registerHide(new Notification({
            message: item
          }));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "present",
    value: function present(notification) {
      document.querySelector("." + Notification.classes.container).appendChild(notification.message);
      NotificationCenter.registerHide(notification);
    }
  }, {
    key: "registerHide",
    value: function registerHide(notification) {
      if (notification.hideAfter != null) {
        var _auto = setTimeout(function () {
          NotificationCenter.hide(notification);
        }, notification.hideAfter);
      }

      notification.message.addEventListener("click", function (event) {
        NotificationCenter.hide(notification);

        if (typeof auto !== 'undefined') {
          clearTimeout(auto);
        }
      });
    }
  }, {
    key: "hide",
    value: function hide(notification) {
      notification.message.classList.add("is-sliding-up");
      setTimeout(function () {
        var node = notification.message;

        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }, 500);
    }
  }]);

  return NotificationCenter;
}();

var Notification = /*#__PURE__*/function () {
  function Notification(options) {
    _classCallCheck(this, Notification);

    if (options.log) {
      console.log(options.log);
    }

    this.hideAfter = 15 * 1000;

    if (options.message) {
      // Constructs a Notification object
      // using a pre-existing message element.
      this.message = options.message;
      this.message.classList.remove("is-hidden");
    } else if (options.status && options.content) {
      // Constructs a Notification object,
      // creating a new message element.
      this.message = document.createElement("div");
      this.message.classList.add(Notification.classes.item);
      this.message.classList.add("Notification--" + options.status);

      if (options.status == "failed") {
        this.hideAfter = null;
      }

      this.message.innerHTML = options.content + "<span class=\"Notification-dismiss Icon Icon-times\"></span>";
    } else {
      throw new Error("Invalid Arguments For New Notification: " + JSON.stringify(options));
    }
  }

  _createClass(Notification, null, [{
    key: "isNotification",
    value: function isNotification(obj) {
      return obj.message !== undefined || obj.content !== undefined && obj.status !== undefined;
    }
  }]);

  return Notification;
}();

Notification.classes = {
  container: "Notification-container",
  item: "Notification"
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//             Notification
// ================================
var Preferences = /*#__PURE__*/function () {
  function Preferences() {
    _classCallCheck(this, Preferences);
  }

  _createClass(Preferences, null, [{
    key: "setPreferences",
    value: function setPreferences(preferences) {
      return Preferences.preferences = preferences;
    }
  }, {
    key: "isDefined",
    value: function isDefined(o) {
      return typeof o !== "undefined" && o !== null;
    }
  }, {
    key: "get",
    value: function get(key) {
      var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var o = Preferences.preferences;

      if (!Preferences.isDefined(o)) {
        return fallback;
      }

      var parts = key.split('.'); //var last = parts.pop();

      var l = parts.length;
      var i = 0;

      while (Preferences.isDefined(o) && i < l) {
        var idx = parts[i];
        o = o[idx];
        i++;
      }

      if (Preferences.isDefined(o)) {
        return o;
      } else {
        console.log("Preferences key ", key, "was not defined, using default ", fallback);
        return fallback;
      }
    }
  }, {
    key: "has",
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

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//            Slider
// ================================
var Slider = /*#__PURE__*/function () {
  _createClass(Slider, null, [{
    key: "findAll",
    value: function findAll(container) {
      var _iterator = _createForOfIteratorHelper(container.querySelectorAll(Slider.selectors.slider)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          Slider.list.push(new Slider(item));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } // -----------------
    //       Object
    // -----------------

  }]);

  function Slider(container) {
    _classCallCheck(this, Slider);

    this.container = container;
    this.list = this.container.querySelector(Slider.selectors.list);
    this.items = this.container.querySelectorAll(Slider.selectors.item);
    this.interval = this.container.getAttribute("data-interval") || 5000;
    this.previousId = 0;
    this.currentId = 0;
    this.nextId = 0;
    this.animating = false;
    this.animationTime = 1000;
    this.registerEvents();
    this.next();

    if (this.container.getAttribute("data-autoplay") === "true") {
      this.play();
    }
  }

  _createClass(Slider, [{
    key: "registerEvents",
    value: function registerEvents() {
      this.container.querySelector(Slider.selectors.back).addEventListener("click", this.previous.bind(this));
      this.container.querySelector(Slider.selectors.forward).addEventListener("click", this.next.bind(this));
    }
  }, {
    key: "play",
    value: function play() {
      var callback = this.container.getAttribute("data-direction") === "reverse" ? this.previous.bind(this) : this.next.bind(this);
      this.timer = setInterval(callback, this.interval);
    }
  }, {
    key: "pause",
    value: function pause() {
      clearInterval(this.timer);
    }
  }, {
    key: "hideAll",
    value: function hideAll() {
      var _iterator2 = _createForOfIteratorHelper(this.items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          item.classList = "";
          item.classList.add(Slider.classes.item);
          item.classList.add(Slider.classes.isHidden);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "getItem",
    value: function getItem(id) {
      var item = this.items[id];

      if (item === undefined || item === null) {
        console.error("no slider item at index: ", id);
      }

      return item;
    }
  }, {
    key: "next",
    value: function next() {
      if (!this.shouldAnimate()) {
        return false;
      }

      this.previousId = this.currentId;
      this.currentId += 1;

      if (this.currentId >= this.items.length) {
        this.currentId = 0;
      }

      this.nextId = this.currentId + 1;

      if (this.nextId >= this.items.length) {
        this.nextId = 0;
      }

      var current = this.getItem(this.currentId);
      var previous = this.getItem(this.previousId);
      this.hideAll();
      previous.classList.remove(Slider.classes.isHidden);
      previous.classList.add(Slider.classes.slideOutLeft);
      current.classList.remove(Slider.classes.isHidden);
      current.classList.add(Slider.classes.slideInRight);
    }
  }, {
    key: "previous",
    value: function previous() {
      if (!this.shouldAnimate()) {
        return false;
      }

      this.nextId = this.currentId;
      this.currentId -= 1;

      if (this.currentId <= 0) {
        this.currentId = this.items.length - 1;
      }

      this.previousId = this.currentId - 1;

      if (this.nextId <= 0) {
        this.nextId = this.items.length - 1;
      }

      var current = this.getItem(this.currentId);
      var next = this.getItem(this.nextId);
      this.hideAll();
      next.classList.remove(Slider.classes.isHidden);
      next.classList.add(Slider.classes.slideOutRight);
      current.classList.remove(Slider.classes.isHidden);
      current.classList.add(Slider.classes.slideInLeft);
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

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SmoothState = /*#__PURE__*/function () {
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
      var _iterator = _createForOfIteratorHelper(document.querySelectorAll("html, body")),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          item.scrollTop = 0;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.loading = true;
      var elements = document.getElementsByClassName('Block');
      var blocks = Array.prototype.slice.call(elements);
      blocks.reverse();

      var _loop = function _loop(i) {
        var block = blocks[i];
        setTimeout(function () {
          return block.classList.add('Block--isExiting');
        }, i * 50);
      };

      for (var i = 0; i < blocks.length; i++) {
        _loop(i);
      }
      /*setTimeout(function() {
          if(this.loading) {
              return document.querySelector(".pace-activity").classList.add("pace-activity-active");
          }
      }, blocks.length * 100);*/

    }
  }, {
    key: "onProgress",
    value: function onProgress(container) {
      SmoothState.setCursor('wait');
    }
  }, {
    key: "onReady",
    value: function onReady(container, content) {
      SmoothState.setCursor('auto');
      Oxygen.reset();
      container[0].style.display = 'none';
      container.html(content);
      document.querySelector(".pace-activity").classList.remove("pace-activity-active");
      var blocks = document.getElementsByClassName('Block');

      var _loop2 = function _loop2() {
        var block = blocks[i];
        block.classList.add('Block--isHidden');
        setTimeout(function () {
          block.classList.remove('Block--isHidden');
          block.classList.add('Block--isEntering');
          setTimeout(function () {
            block.classList.remove('Block--isEntering');
          }, 250);
        }, i * 50);
      };

      for (var i = 0; i < blocks.length; i++) {
        _loop2();
      }

      container[0].style.display = 'block';
    }
  }, {
    key: "onAfter",
    value: function onAfter(container, content) {
      this.loading = false; //document.querySelector(".pace-activity").classList.remove("pace-activity-active");

      return Oxygen.init(document.getElementById("page"));
    }
  }, {
    key: "load",
    value: function load(url, push) {
      return this.smoothState.load(url, push);
    }
  }], [{
    key: "setCursor",
    value: function setCursor(mode) {
      var items = document.querySelectorAll("html, body");

      var _iterator2 = _createForOfIteratorHelper(items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          item.style.cursor = mode;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var links = document.querySelectorAll("a");

      var _iterator3 = _createForOfIteratorHelper(links),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _item = _step3.value;
          _item.style.cursor = mode;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "setTheme",
    value: function setTheme(theme) {
      console.log("Setting SmoothState Theme: ", theme);
      var page = document.getElementById("page");

      if (page) {
        page.classList.add('Page-transition--' + theme);
      }
    }
  }]);

  return SmoothState;
}();
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//          ProgressBar
// ================================
var TabSwitcher = /*#__PURE__*/function () {
  _createClass(TabSwitcher, null, [{
    key: "findAll",
    value: function findAll(container) {
      var _iterator = _createForOfIteratorHelper(container.querySelectorAll(TabSwitcher.selectors.container)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          console.log(item);
          /*var tabs = $(item);
          if (tabs.classList.contains(TabSwitcher.classes.content)) {
              container = tabs;
          } else {
              container = tabs.parentNode.querySelector("." + TabSwitcher.classes.content);
          }
           if (container.length === 0) { container = tabs.parentNode.parentNode.querySelector("." + TabSwitcher.classes.content); }*/

          var tabs = item.matchesSelector(TabSwitcher.selectors.tabs) ? item : item.querySelector(TabSwitcher.selectors.tabs);
          var content = item.matchesSelector(TabSwitcher.selectors.content) ? item : item.querySelector(TabSwitcher.selectors.content);
          TabSwitcher.list.push(new TabSwitcher(tabs, content));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } // -----------------
    //       Object
    // -----------------

  }]);

  function TabSwitcher(tabs, content) {
    _classCallCheck(this, TabSwitcher);

    this.tabs = tabs;
    this.content = content;
    this.findDefault();
    this.registerEvents();
  }

  _createClass(TabSwitcher, [{
    key: "findDefault",
    value: function findDefault() {
      var tab = this.tabs.querySelector("[data-default-tab]").getAttribute("data-switch-to-tab");
      this.setTo(tab);
    }
  }, {
    key: "registerEvents",
    value: function registerEvents() {
      var _this = this;

      this.tabs.querySelectorAll("[data-switch-to-tab]").forEach(function (item) {
        item.addEventListener("click", function (event) {
          _this.setTo(event.currentTarget.getAttribute("data-switch-to-tab"));
        });
      });
    }
  }, {
    key: "setTo",
    value: function setTo(tab) {
      this.current = tab;

      var _iterator2 = _createForOfIteratorHelper(this.content.querySelectorAll("[data-tab]")),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          item.classList.remove(TabSwitcher.classes.active);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.content.querySelector("[data-tab=\"" + tab + "\"]").classList.add(TabSwitcher.classes.active);

      var _iterator3 = _createForOfIteratorHelper(this.tabs.querySelectorAll("[data-switch-to-tab]")),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _item = _step3.value;

          _item.classList.remove(TabSwitcher.classes.active);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      this.tabs.querySelector("[data-switch-to-tab=\"" + tab + "\"]").classList.add(TabSwitcher.classes.active);
    }
  }]);

  return TabSwitcher;
}(); // -----------------
//       Static
// -----------------


TabSwitcher.classes = {
  active: "TabSwitcher--isActive"
};
TabSwitcher.selectors = {
  container: ".TabSwitcher",
  tabs: ".TabSwitcher-tabs",
  content: ".TabSwitcher-content"
};
TabSwitcher.list = [];
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//             Toggle
// ================================
var Toggle = /*#__PURE__*/function () {
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

      this.toggle.addEventListener("click", function (event) {
        return _this.handleToggle(event);
      });

      if (this.toggle.getAttribute("data-enabled") == undefined) {
        this.toggle.setAttribute("data-enabled", "false");
      }
    }
  }, {
    key: "handleToggle",
    value: function handleToggle(event) {
      if (this.toggle.getAttribute("data-enabled") === "true") {
        this.toggle.setAttribute("data-enabled", "false");
        this.disableCallback(event);
      } else {
        this.toggle.setAttribute("data-enabled", "true");
        this.enableCallback(event);
      }
    }
  }]);

  return Toggle;
}();

Toggle.classes = {
  ifEnabled: "Toggle--ifEnabled",
  ifDisabled: "Toggle--ifDisabled"
}; // ================================
//        FullscreenToggle
// ================================

var FullscreenToggle = /*#__PURE__*/function (_Toggle) {
  _inherits(FullscreenToggle, _Toggle);

  var _super = _createSuper(FullscreenToggle);

  function FullscreenToggle(toggle, fullscreenElement) {
    var _this2;

    var enterFullscreenCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
    var exitFullscreenCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

    _classCallCheck(this, FullscreenToggle);

    _this2 = _super.call(this, toggle, null, null);
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
      this.fullscreenElement.classList.add("FullscreenToggle--isFullscreen");
      document.body.classList.add("Body--noScroll");
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
      this.fullscreenElement.classList.remove("FullscreenToggle--isFullscreen");
      document.body.classList.remove("Body--noScroll");

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

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Upload = /*#__PURE__*/function () {
  function Upload() {
    _classCallCheck(this, Upload);
  }

  _createClass(Upload, null, [{
    key: "registerEvents",
    value: function registerEvents(container) {
      var _iterator = _createForOfIteratorHelper(container.querySelectorAll(Upload.selectors.uploadElement)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          var dropzone = item.querySelector(Upload.selectors.dropzoneElement);
          dropzone.addEventListener("dragover", Upload.handleDragOver);
          dropzone.addEventListener("dragleave", Upload.handleDragLeave);
          dropzone.addEventListener("drop", Upload.handleDrop);
          item.querySelector("input[type=file]").addEventListener("change", Upload.handleChange);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "handleDragOver",
    value: function handleDragOver(event) {
      event.preventDefault();
      return event.currentTarget.classList.add(Upload.states.onDragOver);
    }
  }, {
    key: "handleDragLeave",
    value: function handleDragLeave(event) {
      return event.currentTarget.classList.remove(Upload.states.onDragOver);
    }
  }, {
    key: "handleDrop",
    value: function handleDrop(event) {
      event.preventDefault();
      event.currentTarget.classList.remove(Upload.states.onDragOver);
      var upload = parentMatchingSelector(event.currentTarget, Upload.selectors.uploadElement);
      Upload.addFiles(upload, event.dataTransfer.files);
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      Upload.addFiles(parentMatchingSelector(event.currentTarget, Upload.selectors.uploadElement), event.currentTarget.files);
      console.dir(event.currentTarget);
      event.currentTarget.value = ""; // reset the input field, so that the change event is always called.
    }
  }, {
    key: "addFiles",
    value: function addFiles(upload, files) {
      var input = upload.querySelector('input[type="file"]');

      var _iterator2 = _createForOfIteratorHelper(files),
          _step2;

      try {
        var _loop = function _loop() {
          var file = _step2.value;
          var imageType = /^image\//;
          console.log(file.type);
          var preview = document.createElement("div");
          preview.classList.add("FileUpload-preview");
          preview.innerHTML = '<div class="FileUpload-preview-info">' + '<span>' + file.name + '</span>' + '<button type="button" class="FileUpload-preview-remove Button--transparent Icon Icon-times"></button>' + '<span class="FileUpload-preview-size">' + fileSize(file.size) + '</span>' + '</div>';
          upload.insertBefore(preview, upload.firstChild);
          preview.querySelector(Upload.selectors.removeFile).addEventListener("click", function (event) {
            var button, index;
            button = event.currentTarget;
            preview = parentMatchingSelector(button, Upload.selectors.previewElement);
            index = input.filesToUpload.indexOf(file);

            if (index > -1) {
              input.filesToUpload.splice(index, 1);
            }

            Upload.recalculateDropzoneVisibility(upload, files);
            preview.parentNode.removeChild(preview);
          });

          if (input.filesToUpload == null) {
            input.filesToUpload = [];
          }

          input.filesToUpload.push(file);

          if (imageType.test(file.type)) {
            var reader = new FileReader();

            reader.onload = function (e) {
              preview.style.backgroundImage = 'url(' + e.target.result + ')';
            };

            reader.readAsDataURL(file);
          } else {
            var container = document.createElement("div");
            container.classList.add("Icon-container");
            var icon = document.createElement("span");
            icon.classList.add("Icon", "Icon--gigantic", "Icon--light", "Icon-file-text");
            container.appendChild(icon);
            preview.insertBefore(container, preview.firstChild);
          }
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      Upload.recalculateDropzoneVisibility(upload);
      console.log(files);
    }
  }, {
    key: "recalculateDropzoneVisibility",
    value: function recalculateDropzoneVisibility(upload, files) {
      var input = upload.querySelector('input[type="file"]');
      var dropzone = upload.querySelector(Upload.selectors.dropzoneElement);

      if (!input.multiple && input.filesToUpload.length > 0) {
        dropzone.style.display = "none";
      } else {
        dropzone.style.display = "block";
      }
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//          CodeViewInterface
// ================================
var CodeViewInterface = /*#__PURE__*/function () {
  function CodeViewInterface(editor) {
    _classCallCheck(this, CodeViewInterface);

    this.editor = editor;
    this.ace = null;
  }

  _createClass(CodeViewInterface, [{
    key: "create",
    value: function create() {
      // edit the textarea
      var object = ace.edit(this.editor.name + "-ace-editor"); // set user preferences

      object.getSession().setMode("ace/mode/" + this.editor.language);
      object.setTheme(Preferences.get('editor.ace.theme'));
      object.getSession().setUseWrapMode(Preferences.get('editor.ace.wordWrap'));
      object.setHighlightActiveLine(Preferences.get('editor.ace.highlightActiveLine'));
      object.setShowPrintMargin(Preferences.get('editor.ace.showPrintMargin'));
      object.setShowInvisibles(Preferences.get('editor.ace.showInvisibles'));
      object.setReadOnly(this.editor.readOnly); // store object

      this.ace = object;
      this.view = document.getElementById(this.editor.name + "-ace-editor");
      this.view.style.fontSize = Preferences.get('editor.ace.fontSize');
    }
  }, {
    key: "show",
    value: function show(full) {
      var _this = this;

      console.log("CodeViewInterface.show");
      this.view.classList.remove(Editor.classes.state.isHidden);

      if (full) {
        this.view.style.width = "100%";
      } // after animation is completed


      setTimeout(function () {
        _this.resize();
      }, 300);
    }
  }, {
    key: "hide",
    value: function hide() {
      console.log("CodeViewInterface.hide");
      this.view.classList.add(Editor.classes.state.isHidden);
    }
  }, {
    key: "valueFromForm",
    value: function valueFromForm() {
      this.ace.setValue(this.editor.textarea.value, -1);
    }
  }, {
    key: "valueToForm",
    value: function valueToForm() {
      this.editor.textarea.value = this.ace.getValue();
    }
  }, {
    key: "resize",
    value: function resize() {
      this.ace.resize();
    }
  }]);

  return CodeViewInterface;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//          DesignViewInterface
//   ================================
var DesignViewInterface = /*#__PURE__*/function () {
  function DesignViewInterface(editor) {
    _classCallCheck(this, DesignViewInterface);

    this.editor = editor;
    this.ck = null;
  }

  _createClass(DesignViewInterface, [{
    key: "create",
    value: function create() {
      var _this = this;

      var config = Preferences.get('editor.ckeditor', {});
      config.customConfig = config.customConfig || '';
      config.allowedContent = true;
      config.entities = false;
      config.protectedSource = [// inline PHP
      /<\?[\s\S]*?\?>/g, // blade directives
      /(\n[ \t]*)?@\w+(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\))?\n?/g, // blade echo
      /{{[\s\S]*?}}}?/g];
      config.contentsCss = this.editor.stylesheets; // create instance

      CKEDITOR.dtd.$removeEmpty["span"] = false;
      this.ck = CKEDITOR.replace(this.editor.name + "-editor", config);
      this.ck.on("instanceReady", function (event) {
        _this.view = document.getElementById("cke_" + _this.editor.name + "-editor"); //put your code here
      });
    }
  }, {
    key: "show",
    value: function show(full) {
      var _this2 = this;

      console.log("DesignViewInterface.show");

      if (this.view) {
        this.view.style.display = "block";

        if (full) {
          this.view.style.width = "100%";
        }
      } else {
        this.ck.on("instanceReady", function (event) {
          _this2.view.style.display = "block";

          if (full) {
            _this2.view.style.width = "100%";
          }
        });
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      this.view.style.display = "none";
    }
  }, {
    key: "valueFromForm",
    value: function valueFromForm() {
      this.ck.setData(this.editor.textarea.value);
    }
  }, {
    key: "valueToForm",
    value: function valueToForm() {
      this.editor.textarea.value = this.ck.getData();
    }
  }]);

  return DesignViewInterface;
}();
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//                 Editor
// ================================
var Editor = /*#__PURE__*/function () {
  _createClass(Editor, null, [{
    key: "createEditors",
    // only create if textarea exists
    value: function createEditors(editors) {
      for (var i = 0, editor; i < editors.length; i++) {
        editor = editors[i];
        var textarea = document.querySelector("textarea[name=\"" + editor.name + "\"]");

        if (textarea) {
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
    var stylesheets = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

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
    this.textarea = document.querySelector("textarea[name=\"" + this.name + "\"]");
    this.container = parentMatchingSelector(this.textarea, "." + Editor.classes.editor.container);
    var toggle = this.container.querySelector("." + Editor.classes.button.fullscreenToggle);

    if (toggle) {
      this.fullscreenToggle = new FullscreenToggle(toggle, this.container, this.enterFullscreen, this.exitFullscreen);
    }

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
      var _iterator = _createForOfIteratorHelper(this.container.querySelectorAll("." + Editor.classes.button.switchEditor)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var button = _step.value;
          button.addEventListener("click", this.handleSwitchEditor);
        } // ask the form to tell us when its data is being read,
        // so we can flush changes to the underlying <input>/<textarea> element

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var form = parentMatchingSelector(this.container, "form");

      if (form !== null && form.formObject) {
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
      var full = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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
      this.container.querySelector("." + Editor.classes.editor.content).style.height = this.textarea.rows * 1.5 + "em"; // resize ace

      if (this.modes.code) {
        this.modes.code.resize();
      }
    } // enter fullscreen

  }, {
    key: "enterFullscreen",
    value: function enterFullscreen() {
      console.log("fullscreen");
      this.resizeToContainer();
    } // exit fullscreen

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
      var editorToSwitch = event.currentTarget.getAttribute("data-editor");
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//          PreviewInterface
// ================================
var PreviewInterface = /*#__PURE__*/function () {
  function PreviewInterface(editor) {
    _classCallCheck(this, PreviewInterface);

    this.editor = editor;
    this.view = null;
  }

  _createClass(PreviewInterface, [{
    key: "create",
    value: function create() {
      var preview = document.createElement("iframe");
      preview.id = this.editor.name + "-preview";
      preview.classList.add(Editor.classes.editor.preview);
      this.editor.container.querySelector(".Editor-content").appendChild(preview);
      this.view = preview;
    }
  }, {
    key: "show",
    value: function show(full) {
      var preview = document.getElementById(this.editor.name + "-preview");
      preview.classList.remove(Editor.classes.state.isHidden);

      if (full) {
        preview.style.width = "100%";
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      return document.getElementById(this.editor.name + "-preview").classList.add(Editor.classes.state.isHidden);
    }
  }, {
    key: "valueFromForm",
    value: function valueFromForm() {
      var _this = this;

      var data = {
        _token: this.editor.container.querySelector(".contentPreviewCSRFToken").value,
        content: this.editor.textarea.value
      };
      var url = this.editor.container.querySelector(".contentPreviewURL").value;
      var method = this.editor.container.querySelector(".contentPreviewMethod").value;
      console.log("Generating content using data ", data);
      var promise = window.fetch(url, FetchOptions["default"]().method(method).body(getFormDataObject(data))).then(Oxygen.respond.checkStatus).then(Oxygen.respond.text).then(function (data) {
        _this.view.srcdoc = data;
      }) // this particular endpoint returns an HTML error page, so we provide a custom handler.
      ["catch"](function (error) {
        if (error.response && error.response instanceof Response) {
          console.error(error);
          error.response.text().then(function (data) {
            _this.view.srcdoc = data;
          });
        } else {
          throw error;
        }
      });
    } // we can't and don't want to do this

  }, {
    key: "valueToForm",
    value: function valueToForm() {}
  }]);

  return PreviewInterface;
}();
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ==========================
//     SplitViewInterface
// ==========================
var SplitViewInterface = /*#__PURE__*/function () {
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
      var items = this.editor.container.querySelectorAll("." + Editor.classes.editor.content);

      var _iterator = _createForOfIteratorHelper(items),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          item.classList.add(Editor.classes.state.contentIsSplit);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var e = this.editor;
      e.show("code", false);
      e.show("preview", false);
      e.modes.code.view.style.width = "50%";
      e.modes.preview.view.style.width = "50%";
      e.modes.code.ace.addEventListener("change", this.synchronize.bind(this));
    }
  }, {
    key: "hide",
    value: function hide() {
      var items = this.editor.container.querySelectorAll("." + Editor.classes.editor.content);

      var _iterator2 = _createForOfIteratorHelper(items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          item.classList.remove(Editor.classes.state.contentIsSplit);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.editor.hide("code");
      this.editor.hide("preview");
    }
  }, {
    key: "valueFromForm",
    value: function valueFromForm() {}
  }, {
    key: "valueToForm",
    value: function valueToForm() {}
  }, {
    key: "synchronize",
    value: function synchronize() {
      var _this = this;

      if (this.currentTimer) {
        clearTimeout(this.currentTimer);
      }

      this.currentTimer = setTimeout(function () {
        if (_this.editor.currentMode === "split") {
          _this.editor.valueToForm("code");

          _this.editor.valueFromForm("preview");
        }
      }, 1000);
    }
  }]);

  return SplitViewInterface;
}();
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ================================
//             ImageEditor
// ================================
var ImageEditor = /*#__PURE__*/function () {
  // -----------------
  //      Object
  // -----------------
  function ImageEditor(container) {
    var _this = this;

    _classCallCheck(this, ImageEditor);

    this.container = container;
    this.jCropApi = null;
    this.cropDisableCounter = 0;
    this.cropOrigin = {
      x: 0,
      y: 0
    };
    this.image = this.container.querySelector("." + ImageEditor.classes.layout.image);
    this.$image = $(this.image);

    if (!this.image) {
      throw new Error("<img> element doesn't exist");
    }

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
    this.image.addEventListener("load", function (event) {
      console.log('Image Loaded');
      var image = event.currentTarget;
      _this.imageAspectRatio = image.naturalWidth / image.naturalHeight;
      _this.fields.resize.width.value = image.naturalWidth;
      _this.fields.resize.height.value = image.naturalHeight;

      _this.enableCropping();
    });
    this.fullscreenToggle = new FullscreenToggle(this.container.querySelector("." + ImageEditor.classes.button.toggleFullscreen), this.container);
    this.container.querySelector("." + ImageEditor.classes.button.apply).addEventListener("click", this.handlePreview.bind(this));
    this.container.querySelector("." + ImageEditor.classes.button.save).addEventListener("click", this.handleSave.bind(this));
    this.container.querySelectorAll("." + ImageEditor.classes.form.crop).forEach(function (item) {
      item.addEventListener("input", _this.handleCropInputChange.bind(_this));
    });
    this.container.querySelectorAll("." + ImageEditor.classes.form.resize).forEach(function (item) {
      item.addEventListener("input", _this.handleResizeInputChange.bind(_this));
    });
  }

  _createClass(ImageEditor, [{
    key: "handlePreview",
    value: function handlePreview() {
      this.applyChanges(this.gatherData());
    }
  }, {
    key: "handleSave",
    value: function handleSave() {
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
      return this.removeDefaultFields(getFormData(this.forms.simple));
    }
  }, {
    key: "removeDefaultFields",
    value: function removeDefaultFields(formData) {
      var _this2 = this;

      var resize = function resize(formData) {
        return (!formData["resize[width]"] || formData["resize[width]"] === _this2.image.naturalWidth.toString()) && (!formData["resize[height]"] || formData["resize[height]"] === _this2.image.naturalHeight.toString());
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
          //return item === ""  0 : parseInt(item)
          if (_this2.pendingCropOrigin === undefined) {
            _this2.pendingCropOrigin = {};
          }

          _this2.pendingCropOrigin.x = parseInt(item);
        },
        "crop[y]": function cropY(item) {
          if (_this2.pendingCropOrigin === undefined) {
            _this2.pendingCropOrigin = {};
          }

          _this2.pendingCropOrigin.y = parseInt(item); //this.imageDimensions.cropY = item === "" ? 0 : parseInt(item);
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
      return JSON.parse(this.fields.macro.value);
    } // --------------------------------------------
    //                     REQUEST
    // --------------------------------------------

  }, {
    key: "applyChanges",
    value: function applyChanges(data) {
      var _this3 = this;

      if (this.applyingChanges) {
        NotificationCenter.present(new Notification({
          content: "Already Processing",
          status: "failed"
        }));
        return;
      }

      this.applyingChanges = true;
      console.log("Processing Image Using Commands: ", data);
      var url = this.image.getAttribute("data-root") + "?" + serializeToQueryString(data);
      var headers = new Headers();
      headers.set("Accept", "application/json");
      var options = {
        method: "GET",
        credentials: "same-origin",
        headers: headers
      };
      console.log("Requesting URL: ", url, options);
      window.fetch(url, options).then(Oxygen.respond.checkStatus).then(function (response) {
        return response.blob();
      }).then(function (myBlob) {
        if (_this3.jCropApi != null) {
          _this3.jCropApi.destroy();
        }

        _this3.jCropApi = null;
        _this3.cropOrigin = _this3.pendingCropOrigin;
        var objectURL = URL.createObjectURL(myBlob);

        _this3.image.style.removeProperty('width');

        _this3.image.style.removeProperty('height');

        _this3.image.src = objectURL; //this.image[0].src = "data:image/jpeg;base64," + base64Encode(response);
      }).then(function (r) {
        NotificationCenter.present(new Notification({
          content: "Image Processing Successful",
          status: "success"
        }));
        _this3.applyingChanges = false;
      }, function (e) {
        _this3.applyingChanges = false;
        throw e;
      })["catch"](Oxygen.respond.handleAPIError);
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
    } // --------------------------------------------
    //                     CROP
    // --------------------------------------------

  }, {
    key: "enableCropping",
    value: function enableCropping() {
      /*if(this.jCropApi != null) {
          this.jCropApi.enable();
      } else {*/
      var that = this;
      this.$image.Jcrop({
        trueSize: [this.image.naturalWidth, this.image.naturalHeight],
        onChange: this.handleCropSelect.bind(this),
        onSelect: this.handleCropSelect.bind(this),
        onRelease: this.handleCropRelease.bind(this)
      }, function () {
        that.jCropApi = this;
      }); //}
    }
  }, {
    key: "handleCropSelect",
    value: function handleCropSelect(c) {
      if (this.cropDisableCounter <= 0) {
        this.fields.crop.x.value = Math.round(c.x + this.cropOrigin.x).toString();
        this.fields.crop.y.value = Math.round(c.y + this.cropOrigin.y).toString();
        this.fields.crop.width.value = Math.round(c.w).toString();
        this.fields.crop.height.value = Math.round(c.h).toString();
      } else {
        this.cropDisableCounter--;
      }
    }
  }, {
    key: "handleCropInputChange",
    value: function handleCropInputChange(event) {
      if (this.jCropApi === null) {
        return;
      }

      var x = parseInt(this.fields.crop.x.value === "" ? 0 : this.fields.crop.x.value);
      var y = parseInt(this.fields.crop.y.value === "" ? 0 : this.fields.crop.y.value);
      var w = parseInt(this.fields.crop.width.value === "" ? 0 : this.fields.crop.width.value);
      var h = parseInt(this.fields.crop.height.value === "" ? 0 : this.fields.crop.height.value); // this counts down from 2, so the next two events generated by Jcrop are ignored.

      this.cropDisableCounter = 2;
      return this.jCropApi.setSelect([x, y, x + w, y + h]);
    }
  }, {
    key: "handleCropRelease",
    value: function handleCropRelease() {
      this.fields.crop.x.value = 0;
      this.fields.crop.y.value = 0;
      this.fields.crop.width.value = 0;
      this.fields.crop.height.value = 0;
    }
  }, {
    key: "handleResizeInputChange",
    value: function handleResizeInputChange(e) {
      if (this.fields.resize.keepAspectRatio[0].checked) {
        var name = e.target.name;
        var value = e.target.value;
        console.log(name, value);

        if (name === 'resize[width]') {
          return this.fields.resize.height.value = Math.round(value / this.imageAspectRatio);
        } else {
          return this.fields.resize.width.value = Math.round(value * this.imageAspectRatio.ratio);
        }
      }
    }
  }], [{
    key: "initialize",
    value: function initialize(container) {
      var _iterator = _createForOfIteratorHelper(container.querySelectorAll("." + ImageEditor.classes.layout.container)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          ImageEditor.list.push(new ImageEditor(item));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return ImageEditor;
}();

;

function serializeToQueryString(object) {
  return Object.keys(object).reduce(function (a, k) {
    a.push(k + '=' + encodeURIComponent(object[k]));
    return a;
  }, []).join('&');
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
"use strict";

Oxygen || (Oxygen = {});

Oxygen.initLogin = function () {
  var loginForm = document.querySelector(".Login-form");
  loginForm.classList.add("Login--noTransition");
  loginForm.classList.add("Login--slideDown");
  loginForm.offsetHeight;
  loginForm.classList.remove("Login--noTransition");
  setTimeout(function () {
    document.body.classList.remove("Login--isHidden");
  }, 500);
  document.querySelector(".Login-scrollDown").addEventListener("click", function () {
    document.querySelector(".Login-message").classList.add("Login--slideUp");
    loginForm.classList.remove("Login--slideDown");
    document.querySelector(".Login-background--blur").classList.add("Login--isHidden");
  });
  var form = loginForm.querySelector("form");
  form.addEventListener("submit", function () {
    loginForm.classList.add("Login--slideUp");
  });

  form.modifyPromise = function (promise) {
    return promise.then(function (data) {
      if (data.status !== undefined && data.status !== "success") {
        loginForm.classList.remove("Login--slideUp");
      }

      return data;
    }, function (error) {
      loginForm.classList.remove("Login--slideUp");
      throw error;
    });
  };
};
"use strict";

window.Oxygen || (window.Oxygen = {});

Oxygen.reset = function () {
  window.editors = [];
  Oxygen.load = [];
  Oxygen.setBodyScrollable(true);
  return Dropdown.handleGlobalClick({
    target: document.body
  });
};

Oxygen.setBodyScrollable = function (scrollable) {
  if (scrollable) {
    document.body.classList.remove("Body--noScroll");
  } else {
    document.body.classList.add("Body--noScroll");
  }
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
  NotificationCenter.initializeExistingMessages();
  Dialog.registerEvents(container); //
  // -------------------------
  //       IMAGE EDITOR
  // -------------------------
  //
  // Initialises image editors for the page.
  //

  ImageEditor.initialize(container); //
  // -------------------------
  //           LOGIN
  // -------------------------
  //
  // Login form animations.
  //

  if (document.querySelector(".Login-form")) {
    Oxygen.initLogin();
  } //
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
  Slider.findAll(container); //
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

document.addEventListener("DOMContentLoaded", function () {
  MainNav.headroom();

  if (typeof user !== "undefined" && user !== null) {
    Preferences.setPreferences(user);
  }

  Oxygen.init(document);

  if (Preferences.get('pageLoad.smoothState.enabled', true) === true) {
    console.log("smoothstate enabled");
    window.smoothState = new SmoothState();
    SmoothState.setTheme(Preferences.get('pageLoad.smoothState.theme', 'slide'));
  } else {
    console.log("smoothstate disabled");
  }

  var progressThemes = Preferences.get('pageLoad.progress.theme', ["minimal", "spinner"]);
  console.log("Applying progress themes:", progressThemes);

  for (var i = 0, theme; i < progressThemes.length; i++) {
    theme = progressThemes[i];
    document.body.classList.add("Page-progress--" + theme);
  }

  Form.registerKeydownHandler();
  Dropdown.registerGlobalEvent();
});
//# sourceMappingURL=app.js.map
