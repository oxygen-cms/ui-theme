(function() {
  var Ajax, CodeViewInterface, DesignViewInterface, Dialog, Dropdown, Editor, Form, FullscreenToggle, ImageEditor, MainNav, Notification, PreviewInterface, ProgressBar, Slider, SplitViewInterface, TabSwitcher, Toggle, Upload,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Ajax = Ajax = (function() {
    function Ajax() {}

    Ajax.handleErrorCallback = (function() {});

    Ajax.handleSuccessCallback = (function() {});

    Ajax.sendAjax = function(type, url, data) {
      $.ajax({
        dataType: "json",
        type: type,
        url: url,
        data: data,
        success: this.handleSuccess,
        error: this.handleError
      });
    };

    Ajax.fireLink = function(event) {
      event.preventDefault();
      this.sendAjax("GET", $(event.target).attr("href"), null);
    };

    Ajax.handleSuccess = function(data) {
      if (data.redirect) {
        window.location.replace(data.redirect);
      } else {
        new Notification(data);
      }
      Ajax.handleSuccessCallback(data);
    };

    Ajax.handleError = function(response, textStatus, errorThrown) {
      var content, e;
      try {
        content = $.parseJSON(response.responseText);
        new Notification({
          content: "Exception of type <code class=\"no-wrap\">" + content.error.type + "</code>with message <code class=\"no-wrap\">" + content.error.message + "</code>thrown at <code class=\"no-wrap\">" + content.error.file + ":" + content.error.line + "</code>",
          status: "failed"
        });
      } catch (_error) {
        e = _error;
        console.error(response.responseText);
        new Notification({
          content: "Whoops, looks like something went wrong.",
          status: "failed"
        });
      }
      Ajax.handleErrorCallback(response, textStatus, errorThrown);
    };

    return Ajax;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Form = Form = (function() {
    Form.list = [];

    Form.messages = {
      confirmation: "You have made changes to this form.<br>Are you sure you want to exit?"
    };

    Form.classes = {
      warnBeforeExit: "Form--warnBeforeExit",
      submitOnKeydown: "Form--submitOnKeydown",
      sendAjax: "Form--sendAjax",
      sendAjaxOnChange: "Form--sendAjaxOnChange",
      taggableInput: ".Form-taggable"
    };

    Form.findAll = function() {
      $("form").each(function() {
        return Form.list.push(new Form($(this)));
      });
      return $(Form.classes.taggableInput).tagging();
    };

    function Form(element) {
      this.handleKeydown = __bind(this.handleKeydown, this);
      this.sendAjax = __bind(this.sendAjax, this);
      this.handleExit = __bind(this.handleExit, this);
      this.handleSave = __bind(this.handleSave, this);
      this.handleChange = __bind(this.handleChange, this);
      this.form = element;
      this.registerEvents();
    }

    Form.prototype.registerEvents = function() {
      if (this.form.hasClass(Form.classes.warnBeforeExit)) {
        this.form.find(":input").on("input change", this.handleChange);
        this.form.on("submit", this.handleSave);
        $("a, button[type=\"submit\"]").on("click", this.handleExit);
      }
      if (this.form.hasClass(Form.classes.sendAjax)) {
        this.form.on("submit", this.sendAjax);
      }
      if (this.form.hasClass(Form.classes.sendAjaxOnChange)) {
        this.form.on("change", this.sendAjax);
      }
      if (this.form.hasClass(Form.classes.submitOnKeydown)) {
        $(document.body).on("keydown", this.handleKeydown);
      }
    };

    Form.prototype.handleChange = function(event) {
      this.form.attr("data-changed", true);
      console.log("Form Changed");
    };

    Form.prototype.handleSave = function(event) {
      this.form.attr("data-changed", false);
      console.log("Form Saved");
    };

    Form.prototype.handleExit = function(event) {
      if (this.form.attr("data-changed") === "true") {
        if ($(event.currentTarget).hasClass("Form-submit")) {
          return;
        }
        Dialog.handleConfirmClick(event, {
          message: Form.messages.confirmation,
          buttons: [
            $.extend({}, vex.dialog.buttons.YES, {
              text: 'Discard Changes'
            }), $.extend({}, vex.dialog.buttons.NO, {
              text: 'Cancel'
            })
          ]
        });
      }
    };

    Form.prototype.sendAjax = function(event) {
      event.preventDefault();
      Ajax.sendAjax(this.form.attr("method"), this.form.attr("action"), Form.getFormData(this.form));
    };

    Form.prototype.handleKeydown = function(event) {
      if ((event.ctrlKey || event.metaKey) && event.which === 83) {
        this.form.submit();
        event.preventDefault();
      }
    };

    Form.getFormData = function(form) {
      var data;
      data = {};
      form.find("[name]").each(function() {
        var name, value;
        name = $(this).attr("name");
        value = $(this).val();
        if ($(this).is("[type=\"checkbox\"]")) {
          if ($(this).is(":checked")) {
            return data[name] = value;
          }
        } else {
          return data[name] = value;
        }
      });
      return data;
    };

    Form.getFormDataObject = function(form) {
      var data;
      data = new FormData();
      form.find("[name]").each(function() {
        var name, value;
        name = $(this).attr("name");
        value = $(this).val();
        if ($(this).is("[type=\"checkbox\"]")) {
          if ($(this).is(":checked")) {
            return data.append(name, value);
          }
        } else {
          return data.append(name, value);
        }
      });
      return data;
    };

    return Form;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Toggle = Toggle = (function() {
    Toggle.classes = {
      ifEnabled: "Toggle--ifEnabled",
      ifDisabled: "Toggle--ifDisabled"
    };

    function Toggle(toggle, enableCallback, disableCallback) {
      this.toggle = toggle;
      this.enableCallback = enableCallback;
      this.disableCallback = disableCallback;
      this.registerEvents();
    }

    Toggle.prototype.registerEvents = function() {
      this.toggle.on("click", this.handleToggle.bind(this));
      return this.toggle.attr("data-enabled", "false");
    };

    Toggle.prototype.handleToggle = function() {
      if (this.toggle.attr("data-enabled") === "true") {
        this.toggle.attr("data-enabled", "false");
        return this.disableCallback();
      } else {
        this.toggle.attr("data-enabled", "true");
        return this.enableCallback();
      }
    };

    return Toggle;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.FullscreenToggle = FullscreenToggle = (function(_super) {
    __extends(FullscreenToggle, _super);

    function FullscreenToggle(toggle, fullscreenElement, enterFullscreenCallback, exitFullscreenCallback) {
      this.exitFullscreen = __bind(this.exitFullscreen, this);
      this.enterFullscreen = __bind(this.enterFullscreen, this);
      this.toggle = toggle;
      this.fullscreenElement = fullscreenElement;
      this.enableCallback = this.enterFullscreen;
      this.disableCallback = this.exitFullscreen;
      this.enterFullscreenCallback = enterFullscreenCallback;
      this.exitFullscreenCallback = exitFullscreenCallback;
      this.registerEvents();
    }

    FullscreenToggle.prototype.enterFullscreen = function() {
      var e;
      this.fullscreenElement.addClass("FullscreenToggle--isFullscreen");
      $(document.body).addClass("Body--noScroll");
      e = document.body;
      if (e.requestFullscreen) {
        e.requestFullscreen();
      } else if (e.mozRequestFullScreen) {
        e.mozRequestFullScreen();
      } else if (e.webkitRequestFullscreen) {
        e.webkitRequestFullscreen();
      } else if (e.msRequestFullscreen) {
        e.msRequestFullscreen();
      }
      this.enterFullscreenCallback();
    };

    FullscreenToggle.prototype.exitFullscreen = function() {
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
    };

    return FullscreenToggle;

  })(Toggle);

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.ProgressBar = ProgressBar = (function() {
    ProgressBar.classes = {
      container: "ProgressBar",
      fill: "ProgressBar-fill",
      noTransition: "ProgressBar-fill--jump",
      message: "ProgressBar-message",
      itemMessage: "ProgressBar-message-item",
      sectionCount: "ProgressBar-message-section-count",
      sectionMessage: "ProgressBar-message-section-message"
    };

    function ProgressBar(element) {
      this.container = element;
      this.fill = this.container.find("." + ProgressBar.classes.fill);
      this.message = this.container.parent().find("." + ProgressBar.classes.message);
      this.itemMessage = this.message.find("." + ProgressBar.classes.itemMessage);
      this.sectionCount = this.message.find("." + ProgressBar.classes.sectionCount);
      this.sectionMessage = this.message.find("." + ProgressBar.classes.sectionMessage);
      this.setup();
    }

    ProgressBar.prototype.setup = function() {
      return this.fill.css("opacity", "1");
    };

    ProgressBar.prototype.transitionTo = function(value, total) {
      var percentage;
      percentage = Math.round(value / total * 100);
      if (percentage > 100) {
        percentage = 100;
      }
      this.fill.css("width", percentage + "%");
    };

    ProgressBar.prototype.setMessage = function(message) {
      this.message.show();
      this.itemMessage.html(message);
    };

    ProgressBar.prototype.setSectionCount = function(count) {
      this.message.show();
      this.sectionCount.html(count);
    };

    ProgressBar.prototype.setSectionMessage = function(message) {
      this.message.show();
      this.sectionMessage.html(message);
    };

    ProgressBar.prototype.reset = function(callback) {
      var fill;
      if (callback == null) {
        callback = (function() {});
      }
      this.message.hide();
      fill = this.fill;
      fill.addClass(ProgressBar.classes.noTransition);
      setTimeout(function() {
        fill.css("width", "0");
        return setTimeout(function() {
          fill.removeClass(ProgressBar.classes.noTransition);
          return callback();
        }, 0);
      }, 0);
    };

    ProgressBar.prototype.resetAfter = function(time) {
      setTimeout(this.reset.bind(this), time);
    };

    return ProgressBar;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Dropdown = Dropdown = (function() {
    function Dropdown() {}

    Dropdown.classes = {
      dropdownToggle: "Dropdown-container",
      dropdownList: "Dropdown",
      isActive: "is-active"
    };

    Dropdown.registerEvents = function() {
      $("." + this.classes.dropdownToggle).on("click", this.handleClick.bind(this));
      return $(document).on("click", this.handleGlobalClick.bind(this));
    };

    Dropdown.handleClick = function(event) {
      var container, dropdown, target;
      target = $(event.target);
      container = void 0;
      if (target.hasClass(this.classes.dropdownToggle)) {
        container = target;
      } else {
        container = target.parent();
      }
      dropdown = container.find("." + this.classes.dropdownList);
      if (dropdown.hasClass(this.classes.isActive)) {
        return dropdown.removeClass(this.classes.isActive);
      } else {
        $("." + this.classes.dropdownList).removeClass(this.classes.isActive);
        return dropdown.addClass(this.classes.isActive);
      }
    };

    Dropdown.handleGlobalClick = function(event) {
      var ancestorExists, parentHasClass, target, targetHasClass;
      target = $(event.target);
      targetHasClass = target.hasClass(this.classes.dropdownToggle);
      parentHasClass = target.parent().hasClass(this.classes.dropdownToggle);
      ancestorExists = target.parents("." + this.classes.dropdownToggle).length;
      if (!targetHasClass && !parentHasClass && !ancestorExists) {
        return $("." + this.classes.dropdownList).removeClass(this.classes.isActive);
      }
    };

    return Dropdown;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Notification = Notification = (function() {
    Notification.classes = {
      container: "Notification-container",
      item: "Notification"
    };

    Notification.initializeExistingMessages = function() {
      $("." + Notification.classes.container).find("." + Notification.classes.item).each(function(index, value) {
        new Notification({
          message: $(this)
        });
      });
    };

    function Notification(options) {
      if (options.log) {
        console.log(options.log);
      }
      if (options.message) {
        this.message = options.message;
        this.message.removeClass("is-hidden");
        this.registerHide();
      } else if (options.status && options.content) {
        this.message = $("<div class=\"" + Notification.classes.item + " Notification--" + options.status + "\">" + options.content + "<span class=\"Notification-dismiss Icon Icon-times\"></span></div>");
        this.show();
      } else {
        console.error("Invalid Arguments For New Notification");
        console.error(options);
      }
      return;
    }

    Notification.prototype.show = function() {
      this.message.appendTo("." + Notification.classes.container);
      this.registerHide();
    };

    Notification.prototype.registerHide = function() {
      this.message.click(this.hide.bind(this));
      setTimeout(this.hide.bind(this), 20000);
    };

    Notification.prototype.hide = function() {
      this.message.addClass("is-sliding-up");
      setTimeout(this.remove.bind(this), 500);
    };

    Notification.prototype.remove = function() {
      this.message.remove();
    };

    return Notification;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.TabSwitcher = TabSwitcher = (function() {
    TabSwitcher.classes = {
      tabs: "TabSwitcher-tabs",
      content: "TabSwitcher-content",
      active: "TabSwitcher--isActive"
    };

    TabSwitcher.list = [];

    TabSwitcher.findAll = function() {
      $("." + TabSwitcher.classes.tabs).each(function() {
        return TabSwitcher.list.push(new TabSwitcher($(this), $(this).parent().parent().find("." + TabSwitcher.classes.content)));
      });
    };

    function TabSwitcher(tabs, container) {
      this.handleClick = __bind(this.handleClick, this);
      this.tabs = tabs;
      this.container = container;
      this.findDefault();
      this.registerEvents();
      return;
    }

    TabSwitcher.prototype.findDefault = function() {
      var tab;
      tab = this.tabs.find("[data-default-tab]").attr("data-switch-to-tab");
      this.setTo(tab);
    };

    TabSwitcher.prototype.registerEvents = function() {
      this.tabs.find("[data-switch-to-tab]").on("click", this.handleClick);
    };

    TabSwitcher.prototype.handleClick = function(event) {
      var tab;
      tab = $(event.currentTarget).attr("data-switch-to-tab");
      this.setTo(tab);
    };

    TabSwitcher.prototype.setTo = function(tab) {
      this.container.find("[data-tab]").removeClass(TabSwitcher.classes.active);
      this.container.find("[data-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active);
      this.tabs.find("[data-switch-to-tab]").removeClass(TabSwitcher.classes.active);
      this.tabs.find("[data-switch-to-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active);
    };

    return TabSwitcher;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Upload = Upload = (function() {
    Upload.selectors = {
      uploadElement: ".FileUpload",
      progressBarElement: ".ProgressBar",
      progressBarFill: ".ProgressBar-fill"
    };

    Upload.states = {
      onDragOver: "FileUpload--onDragOver"
    };

    Upload.registerEvents = function() {
      return $(Upload.selectors.uploadElement).on("dragover", Upload.handleDragOver).on("dragleave", Upload.handleDragLeave).on("drop", Upload.handleDrop).find("input[type=file]").on("change", Upload.handleChange);
    };

    Upload.handleDragOver = function(event) {
      return $(event.currentTarget).addClass(Upload.states.onDragOver);
    };

    Upload.handleDragLeave = function(event) {
      return $(event.currentTarget).removeClass(Upload.states.onDragOver);
    };

    Upload.handleDrop = function(event) {
      var file, files, form, formData, input, upload, _i, _len;
      event.preventDefault();
      $(event.currentTarget).removeClass(Upload.states.onDragOver);
      files = event.originalEvent.dataTransfer.files;
      form = $(event.currentTarget).parents("form");
      input = $(event.currentTarget).find("input")[0];
      formData = Form.getFormDataObject(form);
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        formData.append(input.name, file);
      }
      upload = new Upload($(event.currentTarget).parent().find(Upload.selectors.progressBarElement), form, formData);
      upload.send();
    };

    Upload.handleChange = function(event) {
      event.target.form.submit();
    };

    function Upload(progressBar, form, data) {
      this.progressBar = new ProgressBar(progressBar);
      this.form = form;
      this.data = data;
    }

    Upload.prototype.send = function() {
      return $.ajax({
        dataType: "json",
        type: this.form.attr("method"),
        url: this.form.attr("action"),
        data: this.data,
        contentType: false,
        processData: false,
        success: this.handleSuccess.bind(this),
        error: Ajax.handleError,
        xhr: this.createCustomRequest.bind(this)
      });
    };

    Upload.prototype.createCustomRequest = function() {
      var object;
      object = window.ActiveXObject ? new ActiveXObject("XMLHttp") : new XMLHttpRequest();
      object.upload.addEventListener("progress", this.handleProgress.bind(this));
      return object;
    };

    Upload.prototype.handleProgress = function(event) {
      if (event.lengthComputable) {
        return this.progressBar.transitionTo(event.loaded, event.total);
      }
    };

    Upload.prototype.handleSuccess = function(data) {
      Ajax.handleSuccess(data);
      return this.progressBar.reset();
    };

    return Upload;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.MainNav = MainNav = (function() {
    function MainNav() {}

    MainNav.headroom = function() {
      var header, headroom;
      header = $(".MainNav");
      if (header.length > 0) {
        if ($(window).width() > 768) {
          headroom = new Headroom(header[0], {
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
    };

    return MainNav;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Slider = Slider = (function() {
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

    Slider.findAll = function() {
      return $(Slider.selectors.slider).each(function() {
        return Slider.list.push(new Slider($(this)));
      });
    };

    function Slider(container) {
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

    Slider.prototype.registerEvents = function() {
      this.container.find(Slider.selectors.back).on("click", this.previous.bind(this));
      this.container.find(Slider.selectors.forward).on("click", this.next.bind(this));
    };

    Slider.prototype.play = function() {
      var callback;
      callback = this.container.attr("data-direction") === "reverse" ? this.previous.bind(this) : this.next.bind(this);
      this.timer = setInterval(callback, this.interval);
    };

    Slider.prototype.pause = function() {
      clearInterval(this.timer);
    };

    Slider.prototype.getItem = function(id) {
      return this.list.children(":nth-child(" + id + ")");
    };

    Slider.prototype.hideAll = function() {
      this.items.removeClass();
      this.items.addClass(Slider.classes.item + " " + Slider.classes.isHidden);
    };

    Slider.prototype.allClasses = function() {
      return Slider.classes.isHidden + " " + Slider.classes.slideInLeft + " " + Slider.classes.slideInRight + " " + Slider.classes.slideOutLeft + " " + Slider.classes.slideOutRight;
    };

    Slider.prototype.next = function() {
      var current, previous;
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
      this.hideAll;
      previous.removeClass(this.allClasses()).addClass(Slider.classes.slideOutLeft);
      current.removeClass(this.allClasses()).addClass(Slider.classes.slideInRight);
    };

    Slider.prototype.previous = function() {
      var current, next;
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
      this.hideAll;
      next.removeClass(this.allClasses()).addClass(Slider.classes.slideOutRight);
      current.removeClass(this.allClasses()).addClass(Slider.classes.slideInLeft);
    };

    Slider.prototype.shouldAnimate = function() {
      if (this.animating) {
        return false;
      }
      this.animating = true;
      setTimeout((function(_this) {
        return function() {
          _this.animating = false;
        };
      })(this), this.animationTime);
      return true;
    };

    return Slider;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Dialog = Dialog = (function() {
    function Dialog() {}

    Dialog.registerEvents = function() {
      $("[data-dialog-type=\"confirm\"]").on("click", this.handleConfirmClick);
    };

    Dialog.handleConfirmClick = function(event, customConfig) {
      var attribute, defaultConfig, target;
      target = $(event.currentTarget);
      if (target.attr("data-dialog-disabled") !== "true") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        defaultConfig = {
          message: target.attr("data-dialog-message"),
          callback: function(value) {
            if (value) {
              target.attr("data-dialog-disabled", "true");
              return target[0].click();
            }
          }
        };
        for (attribute in customConfig) {
          defaultConfig[attribute] = customConfig[attribute];
        }
        return vex.dialog.confirm(defaultConfig);
      }
    };

    return Dialog;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Editor = Editor = (function() {
    Editor.list = [];

    Editor.createEditors = function(editors) {
      var editor, textarea, _i, _len;
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        textarea = $("textarea[name=\"" + editor.name + "\"]");
        if (textarea.length) {
          console.log("Editor found");
          if (editor.mode == null) {
            editor.mode = user.editor.defaultMode;
          }
          console.log(editor);
          new Editor(editor.name, editor.language, editor.mode, editor.readOnly, editor.stylesheets);
        } else {
          console.log("Editor not found");
          console.log(editor);
        }
      }
    };

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

    function Editor(name, language, currentMode, readOnly, stylesheets) {
      if (stylesheets == null) {
        stylesheets = [];
      }
      this.handleFormSubmit = __bind(this.handleFormSubmit, this);
      this.handleSwitchEditor = __bind(this.handleSwitchEditor, this);
      this.exitFullscreen = __bind(this.exitFullscreen, this);
      this.enterFullscreen = __bind(this.enterFullscreen, this);
      this.name = name;
      this.language = language;
      this.currentMode = currentMode;
      this.readOnly = readOnly;
      this.stylesheets = stylesheets;
      this.modes = {};
      this.textarea = $("textarea[name=\"" + this.name + "\"]");
      this.container = this.textarea.parents("." + Editor.classes.editor.container);
      this.fullscreenToggle = new FullscreenToggle(this.container.find("." + Editor.classes.button.fullscreenToggle), this.container, this.enterFullscreen, this.exitFullscreen);
      this.show();
      this.resizeToContent();
      this.registerEvents();
      Editor.list.push(this);
    }

    Editor.prototype.getMode = function(mode) {
      if (mode == null) {
        return this.currentMode;
      } else {
        return mode;
      }
    };

    Editor.prototype.registerEvents = function() {
      this.container.find("." + Editor.classes.button.switchEditor).on("click", this.handleSwitchEditor);
      $(this.container).parents("form").on("submit", this.handleFormSubmit);
    };

    Editor.prototype.create = function(m) {
      var mode;
      mode = this.getMode(m);
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
      }
      this.modes[mode].create();
    };

    Editor.prototype.show = function(m, full) {
      var mode;
      if (full == null) {
        full = true;
      }
      mode = this.getMode(m);
      if (this.modes[mode] == null) {
        this.create(mode);
      }
      this.modes[mode].show(full);
      this.currentMode = mode;
      this.valueFromForm(mode);
    };

    Editor.prototype.hide = function(m) {
      var mode;
      mode = this.getMode(m);
      this.modes[mode].hide();
      this.valueToForm(mode);
    };

    Editor.prototype.valueFromForm = function(m) {
      var mode;
      mode = this.getMode(m);
      this.modes[mode].valueFromForm();
    };

    Editor.prototype.valueToForm = function(m) {
      var mode;
      mode = this.getMode(m);
      this.modes[mode].valueToForm();
    };

    Editor.prototype.resizeToContainer = function() {
      if (this.modes.code) {
        this.modes.code.resize();
      }
    };

    Editor.prototype.resizeToContent = function() {
      this.container.find("." + Editor.classes.editor.content).css("height", this.textarea.attr("rows") * 1.5 + "em");
      if (this.modes.code) {
        this.modes.code.resize();
      }
    };

    Editor.prototype.enterFullscreen = function() {
      this.resizeToContainer();
    };

    Editor.prototype.exitFullscreen = function() {
      this.resizeToContent();
    };

    Editor.prototype.handleSwitchEditor = function(event) {
      var editorToSwitch;
      console.log("Editor.handleSwitchEditor");
      editorToSwitch = $(event.target).attr("data-editor");
      this.hide();
      return this.show(editorToSwitch);
    };

    Editor.prototype.handleFormSubmit = function() {
      return this.valueToForm();
    };

    return Editor;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Editor.CodeViewInterface = CodeViewInterface = (function() {
    function CodeViewInterface(editor) {
      this.editor = editor;
      this.view = null;
    }

    CodeViewInterface.prototype.create = function() {
      var object;
      console.log("CodeViewInterface.create");
      object = ace.edit(this.editor.name + "-ace-editor");
      object.getSession().setMode("ace/mode/" + this.editor.language);
      object.setTheme(user.editor.ace.theme);
      object.getSession().setUseWrapMode(user.editor.ace.wordWrap);
      object.setHighlightActiveLine(user.editor.ace.highlightActiveLine);
      object.setShowPrintMargin(user.editor.ace.showPrintMargin);
      object.setShowInvisibles(user.editor.ace.showInvisibles);
      object.setReadOnly(this.editor.readOnly);
      $("#" + this.editor.name + "-ace-editor").css("font-size", user.editor.ace.fontSize);
      return this.view = object;
    };

    CodeViewInterface.prototype.show = function(full) {
      console.log("CodeViewInterface.show");
      $("#" + this.editor.name + "-ace-editor").removeClass(Editor.classes.state.isHidden);
      if (full) {
        $("#" + this.editor.name + "-ace-editor").css("width", "100%");
      }
      return this.resize();
    };

    CodeViewInterface.prototype.hide = function() {
      console.log("CodeViewInterface.hide");
      return $("#" + this.editor.name + "-ace-editor").addClass(Editor.classes.state.isHidden);
    };

    CodeViewInterface.prototype.valueFromForm = function() {
      console.log("CodeViewInterface.valueFromForm");
      return this.view.setValue(this.editor.textarea.val(), -1);
    };

    CodeViewInterface.prototype.valueToForm = function() {
      console.log("CodeViewInterface.valueToForm");
      return this.editor.textarea.val(this.view.getValue());
    };

    CodeViewInterface.prototype.resize = function() {
      return this.view.resize();
    };

    return CodeViewInterface;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Editor.DesignViewInterface = DesignViewInterface = (function() {
    function DesignViewInterface(editor) {
      this.editor = editor;
      this.view = null;
    }

    DesignViewInterface.prototype.create = function() {
      var config, object, _ref;
      config = user.editor.ckeditor;
      config.customConfig = (_ref = config.customConfig) != null ? _ref : '';
      config.contentsCss = this.editor.stylesheets;
      console.log(config);
      object = CKEDITOR.replace(this.editor.name + "-editor", config);
      return this.view = object;
    };

    DesignViewInterface.prototype.show = function(full) {
      $("#cke_" + this.editor.name + "-editor").show();
      if (full) {
        $("#" + this.editor.name + "-ace-editor").css("width", "100%");
      }
    };

    DesignViewInterface.prototype.hide = function() {
      $("#cke_" + this.editor.name + "-editor").hide();
    };

    DesignViewInterface.prototype.valueFromForm = function() {
      return this.view.setData(this.editor.textarea.val());
    };

    DesignViewInterface.prototype.valueToForm = function() {
      return $("textarea[name=\"" + this.editor.name + "\"]").val(this.view.getData());
    };

    return DesignViewInterface;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Editor.PreviewInterface = PreviewInterface = (function() {
    function PreviewInterface(editor) {
      this.editor = editor;
      this.view = null;
    }

    PreviewInterface.prototype.create = function() {
      var element, preview;
      console.log("PreviewInterface.create");
      element = "<iframe id=\"" + this.editor.name + "-preview\" class=\"" + Editor.classes.editor.preview + "\"></iframe>";
      preview = $(element);
      preview.appendTo(this.editor.container.find(".Editor-content"));
      return this.view = preview;
    };

    PreviewInterface.prototype.show = function(full) {
      var head, stylesheet, _i, _len, _ref;
      console.log("PreviewInterface.show");
      $("#" + this.editor.name + "-preview").removeClass(Editor.classes.state.isHidden);
      if (full) {
        $("#" + this.editor.name + "-preview").css("width", "100%");
      }
      head = "";
      _ref = this.editor.stylesheets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stylesheet = _ref[_i];
        head += "<link rel=\"stylesheet\" href=\"" + stylesheet + "\">";
      }
      this.view.contents().find("head").html(head);
      return this.view.contents().find("html").addClass("no-js " + $("html").attr("class").replace("js ", ""));
    };

    PreviewInterface.prototype.hide = function() {
      console.log("PreviewInterface.hide");
      return $("#" + this.editor.name + "-preview").addClass(Editor.classes.state.isHidden);
    };

    PreviewInterface.prototype.valueFromForm = function() {
      console.log("PreviewInterface.valueFromForm");
      return this.view.contents().find("body").html(this.editor.textarea.val());
    };

    PreviewInterface.prototype.valueToForm = function() {};

    return PreviewInterface;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Editor.SplitViewInterface = SplitViewInterface = (function() {
    function SplitViewInterface(editor) {
      this.editor = editor;
      this.view = null;
    }

    SplitViewInterface.prototype.create = function() {
      return console.log("SplitViewInterface.create");
    };

    SplitViewInterface.prototype.show = function() {
      console.log("SplitViewInterface.show");
      this.editor.container.find("." + Editor.classes.editor.content).addClass(Editor.classes.state.contentIsSplit);
      this.editor.show("code", false);
      this.editor.show("preview", false);
      $("#" + this.editor.name + "-ace-editor, #" + this.editor.name + "-preview").css("width", "50%");
      return this.editor.modes.code.view.on("change", this.synchronize.bind(this));
    };

    SplitViewInterface.prototype.hide = function() {
      console.log("SplitViewInterface.hide");
      this.editor.container.find("." + Editor.classes.editor.content).removeClass(Editor.classes.state.contentIsSplit);
      this.editor.hide("code");
      return this.editor.hide("preview");
    };

    SplitViewInterface.prototype.valueFromForm = function() {};

    SplitViewInterface.prototype.valueToForm = function() {};

    SplitViewInterface.prototype.onChange = function() {
      return this.hasChanged = true;
    };

    SplitViewInterface.prototype.synchronize = function() {
      if (this.editor.currentMode === "split") {
        console.log("SplitViewInterface.synchronize");
        this.editor.valueToForm("code");
        this.editor.valueFromForm("preview");
        return this.hasChanged = false;
      }
    };

    return SplitViewInterface;

  })();

  Caman.DEBUG = true;

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.ImageEditor = ImageEditor = (function() {
    function ImageEditor(container) {
      this.handleControlChange = __bind(this.handleControlChange, this);
      this.saveActual = __bind(this.saveActual, this);
      this.handleSave = __bind(this.handleSave, this);
      this.handleReset = __bind(this.handleReset, this);
      this.handleMacroSubmit = __bind(this.handleMacroSubmit, this);
      this.handleRenderFinished = __bind(this.handleRenderFinished, this);
      this.handleBlockFinished = __bind(this.handleBlockFinished, this);
      this.container = container;
      this.image = this.container.find("." + ImageEditor.classes.layout.image);
      if (!this.image.length) {
        throw new Error("<img> element doesn't exist");
      }
      this.form = this.image.closest("form");
      this.progressBar = new ProgressBar(this.container.find("." + ImageEditor.classes.form.progressBar));
      this.fullscreenToggle = new FullscreenToggle(this.container.find("." + ImageEditor.classes.button.toggleFullscreen), this.container, (function() {}), (function() {}));
      this.simpleControls = this.container.find("." + ImageEditor.classes.form.control);
      this.container.find("." + ImageEditor.classes.button.submitMacro).on("click", this.handleMacroSubmit);
      this.container.find("." + ImageEditor.classes.button.reset).on("click", this.handleReset);
      this.container.find("." + ImageEditor.classes.button.save).on("click", this.handleSave);
      this.simpleControls.on("change", this.handleControlChange);
      this.setMacro(this.constructMacroFromString(""));
      this.process();
      Caman.Event.listen(this.caman, "blockFinished", this.handleBlockFinished);
      Caman.Event.listen(this.caman, "renderFinished", this.handleRenderFinished);

      /*jcrop_api = null
      @image.Jcrop({
          onChange: @.onChange
          onSelect: @.onSelect
          onRelease: @.onRelease
      }, () ->
              jcrop_api = this;
      );
       */
      ImageEditor.list.push(this);
      return;
    }

    ImageEditor.prototype.setMacro = function(object) {
      this.macro = object;
    };

    ImageEditor.prototype.process = function(revert) {
      if (revert == null) {
        revert = false;
      }
      console.log("ImageEditor.process()");
      this.progressBar.setup();
      this.blocksFinished = 0;
      if (revert) {
        this.caman.revert(false);
      }
      this.caman = Caman(this.image[0], this.macro["function"]);
    };

    ImageEditor.prototype.handleBlockFinished = function(job) {
      this.blocksFinished++;
      console.log(this.blocksFinished + " in " + job.totalBlocks * this.macro.stages);
      this.progressBar.transitionTo(this.blocksFinished, job.totalBlocks * this.macro.stages);
    };


    /*handleRevertBlockFinished: (job) =>
        console.log "RevertBlockFinished"
        return
     */

    ImageEditor.prototype.handleRenderFinished = function() {
      console.log("ImageEditor.handleRenderFinished()");
      this.progressBar.transitionTo(1, 1);
      this.progressBar.resetAfter(500);
      this.image = this.container.find("." + ImageEditor.classes.layout.image);
      if (!this.image.length) {
        throw new Error("<canvas> element doesn't exist");
      }
    };

    ImageEditor.prototype.handleMacroSubmit = function(event) {
      var value;
      value = this.container.find("." + ImageEditor.classes.form.macro).val();
      this.setMacro(this.constructMacroFromString(value));
      this.process();
    };

    ImageEditor.prototype.handleReset = function(event) {
      if (this.caman) {
        this.caman.reset(false);
        new Notification({
          content: "Reset Successful",
          status: "success"
        });
      } else {
        new Notification({
          content: "Nothing to Reset",
          status: "failed"
        });
      }
      this.simpleControls.each(function(index, value) {
        $(value).val(0);
      });
    };

    ImageEditor.prototype.handleSave = function(event) {
      var type;
      type = this.form.find("[name=type]").val();
      console.log(type);
      this.caman.canvas.toBlob(this.saveActual, type);
    };

    ImageEditor.prototype.saveActual = function(blob) {
      var formData, upload;
      formData = Form.getFormDataObject(this.form);
      formData.append("image", blob);
      upload = new Upload(this.container.find("." + ImageEditor.classes.form.progressBar), this.form, formData);
      upload.send();
    };

    ImageEditor.prototype.handleControlChange = function(event) {
      var values;
      values = [];
      this.simpleControls.each(function(index, value) {
        var element;
        element = $(value);
        values[element.attr("data-controls")] = element.val();
      });
      this.setMacro(this.constructMacroFromValues(values));
      console.log(this.macro);
      this.process(true);
    };

    ImageEditor.prototype.constructMacroFromValues = function(values) {
      var name, string, _i, _len, _ref;
      string = "";
      _ref = ImageEditor.controls;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        if (values[name] !== "0") {
          string += "." + name + ("(" + values[name] + ")");
        }
      }
      return this.constructMacroFromString(string);
    };

    ImageEditor.prototype.constructMacroFromString = function(string) {
      string = string.trim();
      if (string.length > 1 && string.charAt(0) !== ".") {
        string = "." + string;
      }
      return this.constructMacroFromRaw("this" + string + ".render();");
    };

    ImageEditor.prototype.constructMacroFromRaw = function(functionBody) {
      var e, full, stages;
      full = "try {" + functionBody + "} catch(e) { new Oxygen.Notification({ content: \"Invalid Macro\", status: \"failed\", log: e }); }";
      stages = functionBody.match(/\./g).length - 1;
      try {
        return {
          stages: stages,
          "function": new Function(full)
        };
      } catch (_error) {
        e = _error;
        new Notification({
          content: "Invalid Macro Syntax",
          status: "failed",
          log: {
            exception: e,
            macro: full
          }
        });
      }
    };

    ImageEditor.list = [];

    ImageEditor.initialize = function() {
      $("." + ImageEditor.classes.layout.container).each(function() {
        new ImageEditor($(this));
      });
    };

    ImageEditor.classes = {
      layout: {
        container: "ImageEditor",
        image: "ImageEditor-image"
      },
      button: {
        submitMacro: "ImageEditor-submitMacro",
        reset: "ImageEditor-reset",
        save: "ImageEditor-save",
        toggleFullscreen: "ImageEditor-toggleFullscreen"
      },
      form: {
        control: "ImageEditor-control",
        progressBar: "ImageEditor-progress",
        macro: "ImageEditor-macro"
      }
    };

    ImageEditor.controls = ["brightness", "contrast", "saturation", "vibrance", "exposure", "hue", "sepia", "gamma", "noise", "clip", "sharpen", "stackBlur"];

    return ImageEditor;

  })();

  Oxygen.initLogin = function() {
    var loginForm;
    loginForm = $(".Login-form").addClass("Login--noTransition").addClass("Login--slideDown");
    loginForm[0].offsetHeight;
    loginForm.removeClass("Login--noTransition");
    setTimeout(function() {
      $("body").removeClass("Login--isHidden");
    }, 500);
    $(".Login-scrollDown").on("click", function() {
      $(".Login-message").addClass("Login--slideUp");
      loginForm.removeClass("Login--slideDown");
      $(".Login-background--blur").addClass("Login--isHidden");
    });
    loginForm.on("submit", function() {
      loginForm.addClass("Login--slideUp");
    });
    Ajax.handleErrorCallback = function() {
      loginForm.removeClass("Login--slideUp");
    };
    Ajax.handleSuccessCallback = function(data) {
      console.log(data);
      if (data.status === "failed") {
        loginForm.removeClass("Login--slideUp");
      }
    };
  };

  MainNav.headroom();

  Oxygen.init = function() {
    setTimeout(Notification.initializeExistingMessages, 250);
    Dialog.registerEvents();
    if (typeof editors !== "undefined" && editors !== null) {
      Editor.createEditors(editors);
    }
    ImageEditor.initialize();
    if ($(".Login-form").length > 0) {
      Oxygen.initLogin();
    }
    Dropdown.registerEvents();
    Form.findAll();
    Upload.registerEvents();
    TabSwitcher.findAll();
    Slider.findAll();
  };

  Oxygen.init();


  /*Oxygen.smoothState = $("#page").smoothState({
      anchors: ".Link--smoothState"
      onStart: {
          duration: 250
          render: (url, container) ->
              Oxygen.smoothState.toggleAnimationClass('Page--isExiting')
              $("html, body").animate({ scrollTop: 0 })
              return
      },
      onEnd: {
          duration: 0
          render: (url, container, content) ->
              $("html, body").css('cursor', 'auto');
              $("html, body").find('a').css('cursor', 'auto');
              container.html(content);
              return
               *Oxygen.init()
      }
  }).data('smoothState');
   */

}).call(this);
