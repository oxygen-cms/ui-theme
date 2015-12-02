(function() {
  var Ajax, CodeViewInterface, DesignViewInterface, Dialog, Dropdown, EditableList, Editor, Form, FullscreenToggle, ImageEditor, MainNav, Notification, Preferences, PreviewInterface, ProgressBar, Slider, SmoothState, SplitViewInterface, TabSwitcher, Toggle, Upload, base64Encode, progressThemes, smoothState, theme, _i, _len,
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
      return this.sendAjax("GET", $(event.target).attr("href"), null);
    };

    Ajax.handleSuccess = function(data) {
      console.log(data);
      if (data.redirect) {
        if (smoothState && !(data.hardRedirect === true)) {
          smoothState.load(data.redirect, false);
        } else {
          window.location.replace(data.redirect);
        }
      }
      new Notification(data);
      return Ajax.handleSuccessCallback(data);
    };

    Ajax.handleError = function(response, textStatus, errorThrown) {
      var content, e;
      if (response.readyState === 0) {
        console.error(response);
        new Notification({
          content: "Cannot connect to the server",
          status: "info"
        });
        return;
      }
      try {
        content = $.parseJSON(response.responseText);
        if (content.content) {
          new Notification(content);
        } else {
          console.error(content);
          new Notification({
            content: "Exception of type <code class=\"no-wrap\">" + content.error.type + "</code> with message <code class=\"no-wrap\">" + content.error.message + "</code> thrown at <code class=\"no-wrap\">" + content.error.file + ":" + content.error.line + "</code>",
            status: "failed"
          });
        }
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
      autoSubmit: "Form--autoSubmit",
      taggableInput: ".Form-taggable"
    };

    Form.findAll = function(container) {
      container.find("form").each(function() {
        return Form.list.push(new Form($(this)));
      });
      return container.find(Form.classes.taggableInput).tagging({
        "edit-on-delete": false
      });
    };

    Form.registerKeydownHandler = function() {
      return $(document).on("keydown", Form.handleKeydown);
    };

    Form.handleKeydown = function() {
      var form, newList, _i, _len, _ref;
      if ((event.ctrlKey || event.metaKey) && event.which === 83) {
        newList = [];
        _ref = Form.list;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          form = _ref[_i];
          if (document.contains(form.form[0])) {
            newList.push(form);
            if (form.form.hasClass(Form.classes.submitOnKeydown)) {
              form.form.submit();
              event.preventDefault();
            }
          }
        }
        return Form.list = newList;
      }
    };

    function Form(element) {
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
      if (this.form.hasClass(Form.classes.autoSubmit)) {
        this.form.find('button[type="submit"]')[0].click();
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

    Form.getFormData = function(form) {
      var data;
      data = {};
      form.find("[name]").each(function() {
        var name, value;
        name = $(this).attr("name");
        value = $(this).val();
        if ($(this).is("[type=\"checkbox\"]") && !$(this).is(":checked")) {
          return;
        }
        if (name.endsWith("[]")) {
          name = name.slice(0, -2);
          if (data[name] === void 0) {
            data[name] = [];
          }
          return data[name].push(value);
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
      return setTimeout(function() {
        fill.css("width", "0");
        return setTimeout(function() {
          fill.removeClass(ProgressBar.classes.noTransition);
          return callback();
        }, 5);
      }, 5);
    };

    ProgressBar.prototype.resetAfter = function(time) {
      return setTimeout(this.reset.bind(this), time);
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

    Dropdown.registerGlobalEvent = function() {
      return $(document).on("click", this.handleGlobalClick.bind(this));
    };

    Dropdown.registerEvents = function(container) {
      return container.find("." + this.classes.dropdownToggle).on("click", this.handleClick.bind(this));
    };

    Dropdown.handleClick = function(event) {
      var container, dropdown;
      container = $(event.target);
      while (!container.hasClass(this.classes.dropdownToggle)) {
        if (container.is("a[href], form")) {
          return;
        }
        container = container.parent();
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
        console.log("Invalid Arguments For New Notification");
        console.log(options);
      }
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

    TabSwitcher.findAll = function(container) {
      return container.find("." + TabSwitcher.classes.tabs).each(function() {
        var tabs;
        tabs = $(this);
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
    };

    function TabSwitcher(tabs, container) {
      this.handleClick = __bind(this.handleClick, this);
      this.tabs = tabs;
      this.container = container;
      this.findDefault();
      this.registerEvents();
    }

    TabSwitcher.prototype.findDefault = function() {
      var tab;
      tab = this.tabs.children("[data-default-tab]").attr("data-switch-to-tab");
      return this.setTo(tab);
    };

    TabSwitcher.prototype.registerEvents = function() {
      return this.tabs.children("[data-switch-to-tab]").on("click", this.handleClick);
    };

    TabSwitcher.prototype.handleClick = function(event) {
      var tab;
      tab = $(event.currentTarget).attr("data-switch-to-tab");
      return this.setTo(tab);
    };

    TabSwitcher.prototype.setTo = function(tab) {
      this.current = tab;
      this.container.children("[data-tab]").removeClass(TabSwitcher.classes.active);
      this.container.children("[data-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active);
      this.tabs.children("[data-switch-to-tab]").removeClass(TabSwitcher.classes.active);
      return this.tabs.children("[data-switch-to-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active);
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

    Upload.registerEvents = function(container) {
      return container.find(Upload.selectors.uploadElement).on("dragover", Upload.handleDragOver).on("dragleave", Upload.handleDragLeave).on("drop", Upload.handleDrop).find("input[type=file]").on("change", Upload.handleChange);
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

    Slider.findAll = function(container) {
      return container.find(Slider.selectors.slider).each(function() {
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

    Dialog.registerEvents = function(container) {
      container.find("[data-dialog-type=\"confirm\"]").on("click", this.handleConfirmClick);
      return container.find("[data-dialog-type=\"alert\"]").on("click", this.handleAlertClick);
    };

    Dialog.handleAlertClick = function(event) {
      var target;
      target = $(event.currentTarget);
      return vex.dialog.alert(target.attr("data-dialog-message"));
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

  window.Oxygen.SmoothState = SmoothState = (function() {
    function SmoothState() {
      this.onAfter = __bind(this.onAfter, this);
      this.onReady = __bind(this.onReady, this);
      this.onProgress = __bind(this.onProgress, this);
      this.onStart = __bind(this.onStart, this);
    }

    SmoothState.prototype.loading = false;

    SmoothState.prototype.init = function() {
      return this.smoothState = $("#page").smoothState({
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
    };

    SmoothState.prototype.onStart = function(container) {
      var elements;
      $("html, body").animate({
        scrollTop: 0
      });
      this.loading = true;
      elements = $('.Block');
      $(elements.get().reverse()).each(function(index) {
        var block, timeout;
        block = $(this);
        timeout = index * 100;
        return setTimeout(function() {
          return block.addClass('Block--isExiting');
        }, timeout);
      });
      return setTimeout((function(_this) {
        return function() {
          if (_this.loading) {
            return $(".pace-activity").addClass("pace-activity-active");
          }
        };
      })(this), elements.length * 100);
    };

    SmoothState.prototype.onProgress = function(container) {
      return $("html, body").css('cursor', 'wait').find('a').css('cursor', 'wait');
    };

    SmoothState.prototype.onReady = function(container, content) {
      $("html, body").css('cursor', 'auto').find('a').css('cursor', 'auto');
      Oxygen.reset();
      container.hide();
      container.html(content);
      $(".pace-activity").removeClass("pace-activity-active");
      $('.Block').each(function(index) {
        var block, timeout;
        block = $(this);
        timeout = index * 100;
        block.addClass('Block--isHidden');
        return setTimeout(function() {
          block.removeClass('Block--isHidden');
          block.addClass('Block--isEntering');
          return setTimeout(function() {
            return block.removeClass('Block--isEntering');
          }, 350);
        }, timeout);
      });
      return container.show();
    };

    SmoothState.prototype.onAfter = function($container, $content) {
      this.loading = false;
      $(".pace-activity").removeClass("pace-activity-active");
      return Oxygen.init($("#page"));
    };

    SmoothState.prototype.setTheme = function(theme) {
      return $("#page").addClass('Page-transition--' + theme);
    };

    SmoothState.prototype.load = function(url, push) {
      return this.smoothState.load(url, push);
    };

    return SmoothState;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.Preferences = Preferences = (function() {
    function Preferences() {}

    Preferences.setPreferences = function(preferences) {
      return Preferences.preferences = preferences;
    };

    Preferences.get = function(key, fallback) {
      var current, i, l, last, o, parts;
      if (fallback == null) {
        fallback = null;
      }
      o = Preferences.preferences;
      if (o == null) {
        return fallback;
      }
      parts = key.split('.');
      last = parts.pop();
      l = parts.length;
      i = 1;
      current = parts[0];
      while ((o = o[current]) && i < l) {
        current = parts[i];
        i++;
      }
      if (o) {
        return o[last];
      } else {
        return fallback;
      }
    };

    Preferences.has = function(key) {
      var current, i, l, last, o, parts;
      o = Preferences.preferences;
      if (!o) {
        return false;
      }
      parts = key.split('.');
      last = parts.pop();
      l = parts.length;
      i = 1;
      current = parts[0];
      while ((o = o[current]) && i < l) {
        current = parts[i];
        i++;
      }
      if (o) {
        return true;
      } else {
        return false;
      }
    };

    return Preferences;

  })();

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.EditableList = EditableList = (function() {
    function EditableList() {}

    EditableList.classes = {
      container: "EditableList",
      template: "EditableList-template",
      row: "EditableList-row",
      remove: "EditableList-remove",
      add: "EditableList-add"
    };

    EditableList.registerEvents = function(container) {
      container.find("." + EditableList.classes.add).on("click", EditableList.handleAdd);
      return container.on("click", "." + EditableList.classes.remove, EditableList.handleRemove);
    };

    EditableList.handleAdd = function(event) {
      var container, template;
      container = $(event.currentTarget).siblings("." + EditableList.classes.container);
      template = container.find("." + EditableList.classes.template);
      template = template.clone().removeClass(EditableList.classes.template);
      console.log(template);
      container.append(template);
      return console.log('add');
    };

    EditableList.handleRemove = function(event) {
      var row;
      row = $(event.currentTarget).closest("." + EditableList.classes.row);
      row.remove();
      return console.log('remove');
    };

    return EditableList;

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
      object = ace.edit(this.editor.name + "-ace-editor");
      object.getSession().setMode("ace/mode/" + this.editor.language);
      object.setTheme(Preferences.get('editor.ace.theme'));
      object.getSession().setUseWrapMode(Preferences.get('editor.ace.wordWrap'));
      object.setHighlightActiveLine(Preferences.get('user.editor.ace.highlightActiveLine'));
      object.setShowPrintMargin(Preferences.get('editor.ace.showPrintMargin'));
      object.setShowInvisibles(Preferences.get('editor.ace.showInvisibles'));
      object.setReadOnly(this.editor.readOnly);
      $("#" + this.editor.name + "-ace-editor").css("font-size", Preferences.get('editor.ace.fontSize'));
      return this.view = object;
    };

    CodeViewInterface.prototype.show = function(full) {
      $("#" + this.editor.name + "-ace-editor").removeClass(Editor.classes.state.isHidden);
      if (full) {
        $("#" + this.editor.name + "-ace-editor").css("width", "100%");
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.resize();
        };
      })(this), 300);
    };

    CodeViewInterface.prototype.hide = function() {
      console.log("CodeViewInterface.hide");
      return $("#" + this.editor.name + "-ace-editor").addClass(Editor.classes.state.isHidden);
    };

    CodeViewInterface.prototype.valueFromForm = function() {
      return this.view.setValue(this.editor.textarea.val(), -1);
    };

    CodeViewInterface.prototype.valueToForm = function() {
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
      var config, object;
      config = Preferences.get('editor.ckeditor', {});
      config.customConfig = config.customConfig || '';
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
      var preview;
      preview = $("<iframe id=\"" + this.editor.name + "-preview\" class=\"" + Editor.classes.editor.preview + "\"></iframe>");
      preview.appendTo(this.editor.container.find(".Editor-content"));
      return this.view = preview;
    };

    PreviewInterface.prototype.show = function(full) {
      var head, stylesheet, _i, _len, _ref;
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
      return $("#" + this.editor.name + "-preview").addClass(Editor.classes.state.isHidden);
    };

    PreviewInterface.prototype.valueFromForm = function() {
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

    SplitViewInterface.prototype.create = function() {};

    SplitViewInterface.prototype.show = function() {
      this.editor.container.find("." + Editor.classes.editor.content).addClass(Editor.classes.state.contentIsSplit);
      this.editor.show("code", false);
      this.editor.show("preview", false);
      $("#" + this.editor.name + "-ace-editor, #" + this.editor.name + "-preview").css("width", "50%");
      return this.editor.modes.code.view.on("change", this.synchronize.bind(this));
    };

    SplitViewInterface.prototype.hide = function() {
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

  window.Oxygen || (window.Oxygen = {});

  window.Oxygen.ImageEditor = ImageEditor = (function() {
    function ImageEditor(container) {
      this.handleResizeInputChange = __bind(this.handleResizeInputChange, this);
      this.handleCropRelease = __bind(this.handleCropRelease, this);
      this.handleCropInputChange = __bind(this.handleCropInputChange, this);
      this.handleCropSelect = __bind(this.handleCropSelect, this);
      this.handleCropDisable = __bind(this.handleCropDisable, this);
      this.handleCropEnable = __bind(this.handleCropEnable, this);
      this.onRequestEnd = __bind(this.onRequestEnd, this);
      this.handleSave = __bind(this.handleSave, this);
      this.handlePreview = __bind(this.handlePreview, this);
      var that;
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
      that = this;
      this.image[0].onload = function() {
        console.log('Image Loaded');
        if (that.imageDimensions == null) {
          that.imageDimensions = {
            cropX: 0,
            cropY: 0
          };
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
      this.fullscreenToggle = new FullscreenToggle(this.container.find("." + ImageEditor.classes.button.toggleFullscreen), this.container, (function() {}), (function() {}));
      this.container.find("." + ImageEditor.classes.button.apply).on("click", this.handlePreview);
      this.container.find("." + ImageEditor.classes.button.save).on("click", this.handleSave);
      this.container.find("." + ImageEditor.classes.form.crop).on("change", this.handleCropInputChange);
      this.container.find("." + ImageEditor.classes.form.resize).on("change", this.handleResizeInputChange);
      this.jCropApi = null;
      this.cropDisableCounter = 2;
    }

    ImageEditor.prototype.handlePreview = function() {
      this.applyChanges(this.gatherData());
      return this.progressNotification = new Notification({
        content: "Processing Image",
        status: "success"
      });
    };

    ImageEditor.prototype.handleSave = function() {
      var data;
      data = this.gatherData();
      data.save = true;
      data.name = this.fields.name.val();
      data.slug = this.fields.slug.val();
      this.applyChanges(data);
      return this.progressNotification = new Notification({
        content: "Saving Image",
        status: "success"
      });
    };

    ImageEditor.prototype.gatherData = function() {
      var mode;
      mode = TabSwitcher.list[0].current;
      switch (mode) {
        case "simple":
          return this.getSimpleData();
        case "advanced":
          return this.getAdvancedData();
        default:
          return {};
      }
    };

    ImageEditor.prototype.getSimpleData = function() {
      return this.removeDefaultFields(Form.getFormData(this.forms.simple));
    };

    ImageEditor.prototype.removeDefaultFields = function(formData) {
      var defaults, item, key, resize;
      resize = (function(_this) {
        return function(formData) {
          return (!formData["resize[width]"] || formData["resize[width]"] === _this.imageDimensions.naturalWidth.toString()) && (!formData["resize[height]"] || formData["resize[height]"] === _this.imageDimensions.naturalHeight.toString());
        };
      })(this);
      defaults = {
        "fit[position]": (function(_this) {
          return function(item) {
            return item === "center";
          };
        })(this),
        "resize[width]": (function(_this) {
          return function(item, formData) {
            return resize(formData);
          };
        })(this),
        "resize[height]": (function(_this) {
          return function(item, formData) {
            return resize(formData);
          };
        })(this),
        "resize[keepAspectRatio]": (function(_this) {
          return function(item, formData) {
            return resize(formData);
          };
        })(this),
        "gamma": (function(_this) {
          return function(item) {
            return item === "1";
          };
        })(this),
        "greyscale": (function(_this) {
          return function(item) {
            return item === "false";
          };
        })(this),
        "invert": (function(_this) {
          return function(item) {
            return item === "false";
          };
        })(this),
        "rotate[backgroundColor]": (function(_this) {
          return function(item) {
            return item === "#ffffff";
          };
        })(this),
        "crop[x]": (function(_this) {
          return function(item) {
            return _this.imageDimensions.cropX = item === "" ? 0 : parseInt(item);
          };
        })(this),
        "crop[y]": (function(_this) {
          return function(item) {
            return _this.imageDimensions.cropY = item === "" ? 0 : parseInt(item);
          };
        })(this)
      };
      for (key in formData) {
        item = formData[key];
        if (defaults[key] && defaults[key](item, formData)) {
          delete formData[key];
        } else if (item === "0" || item === "") {
          delete formData[key];
        }
      }
      return formData;
    };

    ImageEditor.prototype.getAdvancedData = function() {
      return JSON.parse(this.fields.macro.val());
    };

    ImageEditor.prototype.applyChanges = function(data) {
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
        error: (function(_this) {
          return function() {
            _this.progressNotification.hide();
            return Ajax.handleError();
          };
        })(this),
        xhr: (function(_this) {
          return function() {
            var object;
            object = window.ActiveXObject ? new ActiveXObject("XMLHttp") : new XMLHttpRequest();
            object.overrideMimeType("text/plain; charset=x-user-defined");
            return object;
          };
        })(this)
      });
      return this.applyingChanges = true;
    };

    ImageEditor.prototype.onRequestEnd = function(response, status, request) {
      this.applyingChanges = false;
      this.progressNotification.hide();
      if (this.jCropApi != null) {
        this.jCropApi.destroy();
      }
      this.jCropApi = null;
      this.forms.simple.attr("data-changed", false);
      this.forms.advanced.attr("data-changed", false);
      return this.image[0].src = "data:image/jpeg;base64," + base64Encode(response);
    };

    ImageEditor.prototype.handleCropEnable = function() {
      var that;
      if ((this.jCropApi != null)) {
        return this.jCropApi.enable();
      } else {
        that = this;
        return this.image.Jcrop({
          onChange: this.handleCropSelect,
          onSelect: this.handleCropSelect,
          onRelease: this.handleCropRelease
        }, function() {
          return that.jCropApi = this;
        });
      }
    };

    ImageEditor.prototype.handleCropDisable = function() {
      return this.jCropApi.disable();
    };

    ImageEditor.prototype.handleCropSelect = function(c) {
      if (this.cropDisableCounter > 1) {
        this.fields.crop.x.val(Math.round(c.x / this.imageDimensions.width * this.imageDimensions.naturalWidth + this.imageDimensions.cropX));
        this.fields.crop.y.val(Math.round(c.y / this.imageDimensions.height * this.imageDimensions.naturalHeight + this.imageDimensions.cropY));
        this.fields.crop.width.val(Math.round(c.w / this.imageDimensions.width * this.imageDimensions.naturalWidth));
        return this.fields.crop.height.val(Math.round(c.h / this.imageDimensions.height * this.imageDimensions.naturalHeight));
      } else {
        return this.cropDisableCounter++;
      }
    };

    ImageEditor.prototype.handleCropInputChange = function() {
      var x, y;
      if (this.jCropApi == null) {
        return;
      }
      x = this.fields.crop.x.val() / this.imageDimensions.naturalWidth * this.imageDimensions.width - this.imageDimensions.cropX;
      y = this.fields.crop.y.val() / this.imageDimensions.naturalHeight * this.imageDimensions.height - this.imageDimensions.cropY;
      this.cropDisableCounter = 0;
      return this.jCropApi.setSelect([x, y, x + this.fields.crop.width.val() / this.imageDimensions.naturalWidth * this.imageDimensions.width, y + this.fields.crop.height.val() / this.imageDimensions.naturalHeight * this.imageDimensions.height]);
    };

    ImageEditor.prototype.handleCropRelease = function() {
      this.fields.crop.x.val(0);
      this.fields.crop.y.val(0);
      this.fields.crop.width.val(0);
      return this.fields.crop.height.val(0);
    };

    ImageEditor.prototype.handleResizeInputChange = function(e) {
      var name, value;
      if (this.fields.resize.keepAspectRatio[0].checked) {
        name = e.target.name;
        value = $(e.target).val();
        console.log(name, value);
        if (name === 'resize[width]') {
          return this.fields.resize.height.val(Math.round(value / this.imageDimensions.ratio));
        } else {
          return this.fields.resize.width.val(Math.round(value * this.imageDimensions.ratio));
        }
      }
    };

    ImageEditor.list = [];

    ImageEditor.initialize = function(container) {
      return container.find("." + ImageEditor.classes.layout.container).each(function() {
        return ImageEditor.list.push(new ImageEditor($(this)));
      });
    };

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

    return ImageEditor;

  })();

  base64Encode = function(inputStr) {
    var b64, byte1, byte2, byte3, enc1, enc2, enc3, enc4, i, outputStr;
    b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    outputStr = "";
    i = 0;
    while (i < inputStr.length) {
      byte1 = inputStr.charCodeAt(i++) & 0xff;
      byte2 = inputStr.charCodeAt(i++) & 0xff;
      byte3 = inputStr.charCodeAt(i++) & 0xff;
      enc1 = byte1 >> 2;
      enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
      enc3 = void 0;
      enc4 = void 0;
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

  if (typeof user !== "undefined" && user !== null) {
    Preferences.setPreferences(user);
  }

  Oxygen.reset = function() {
    window.editors = [];
    Oxygen.load = [];
    return Dropdown.handleGlobalClick({
      target: document.body
    });
  };

  Oxygen.init = function(container) {
    var callback, _i, _len, _ref, _results;
    setTimeout(Notification.initializeExistingMessages, 250);
    Dialog.registerEvents(container);
    if (typeof editors !== "undefined" && editors !== null) {
      Editor.createEditors(editors);
    }
    ImageEditor.initialize(container);
    if ($(".Login-form").length > 0) {
      Oxygen.initLogin();
    }
    Dropdown.registerEvents(container);
    EditableList.registerEvents(container);
    Form.findAll(container);
    Upload.registerEvents(container);
    TabSwitcher.findAll(container);
    Slider.findAll(container);
    Oxygen.load = Oxygen.load || [];
    _ref = Oxygen.load;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      _results.push(callback());
    }
    return _results;
  };

  Oxygen.init($(document));

  if (Preferences.get('pageLoad.smoothState.enabled', true) === true) {
    smoothState = new SmoothState();
    smoothState.init();
    smoothState.setTheme(Preferences.get('pageLoad.smoothState.theme', 'slide'));
  }

  progressThemes = Preferences.get('pageLoad.progress.theme', ["minimal", "spinner"]);

  for (_i = 0, _len = progressThemes.length; _i < _len; _i++) {
    theme = progressThemes[_i];
    $(document.body).addClass("Page-progress--" + theme);
  }

  Form.registerKeydownHandler();

  Dropdown.registerGlobalEvent();

}).call(this);
