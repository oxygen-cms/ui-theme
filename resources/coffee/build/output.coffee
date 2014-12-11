# ================================
#            AjaxRequest
# ================================

window.Oxygen or= {}
window.Oxygen.Ajax = class Ajax

    @handleErrorCallback = (() -> )
    @handleSuccessCallback = (() -> )

    @sendAjax: (type, url, data) ->
        $.ajax({
            dataType: "json"
            type: type
            url: url
            data: data
            success: @handleSuccess
            error: @handleError
        })
        return

    # fires a link via ajax
    @fireLink: (event) ->
        event.preventDefault();
        @sendAjax("GET", $(event.target).attr("href"), null)

    # handles a successful response
    @handleSuccess: (data) =>
        console.log(data)

        if(data.redirect)
            if smoothState && !(data.hardRedirect == true)
                smoothState.load(data.redirect, false, true) # ignores the cache
            else
                window.location.replace(data.redirect)

        new Notification(data);

        @handleSuccessCallback(data)

    # handles an error during an ajax request
    @handleError: (response, textStatus, errorThrown) =>
        # try to build a flash message from the error response
        try
            content = $.parseJSON(response.responseText)

            console.error(content)

            new Notification({
                content:
                    "Exception of type <code class=\"no-wrap\">" + content.error.type +
                    "</code>with message <code class=\"no-wrap\">" + content.error.message +
                    "</code>thrown at <code class=\"no-wrap\">" + content.error.file + ":" + content.error.line +
                    "</code>"
                status: "failed"
            })
        catch e
            console.error(response.responseText)

            new Notification({
                content: "Whoops, looks like something went wrong."
                status: "failed"
            });

        @handleErrorCallback(response, textStatus, errorThrown)
        return

# ================================
#              Form
# ================================

#
# The Form helper can:
# - display a message upon exit if there are any unsaved changes.
# - send an ajax request with the form data on submit or change
#

window.Oxygen or= {}
window.Oxygen.Form = class Form

    @list = []

    @messages =
        confirmation: "You have made changes to this form.<br>Are you sure you want to exit?"

    @classes =
        warnBeforeExit: "Form--warnBeforeExit"
        submitOnKeydown: "Form--submitOnKeydown"
        sendAjax: "Form--sendAjax"
        sendAjaxOnChange: "Form--sendAjaxOnChange"
        autoSubmit: "Form--autoSubmit",
        taggableInput: ".Form-taggable"

    @findAll: ->
        $("form").each ->
            Form.list.push new Form($(@))

        $(Form.classes.taggableInput).tagging();

    constructor: (element) ->
        @form = element
        @registerEvents()

    registerEvents: ->
        # Exit Dialog
        if @form.hasClass(Form.classes.warnBeforeExit)
            @form.find(":input").on("input change", @handleChange) # sets [data-changed="true"]
            @form.on("submit", @handleSave) # sets [data-changed="false"]
            $("a, button[type=\"submit\"]").on("click", @handleExit) # displays exit dialog

        # Submit via AJAX
        @form.on("submit", @sendAjax)  if @form.hasClass(Form.classes.sendAjax)
        @form.on("change", @sendAjax)  if @form.hasClass(Form.classes.sendAjaxOnChange)

        # Control/Command S to save
        if @form.hasClass(Form.classes.submitOnKeydown)
            $(document.body).on("keydown", @handleKeydown)

        # Auto Submit
        if @form.hasClass(Form.classes.autoSubmit)
            @form.find('button[type="submit"]')[0].click();
        return

    handleChange: (event) =>
        @form.attr("data-changed", true)
        console.log("Form Changed")
        return

    handleSave: (event) =>
        @form.attr("data-changed", false)
        console.log("Form Saved")
        return

    handleExit: (event) =>
        if @form.attr("data-changed") == "true"
            return if $(event.currentTarget).hasClass("Form-submit")
            Dialog.handleConfirmClick(event, {
                message: Form.messages.confirmation
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, text: 'Discard Changes')
                    $.extend({}, vex.dialog.buttons.NO, text: 'Cancel')
                ]
            })
        return

    sendAjax: (event) =>
        event.preventDefault()
        Ajax.sendAjax(@form.attr("method"), @form.attr("action"), Form.getFormData(@form))
        return

    handleKeydown: (event) =>
        if (event.ctrlKey or event.metaKey) and event.which is 83
            @form.submit()
            event.preventDefault()
        return

    @getFormData: (form) ->
        data = {}
        form.find("[name]").each ->
            name = $(this).attr("name")
            value = $(this).val()

            if $(this).is("[type=\"checkbox\"]")
                data[name] = value  if $(this).is(":checked")
            else
                data[name] = value

        return data

    @getFormDataObject: (form) ->
        data = new FormData();
        form.find("[name]").each ->
            name = $(this).attr("name")
            value = $(this).val()

            if $(this).is("[type=\"checkbox\"]")
                data.append(name, value)  if $(this).is(":checked")
            else
                data.append(name, value)

        return data

# ================================
#             Toggle
# ================================

window.Oxygen or= {}
window.Oxygen.Toggle = class Toggle
    
    @classes =
       ifEnabled:  "Toggle--ifEnabled"
       ifDisabled: "Toggle--ifDisabled"

    constructor: (toggle, enableCallback, disableCallback) ->
        @toggle = toggle
        @enableCallback = enableCallback
        @disableCallback = disableCallback

        @registerEvents();

    registerEvents: () ->
        @toggle.on("click", @handleToggle.bind(this))
        @toggle.attr("data-enabled", "false")

    handleToggle: () ->
        if @toggle.attr("data-enabled") == "true"
            @toggle.attr("data-enabled", "false")
            @disableCallback()
        else
            @toggle.attr("data-enabled", "true")
            @enableCallback()

# ================================
#        FullscreenToggle
# ================================

window.Oxygen or= {}
window.Oxygen.FullscreenToggle = class FullscreenToggle extends Toggle

    constructor: (toggle, fullscreenElement, enterFullscreenCallback, exitFullscreenCallback) ->
        @toggle = toggle
        @fullscreenElement = fullscreenElement
        @enableCallback = @enterFullscreen
        @disableCallback = @exitFullscreen
        @enterFullscreenCallback = enterFullscreenCallback
        @exitFullscreenCallback = exitFullscreenCallback

        @registerEvents();

    enterFullscreen: () =>
        @fullscreenElement.addClass("FullscreenToggle--isFullscreen");
        $(document.body).addClass("Body--noScroll")

        e = document.body
        if e.requestFullscreen
            e.requestFullscreen();
        else if e.mozRequestFullScreen
            e.mozRequestFullScreen();
        else if e.webkitRequestFullscreen
            e.webkitRequestFullscreen();
        else if e.msRequestFullscreen
            e.msRequestFullscreen();

        @enterFullscreenCallback()
        return

    exitFullscreen: () =>
        @fullscreenElement.removeClass("FullscreenToggle--isFullscreen");
        $(document.body).removeClass("Body--noScroll")

        if document.exitFullscreen
            document.exitFullscreen();
        else if document.mozCancelFullScreen
            document.mozCancelFullScreen();
        else if document.webkitExitFullscreen
            document.webkitExitFullscreen();

        @exitFullscreenCallback()
        return


# ================================
#          ProgressBar
# ================================

window.Oxygen or= {}
window.Oxygen.ProgressBar = class ProgressBar

    # -----------------
    #       Static
    # -----------------

    @classes =
        container: "ProgressBar"
        fill: "ProgressBar-fill"
        noTransition: "ProgressBar-fill--jump"
        message: "ProgressBar-message"
        itemMessage: "ProgressBar-message-item"
        sectionCount: "ProgressBar-message-section-count"
        sectionMessage: "ProgressBar-message-section-message"

    # -----------------
    #       Object
    # -----------------

    constructor: (element) ->
        @container = element
        @fill = @container.find("." + ProgressBar.classes.fill)
        @message = @container.parent().find("." + ProgressBar.classes.message)
        @itemMessage = @message.find("." + ProgressBar.classes.itemMessage)
        @sectionCount = @message.find("." + ProgressBar.classes.sectionCount)
        @sectionMessage = @message.find("." + ProgressBar.classes.sectionMessage)
        @setup()

    setup: () ->
        @fill.css("opacity", "1")

    transitionTo: (value, total) ->
        percentage = Math.round(value / total * 100)
        percentage = 100  if percentage > 100
        @fill.css("width", percentage + "%")
        return

    setMessage: (message) ->
        @message.show()
        @itemMessage.html(message);
        return

    setSectionCount: (count) ->
        @message.show()
        @sectionCount.html(count);
        return

    setSectionMessage: (message) ->
        @message.show()
        @sectionMessage.html(message);
        return

    reset: (callback = ( -> )) ->
        @message.hide()
        fill = @fill
        fill.addClass(ProgressBar.classes.noTransition);
        setTimeout( ->
            fill.css("width", "0");
            setTimeout( ->
                fill.removeClass(ProgressBar.classes.noTransition);
                callback()
            , 5)
        , 5)

    resetAfter: (time) ->
        setTimeout(@reset.bind(this), time)

# ================================
#             Dropdown
# ================================ 

window.Oxygen or= {}
window.Oxygen.Dropdown = class Dropdown

    @classes =
        dropdownToggle: "Dropdown-container"
        dropdownList: "Dropdown"
        isActive: "is-active"

    @registerEvents: ->
        $("." + @classes.dropdownToggle).on("click", @handleClick.bind(@))
        $(document).on("click", @handleGlobalClick.bind(@))

    @handleClick: (event) ->
        container = $(event.target)
        while !container.hasClass(@classes.dropdownToggle)
            return if container.is("a[href], form")
            container = container.parent()
        dropdown = container.find("." + @classes.dropdownList)
        if dropdown.hasClass(@classes.isActive)
            dropdown.removeClass(@classes.isActive)
        else
            $("." + @classes.dropdownList).removeClass(@classes.isActive)
            dropdown.addClass(@classes.isActive)

    @handleGlobalClick: (event) ->
        target = $(event.target)
        targetHasClass = target.hasClass(@classes.dropdownToggle)
        parentHasClass = target.parent().hasClass(@classes.dropdownToggle)
        ancestorExists = target.parents("." + @classes.dropdownToggle).length
        $("." + @classes.dropdownList).removeClass(@classes.isActive)  if not targetHasClass and not parentHasClass and not ancestorExists
# ================================
#             Notification
# ================================

window.Oxygen or= {}
window.Oxygen.Notification = class Notification

    @classes =
        container: "Notification-container"
        item: "Notification"

    @initializeExistingMessages: ->

        $("." + Notification.classes.container).find("." + Notification.classes.item).each (index, value) ->
            new Notification(message: $(this))
            return
        return

    constructor: (options) ->
        console.log options.log  if options.log

        if options.message
            # Constructs a Notification object
            # using a pre-existing message element.
            @message = options.message
            @message.removeClass "is-hidden"
            @registerHide()
        else if options.status and options.content
            # Constructs a Notification object,
            # creating a new message element.
            @message = $(
                "<div class=\"" + Notification.classes.item +
                " Notification--" +
                options.status + "\">" +
                options.content +
                "<span class=\"Notification-dismiss Icon Icon-times\"></span></div>"
            )
            @show()
        else
            console.log("Invalid Arguments For New Notification")
            console.log(options)

    show: ->
        @message.appendTo("." + Notification.classes.container)
        @registerHide()
        return

    registerHide: ->
        @message.click(@hide.bind(@))
        setTimeout(@hide.bind(@), 20000)
        return

    hide: ->
        @message.addClass "is-sliding-up"
        setTimeout(@remove.bind(this), 500)
        return

    remove: ->
        @message.remove()
        return


# ================================
#          ProgressBar
# ================================

window.Oxygen or= {}
window.Oxygen.TabSwitcher = class TabSwitcher

    # -----------------
    #       Static
    # -----------------

    @classes =
        tabs: "TabSwitcher-tabs"
        content: "TabSwitcher-content"
        active: "TabSwitcher--isActive"

    @list = []

    @findAll: ->
        $("." + TabSwitcher.classes.tabs).each ->
            tabs = $(@)
            if tabs.hasClass(TabSwitcher.classes.content)
                container = tabs
            else
                container = tabs.siblings("." + TabSwitcher.classes.content)

            container = tabs.parent().siblings("." + TabSwitcher.classes.content)  if container.length == 0

            TabSwitcher.list.push new TabSwitcher(tabs, container)

    # -----------------
    #       Object
    # -----------------

    constructor: (tabs, container) ->
        @tabs = tabs
        @container = container
        @findDefault()
        @registerEvents()

    findDefault: ->
        tab = @tabs.children("[data-default-tab]").attr("data-switch-to-tab");
        @setTo(tab);

    registerEvents: ->
        @tabs.children("[data-switch-to-tab]").on("click", @handleClick)

    handleClick: (event) =>
        tab = $(event.currentTarget).attr("data-switch-to-tab")
        @setTo(tab);

    setTo: (tab) ->
        @current = tab
        @container.children("[data-tab]").removeClass(TabSwitcher.classes.active)
        @container.children("[data-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active)
        @tabs.children("[data-switch-to-tab]").removeClass(TabSwitcher.classes.active)
        @tabs.children("[data-switch-to-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active)
# ================================
#            Upload
# ================================

window.Oxygen or= {}
window.Oxygen.Upload = class Upload

    # -----------------
    #       Static
    # -----------------

    @selectors =
        uploadElement: ".FileUpload"
        progressBarElement: ".ProgressBar"
        progressBarFill: ".ProgressBar-fill"

    @states =
        onDragOver: "FileUpload--onDragOver"

    @registerEvents: () ->
        $(Upload.selectors.uploadElement)
            .on("dragover", Upload.handleDragOver)
            .on("dragleave", Upload.handleDragLeave)
            .on("drop", Upload.handleDrop)
            .find("input[type=file]").on("change", Upload.handleChange)

    @handleDragOver = (event) ->
        $(event.currentTarget).addClass(Upload.states.onDragOver)

    @handleDragLeave = (event) ->
        $(event.currentTarget).removeClass(Upload.states.onDragOver)

    @handleDrop = (event) ->
        event.preventDefault()
        $(event.currentTarget).removeClass(Upload.states.onDragOver)

        files = event.originalEvent.dataTransfer.files
        form = $(event.currentTarget).parents("form")
        input = $(event.currentTarget).find("input")[0]

        formData = Form.getFormDataObject(form)
        for file in files
            formData.append(input.name, file)

        upload = new Upload(
            $(event.currentTarget).parent().find(Upload.selectors.progressBarElement),
            form,
            formData
        )

        upload.send()
        return

    @handleChange = (event) ->
        event.target.form.submit()
        return

    # -----------------
    #       Object
    # -----------------

    constructor: (progressBar, form, data) ->
        @progressBar = new ProgressBar(progressBar)
        @form = form
        @data = data

    send: () ->
        $.ajax({
            dataType:       "json"
            type:           @form.attr("method")
            url:            @form.attr("action")
            data:           @data
            contentType:    false
            processData:    false
            success:        @handleSuccess.bind(this)
            error:          Ajax.handleError
            xhr:            @createCustomRequest.bind(this)
        })

    # Creates a custom XMLHttpRequest
    # object with a progress event.
    createCustomRequest: () ->
        object = if window.ActiveXObject then new ActiveXObject("XMLHttp") else new XMLHttpRequest()
        object.upload.addEventListener("progress", @handleProgress.bind(this))
        return object

    handleProgress: (event) ->
        if event.lengthComputable
            @progressBar.transitionTo(event.loaded, event.total)

    handleSuccess: (data) ->
        Ajax.handleSuccess(data)
        @progressBar.reset()

# ================================
#             MainNav
# ================================

window.Oxygen or= {}
window.Oxygen.MainNav = class MainNav

    @headroom: () ->
        header = $(".MainNav")

        if header.length > 0
            if $(window).width() > 768
                headroom = new Headroom(header[0], {
                    "tolerance": 20
                    "offset": 50
                    "classes":
                        "initial": "Headroom"
                        "pinned": "Headroom--pinned"
                        "unpinned": "Headroom--unpinned"
                        "top": "Headroom--top"
                        "notTop": "Headroom--not-top"
                })
                headroom.init()
        return
# ================================
#            Slider
# ================================

window.Oxygen or= {}
window.Oxygen.Slider = class Slider

    # -----------------
    #       Static
    # -----------------

    @selectors =
        slider: ".Slider"
        list: ".Slider-list"
        item: ".Slider-item"
        back: ".Slider-back"
        forward: ".Slider-forward"

    @classes =
        item: "Slider-item"
        isCurrent: "Slider-item--current"
        isHidden: "Slider-item--hidden"
        slideInLeft: "Slider-item--slideInLeft"
        slideInRight: "Slider-item--slideInRight"
        slideOutLeft: "Slider-item--slideOutLeft"
        slideOutRight: "Slider-item--slideOutRight"
        isAfter: "Slider-item--after"
        noTransition: "Slider--noTransition"

    @list = []

    @findAll: () ->
        $(Slider.selectors.slider).each ->
            Slider.list.push new Slider($(@))

    # -----------------
    #       Object
    # -----------------

    constructor: (container) ->
        @container = container
        @list = @container.find(Slider.selectors.list)
        @items = @container.find(Slider.selectors.item)

        @total = @items.length
        @interval = @container.attr("data-interval") or 5000

        @previousId = 0
        @currentId = 0
        @nextId = 0
        @animating = false
        @animationTime = 1000

        @registerEvents()
        @hideAll()
        @next()

        if @container.attr("data-autoplay") == "true"
            @play()

    registerEvents: () ->
        @container.find(Slider.selectors.back).on("click", @previous.bind(@))
        @container.find(Slider.selectors.forward).on("click", @next.bind(@))
        return

    play: () ->
        callback = if @container.attr("data-direction") == "reverse" then @previous.bind(@) else @next.bind(@)
        @timer = setInterval(callback, @interval)
        return

    pause: () ->
        clearInterval(@timer)
        return

    getItem: (id) ->
        return @list.children(":nth-child(" + id + ")")

    hideAll: () ->
        @items.removeClass()
        @items.addClass(Slider.classes.item + " " + Slider.classes.isHidden)
        return

    allClasses: () ->
        return Slider.classes.isHidden + " " +
            Slider.classes.slideInLeft + " " +
            Slider.classes.slideInRight + " " +
            Slider.classes.slideOutLeft + " " +
            Slider.classes.slideOutRight

    next: () ->
        if !@shouldAnimate() then return false

        @previousId = @currentId

        @currentId += 1
        if @currentId > @total
            @currentId = 1

        @nextId = @currentId + 1
        if @nextId > @total
            @nextId = 1

        current = @getItem(@currentId)
        previous = @getItem(@previousId)

        @hideAll

        previous
            .removeClass(@allClasses())
            .addClass(Slider.classes.slideOutLeft)

        current
            .removeClass(@allClasses())
            .addClass(Slider.classes.slideInRight)

        return

    previous: () ->
        if !@shouldAnimate() then return false

        @nextId = @currentId

        @currentId -= 1
        if @currentId < 1
            @currentId = @total

        @previousId = @currentId - 1
        if @nextId < 1
            @nextId = @total

        current = @getItem(@currentId)
        next = @getItem(@nextId)

        @hideAll

        next
            .removeClass(@allClasses())
            .addClass(Slider.classes.slideOutRight)

        current
            .removeClass(@allClasses())
            .addClass(Slider.classes.slideInLeft)

        return

    shouldAnimate: () ->
        if @animating
            return false

        @animating = true
        setTimeout( =>
            @animating = false
            return
        @animationTime)

        return true

# ================================
#            AjaxRequest
# ================================

window.Oxygen or= {}
window.Oxygen.Dialog = class Dialog

    @registerEvents: ->
        $("[data-dialog-type=\"confirm\"]").on("click", @handleConfirmClick)
        $("[data-dialog-type=\"alert\"]").on("click", @handleAlertClick)

    @handleAlertClick: (event) ->
        target = $(event.currentTarget)
        vex.dialog.alert target.attr("data-dialog-message")

    @handleConfirmClick: (event, customConfig) ->
        target = $(event.currentTarget)

        unless target.attr("data-dialog-disabled") == "true"
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation();

            defaultConfig =
                message: target.attr("data-dialog-message")
                callback: (value) ->
                    if value
                        target.attr("data-dialog-disabled", "true")
                        target[0].click()

            for attribute of customConfig
                defaultConfig[attribute] = customConfig[attribute]

            vex.dialog.confirm(defaultConfig)



# ================================
#            Slider
# ================================

window.Oxygen or= {}
window.Oxygen.SmoothState = class SmoothState

    loading: false

    init: ->
        @smoothState = $("#page").smoothState({
            anchors: ".Link--smoothState"
            root: $(document)
            pageCacheSize: 0
            onStart:
                duration: 350
                render: @onStart
            onProgress:
                duration: 0
                render: @onProgress
            onEnd:
                duration: 0
                render: @onEnd
            callback: @callback
        }).data('smoothState');

    onStart: (url, container) =>
        $("html, body").animate({ scrollTop: 0 })

        @loading = true

        elements = $('.Block')
        $(elements.get().reverse()).each((index) ->
            block = $(this)
            timeout = index * 100
            setTimeout( ->
                block.addClass('Block--isExiting')
            timeout)
        );

        setTimeout( =>
            if @loading
                $(".pace-activity").addClass("pace-activity-active")
        elements.length * 100)

    onProgress: (url, container) =>
        $("html, body").css('cursor', 'wait')
             .find('a').css('cursor', 'wait')

    onEnd: (url, container, content) =>
        $("html, body").css('cursor', 'auto')
             .find('a').css('cursor', 'auto');

        Oxygen.reset()
        container.hide()
        container.html(content)

        $(".pace-activity").removeClass("pace-activity-active")

        $('.Block').each((index) ->
            block = $(this)
            timeout = index * 100
            block.addClass('Block--isHidden')
            setTimeout( ->
                block.removeClass('Block--isHidden')
                block.addClass('Block--isEntering')
                setTimeout( ->
                    block.removeClass('Block--isEntering')
                350)
            timeout)
        );

        container.show()

    callback: (url, $container, $content) =>
        @loading = false

        $(".pace-activity").removeClass("pace-activity-active")

        elements = $(document).add("*")
        elements.off()
        @smoothState.bindEventHandlers($(document))
        Oxygen.init()

    setTheme: (theme) ->
        $("#page").addClass('Page-transition--' + theme)

    load: (url, isPopped, ignoreCache) ->
        @smoothState.load(url, isPopped, ignoreCache)
# ================================
#             Notification
# ================================

window.Oxygen or= {}
window.Oxygen.Preferences = class Preferences

    @setPreferences: (preferences) ->
        Preferences.preferences = preferences

    @get: (key, fallback = null) ->
        o = Preferences.preferences

        if(!o?)
            return fallback

        parts = key.split('.')
        last = parts.pop()
        l = parts.length
        i = 1
        current = parts[0]

        while((o = o[current]) && i < l)
            current = parts[i]
            i++

        if o
            return o[last]
        else
            return fallback

    @has: (key) ->
        o = Preferences.preferences

        if(!o)
            return false

        parts = key.split('.')
        last = parts.pop()
        l = parts.length
        i = 1
        current = parts[0]

        while((o = o[current]) && i < l)
            current = parts[i]
            i++

        if o
            return true
        else
            return false



# ================================
#                 Editor
# ================================

window.Oxygen or= {}
window.Oxygen.Editor = class Editor

    # -----------------
    #      Static
    # -----------------

    @list = []

    # only create if textarea exists
    @createEditors: (editors) ->
        for editor in editors
            textarea = $("textarea[name=\"" + editor.name + "\"]")
            if textarea.length
                console.log "Editor found"
                editor.mode = user.editor.defaultMode if !editor.mode?
                console.log editor
                new Editor(editor.name, editor.language, editor.mode, editor.readOnly, editor.stylesheets)
            else
                console.log "Editor not found"
                console.log editor
        return

    @classes =
        editor:
            container: "Editor"
            header: "Editor-header"
            content: "Editor-content"
            footer: "Editor-footer"
            preview: "Editor-preview"

        state:
            isHidden: "Editor--hidden"
            contentIsSplit: "Editor-content--isSplit"

        button:
            switchEditor: "Editor--switchEditor"
            fullscreenToggle: "Editor--toggleFullscreen"

    # -----------------
    #      Object
    # -----------------

    constructor: (name, language, currentMode, readOnly, stylesheets = []) ->
        @name = name
        @language = language
        @currentMode = currentMode
        @readOnly = readOnly
        @stylesheets = stylesheets
        @modes = {}
        @textarea = $("textarea[name=\"" + @name + "\"]")
        @container = @textarea.parents("." + Editor.classes.editor.container)
        @fullscreenToggle = new FullscreenToggle(@container.find("." + Editor.classes.button.fullscreenToggle), @container, @enterFullscreen, @exitFullscreen)

        @show()
        @resizeToContent()
        @registerEvents()
        Editor.list.push(@)

    getMode: (mode) ->
        if not mode?
            return @currentMode
        else
            return mode

    registerEvents: ->
        # switch editor button
        @container.find("." + Editor.classes.button.switchEditor).on("click", @handleSwitchEditor)

        # form submit
        $(@container).parents("form").on("submit", @handleFormSubmit)
        return

    create: (m) ->
        mode = @getMode(m)
        switch mode
            when "code"
                @modes.code = new CodeViewInterface(@)
            when "design"
                @modes.design = new DesignViewInterface(@)
            when "preview"
                @modes.preview = new PreviewInterface(@)
            when "split"
                @modes.split = new SplitViewInterface(@)
        @modes[mode].create()
        return

    show: (m, full = true) ->
        mode = @getMode(m)
        @create mode  if not @modes[mode]?
        @modes[mode].show(full)
        @currentMode = mode
        @valueFromForm(mode)
        return

    hide: (m) ->
        mode = @getMode(m)
        @modes[mode].hide()
        @valueToForm(mode)
        return

    valueFromForm: (m) ->
        mode = @getMode(m)
        @modes[mode].valueFromForm()
        return

    valueToForm: (m) ->
        mode = @getMode(m)
        @modes[mode].valueToForm()
        return

    resizeToContainer: ->
        # resize ace
        @modes.code.resize()  if @modes.code
        return

    resizeToContent: ->
        # size to content
        @container.find("." + Editor.classes.editor.content).css "height", @textarea.attr("rows") * 1.5 + "em"

        # resize ace
        @modes.code.resize()  if @modes.code
        return

    # enter fullscreen
    enterFullscreen: =>
        @resizeToContainer()
        return

    # exit fullscreen
    exitFullscreen: =>
        @resizeToContent()
        return

    handleSwitchEditor: (event) =>
        console.log("Editor.handleSwitchEditor")
        editorToSwitch = $(event.target).attr("data-editor")
        @hide()
        @show(editorToSwitch)

    handleFormSubmit: =>
        @valueToForm()

# ================================
#          CodeViewInterface
# ================================

window.Oxygen or= {}
window.Oxygen.Editor.CodeViewInterface = class CodeViewInterface

    constructor: (editor) ->
        @editor = editor
        @view = null

    create: ->
        console.log "CodeViewInterface.create"

        # edit the textarea
        object = ace.edit(@editor.name + "-ace-editor")

        # set user preferences
        object.getSession().setMode "ace/mode/" + @editor.language
        object.setTheme Preferences.get('editor.ace.theme')
        object.getSession().setUseWrapMode Preferences.get('editor.ace.wordWrap')
        object.setHighlightActiveLine Preferences.get('user.editor.ace.highlightActiveLine')
        object.setShowPrintMargin Preferences.get('user.editor.ace.showPrintMargin')
        object.setShowInvisibles Preferences.get('user.editor.ace.showInvisibles')
        object.setReadOnly @editor.readOnly
        $("#" + @editor.name + "-ace-editor").css "font-size", Preferences.get('user.editor.ace.fontSize')

        # store object
        @view = object

    show: (full) ->
        console.log "CodeViewInterface.show"
        $("#" + @editor.name + "-ace-editor").removeClass(Editor.classes.state.isHidden)
        if full
            $("#" + @editor.name + "-ace-editor").css("width", "100%")
        @resize()

    hide: ->
        console.log "CodeViewInterface.hide"
        $("#" + @editor.name + "-ace-editor").addClass(Editor.classes.state.isHidden)

    valueFromForm: ->
        console.log "CodeViewInterface.valueFromForm"
        @view.setValue @editor.textarea.val(), -1

    valueToForm: ->
        console.log "CodeViewInterface.valueToForm"
        @editor.textarea.val @view.getValue()

    resize: ->
        @view.resize()
# ================================
#          DesignViewInterface
#   ================================

window.Oxygen or= {}
window.Oxygen.Editor.DesignViewInterface = class DesignViewInterface

    constructor: (editor) ->
        @editor = editor
        @view = null

    create: ->
        config = Preferences.get('editor.ckeditor', {})
        config.customConfig = config.customConfig || ''
        config.contentsCss = @editor.stylesheets

        console.log(config)

        # create instance
        object = CKEDITOR.replace(
            @editor.name + "-editor",
            config
        )

        # store object
        @view = object

    show: (full) ->
        $("#cke_" + @editor.name + "-editor").show()
        if full
            $("#" + @editor.name + "-ace-editor").css("width", "100%")
        return

    hide: ->
        $("#cke_" + @editor.name + "-editor").hide()
        return

    valueFromForm: ->
        @view.setData @editor.textarea.val()

    valueToForm: ->
        $("textarea[name=\"" + @editor.name + "\"]").val @view.getData()
# ================================
#          PreviewInterface
#   ================================

window.Oxygen or= {}
window.Oxygen.Editor.PreviewInterface = class PreviewInterface

    constructor: (editor) ->
        @editor = editor
        @view = null

    create: ->
        console.log "PreviewInterface.create"
        element = "<iframe id=\"" + @editor.name + "-preview\" class=\"" + Editor.classes.editor.preview + "\"></iframe>"
        preview = $(element)
        preview.appendTo @editor.container.find(".Editor-content")
        @view = preview

    show: (full) ->
        console.log "PreviewInterface.show"
        $("#" + @editor.name + "-preview").removeClass(Editor.classes.state.isHidden)

        if full
            $("#" + @editor.name + "-preview").css("width", "100%")

        # create the stylesheets
        head = ""
        for stylesheet in @editor.stylesheets
            head += "<link rel=\"stylesheet\" href=\"" + stylesheet + "\">"
        @view.contents().find("head").html head
        @view.contents().find("html").addClass "no-js " + $("html").attr("class").replace("js ", "")

    hide: ->
        console.log "PreviewInterface.hide"
        $("#" + @editor.name + "-preview").addClass(Editor.classes.state.isHidden)

    valueFromForm: ->
        console.log "PreviewInterface.valueFromForm"
        @view.contents().find("body").html @editor.textarea.val()

    # we can't and don't want to do this
    valueToForm: ->

# ==========================
#     SplitViewInterface
# ==========================

window.Oxygen or= {}
window.Oxygen.Editor.SplitViewInterface = class SplitViewInterface

    constructor: (editor) ->
        @editor = editor
        @view = null

    create : ->
        console.log "SplitViewInterface.create"

    show : ->
        console.log "SplitViewInterface.show"
        @editor.container.find("." + Editor.classes.editor.content).addClass Editor.classes.state.contentIsSplit
        @editor.show "code", false
        @editor.show "preview", false
        $("#" + @editor.name + "-ace-editor, #" + @editor.name + "-preview").css "width", "50%"
        @editor.modes.code.view.on "change", @synchronize.bind(this)

    hide : ->
        console.log "SplitViewInterface.hide"
        @editor.container.find("." + Editor.classes.editor.content).removeClass Editor.classes.state.contentIsSplit
        @editor.hide "code"
        @editor.hide "preview"

    valueFromForm : ->

    valueToForm : ->

    onChange : ->
        @hasChanged = true

    synchronize : ->
        if @editor.currentMode is "split"
            console.log "SplitViewInterface.synchronize"
            @editor.valueToForm "code"
            @editor.valueFromForm "preview"
            @hasChanged = false

# ================================
#             ImageEditor
# ================================

window.Oxygen or= {}
window.Oxygen.ImageEditor = class ImageEditor

    # -----------------
    #      Object
    # -----------------

    constructor: (container) ->
        @container = container
        @image = @container.find("." + ImageEditor.classes.layout.image)
        throw new Error("<img> element doesn't exist")  unless @image.length

        @forms = {
          simple: @image.parent().parent().find("." + ImageEditor.classes.form.simple)
          advanced: @image.parent().parent().find("." + ImageEditor.classes.form.advanced)
        }

        @fields = {
          crop: {
            x: @container.find('[name="crop[x]"]')
            y: @container.find('[name="crop[y]"]')
            width: @container.find('[name="crop[width]"]')
            height: @container.find('[name="crop[height]"]')
          },
          resize: {
            width: @container.find('[name="resize[width]"]')
            height: @container.find('[name="resize[height]"]')
            keepAspectRatio: @container.find('[name="resize[keepAspectRatio]"][value="true"]')
          },
          macro: @container.find('[name="macro"]')
          name: @container.find('[name="name"]')
          slug: @container.find('[name="slug"]')
        }

        that = @
        @image[0].onload = ->
            console.log 'Image Loaded'
            that.imageDimensions = { cropX: 0, cropY: 0 } unless that.imageDimensions?
            that.imageDimensions.width = this.clientWidth
            that.imageDimensions.height = this.clientHeight
            that.imageDimensions.naturalWidth = this.naturalWidth
            that.imageDimensions.naturalHeight = this.naturalHeight
            that.imageDimensions.ratio = this.naturalWidth / this.naturalHeight
            that.fields.resize.width.val(that.imageDimensions.naturalWidth)
            that.fields.resize.height.val(that.imageDimensions.naturalHeight)
            that.handleCropEnable()

        @progressBar = new ProgressBar(
            @container.find("." + ImageEditor.classes.form.progressBar)
        )
        @fullscreenToggle = new FullscreenToggle(
            @container.find("." + ImageEditor.classes.button.toggleFullscreen),
            @container,
            ( -> ), ( -> )
        )

        @container.find("." + ImageEditor.classes.button.apply).on("click", @handlePreview)
        @container.find("." + ImageEditor.classes.button.save).on("click", @handleSave)
        @container.find("." + ImageEditor.classes.form.crop).on("change", @handleCropInputChange)
        @container.find("." + ImageEditor.classes.form.resize).on("change", @handleResizeInputChange)

        @jCropApi = null
        @cropDisableCounter = 2

    handlePreview: () =>
        @applyChanges @gatherData()

        @progressNotification = new Notification({
          content: "Processing Image"
          status: "success"
        })

    handleSave: () =>
        data = @gatherData()
        data.save = true
        data.name = @fields.name.val()
        data.slug = @fields.slug.val()
        @applyChanges data

        @progressNotification = new Notification({
          content: "Saving Image"
          status: "success"
        })

    gatherData: () ->
        mode = TabSwitcher.list[0].current
        switch mode
            when "simple" then @getSimpleData()
            when "advanced" then @getAdvancedData()
            else {}

    getSimpleData: () ->
        @removeDefaultFields(Form.getFormData(@forms.simple))

    removeDefaultFields: (formData) ->
        resize = (formData) =>
            return \
                (!formData["resize[width]"] || formData["resize[width]"] == @imageDimensions.naturalWidth.toString()) &&
                (!formData["resize[height]"] || formData["resize[height]"] == @imageDimensions.naturalHeight.toString())

        defaults = {
            "fit[position]": (item) =>
                return item == "center"
            "resize[width]": (item, formData) =>
                resize(formData)
            "resize[height]": (item, formData) =>
                resize(formData)
            "resize[keepAspectRatio]": (item, formData) =>
                resize(formData)
            "gamma": (item) =>
                return item == "1"
            "greyscale": (item) =>
                return item == "false"
            "invert": (item) =>
                return item == "false"
            "rotate[backgroundColor]": (item) =>
                return item == "#ffffff"
            "crop[x]": (item) =>
                @imageDimensions.cropX = if item == "" then 0 else parseInt(item)
            "crop[y]": (item) =>
                @imageDimensions.cropY = if item == "" then 0 else parseInt(item)
        }

        for key, item of formData
            if(defaults[key] and defaults[key](item, formData))
                delete formData[key]
            else if(item == "0" || item == "")
                delete formData[key]

        return formData

    getAdvancedData: () ->
        JSON.parse @fields.macro.val()

    # --------------------------------------------
    #                     REQUEST
    # --------------------------------------------

    applyChanges: (data) ->
        if @progressTimer?
            new Notification({
                content: "Already Processing"
                status: "failed"
            })
            return

        $.ajax({
            type:           "GET"
            url:            @image.attr("data-root")
            data:           data
            contentType:    false
            success:        @onRequestEnd
            error:          =>
                @progressNotification.hide()
                Ajax.handleError()
            xhr:            =>
                object = if window.ActiveXObject then new ActiveXObject("XMLHttp") else new XMLHttpRequest()
                object.addEventListener("progress", @onRequestProgress)
                object.overrideMimeType("text/plain; charset=x-user-defined");
                return object
        })
        i = 0
        that = @
        @progressTimer = setInterval( ->
            if(i < 75)
                i++
            that.progressBar.transitionTo(i, 100)
        , 50)

    onRequestEnd: (response, status, request) =>
        clearInterval(@progressTimer)
        @progressTimer = null
        @progressNotification.hide()
        @jCropApi.destroy() if @jCropApi?
        @jCropApi = null
        @forms.simple.attr("data-changed", false)
        @forms.advanced.attr("data-changed", false)

        @image[0].src = "data:image/jpeg;base64," + base64Encode(response);

        @progressBar.transitionTo(1, 1)
        @progressBar.resetAfter(1000)

    onRequestProgress: (e) =>
        clearInterval(@progressTimer)
        if e.lengthComputable
            @progressBar.transitionTo(Math.round(e.loaded / e.total * 25) + 75, 100)

    # --------------------------------------------
    #                     CROP
    # --------------------------------------------

    handleCropEnable: () =>
        if(@jCropApi?)
            @jCropApi.enable();
        else
            that = @
            @image.Jcrop({
                onChange: @handleCropSelect
                onSelect: @handleCropSelect
                onRelease: @handleCropRelease
            }, () ->
                that.jCropApi = @
            );

    handleCropDisable: () =>
        @jCropApi.disable()

    handleCropSelect: (c) =>
        if(@cropDisableCounter > 1)
            @fields.crop.x.val(Math.round(c.x / @imageDimensions.width * @imageDimensions.naturalWidth + @imageDimensions.cropX))
            @fields.crop.y.val(Math.round(c.y / @imageDimensions.height * @imageDimensions.naturalHeight + @imageDimensions.cropY))
            @fields.crop.width.val(Math.round(c.w / @imageDimensions.width * @imageDimensions.naturalWidth))
            @fields.crop.height.val(Math.round(c.h / @imageDimensions.height * @imageDimensions.naturalHeight))
        else
            @cropDisableCounter++

    handleCropInputChange: () =>
        if(!@jCropApi?) then return
        x = @fields.crop.x.val() / @imageDimensions.naturalWidth * @imageDimensions.width - @imageDimensions.cropX
        y = @fields.crop.y.val() / @imageDimensions.naturalHeight * @imageDimensions.height - @imageDimensions.cropY
        @cropDisableCounter = 0
        @jCropApi.setSelect([
            x,
            y,
            x + @fields.crop.width.val() / @imageDimensions.naturalWidth * @imageDimensions.width,
            y + @fields.crop.height.val() / @imageDimensions.naturalHeight * @imageDimensions.height
        ])

    handleCropRelease: () =>
        @fields.crop.x.val(0)
        @fields.crop.y.val(0)
        @fields.crop.width.val(0)
        @fields.crop.height.val(0)

    handleResizeInputChange: (e) =>
        if(@fields.resize.keepAspectRatio[0].checked)
            name = e.target.name
            value = $(e.target).val()
            console.log(name, value)
            if(name == 'resize[width]')
                @fields.resize.height.val(Math.round(value / @imageDimensions.ratio))
            else
                @fields.resize.width.val(Math.round(value * @imageDimensions.ratio))

    # -----------------
    #        Static
    # -----------------

    @list: []

    @initialize: () ->
        $("." + ImageEditor.classes.layout.container).each( ->
            ImageEditor.list.push new ImageEditor($(this))
        )

    @classes: {
        layout:
          container: "ImageEditor"
          image: "ImageEditor-image"
        button:
          toggleFullscreen: "ImageEditor-toggleFullscreen"
          save: "ImageEditor-save"
          apply: "ImageEditor-apply"
        form:
          simple: "ImageEditor-form--simple"
          advanced: "ImageEditor-form--advanced"
          progressBar: "ImageEditor-progress"
          crop: "ImageEditor-crop-input"
          resize: "ImageEditor-resize-input"
    }

Oxygen.initLogin = () ->

    loginForm = $(".Login-form")
        .addClass("Login--noTransition")
        .addClass("Login--slideDown")

    loginForm[0].offsetHeight;
    loginForm.removeClass("Login--noTransition")

    setTimeout( ->
        $("body").removeClass("Login--isHidden")
        return
    , 500)

    $(".Login-scrollDown").on("click", ->
        $(".Login-message").addClass("Login--slideUp")
        loginForm.removeClass("Login--slideDown")
        $(".Login-background--blur").addClass("Login--isHidden")
        return
    )

    loginForm.on("submit", ->
        loginForm.addClass("Login--slideUp")
        return
    )

    Ajax.handleErrorCallback = () ->
        loginForm.removeClass("Login--slideUp")
        return

    Ajax.handleSuccessCallback = (data) ->
        console.log data
        if data.status == "failed"
            loginForm.removeClass("Login--slideUp")
        return
    return





























base64Encode = (inputStr) ->
  b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  outputStr = ""
  i = 0
  while i < inputStr.length

    #all three "& 0xff" added below are there to fix a known bug
    #with bytes returned by xhr.responseText
    byte1 = inputStr.charCodeAt(i++) & 0xff
    byte2 = inputStr.charCodeAt(i++) & 0xff
    byte3 = inputStr.charCodeAt(i++) & 0xff
    enc1 = byte1 >> 2
    enc2 = ((byte1 & 3) << 4) | (byte2 >> 4)
    enc3 = undefined
    enc4 = undefined
    if isNaN(byte2)
      enc3 = enc4 = 64
    else
      enc3 = ((byte2 & 15) << 2) | (byte3 >> 6)
      if isNaN(byte3)
        enc4 = 64
      else
        enc4 = byte3 & 63
    outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4)
  outputStr

MainNav.headroom()

if user?
    Preferences.setPreferences(user)

Oxygen.reset = () ->
    window.editors = []
    Dropdown.handleGlobalClick({ target: document.body })

Oxygen.init = () ->

    #
    # -------------------------
    #       FLASH MESSAGE
    # -------------------------
    #
    # This small delay helps to
    # reduce lag on page load.
    #

    setTimeout(Notification.initializeExistingMessages, 250)

    Dialog.registerEvents()

    #
    # -------------------------
    #       CODE EDITOR
    # -------------------------
    #
    # Initialises code editors for the page.
    #

    if editors?
        Editor.createEditors(editors)

    #
    # -------------------------
    #       IMAGE EDITOR
    # -------------------------
    #
    # Initialises image editors for the page.
    #

    ImageEditor.initialize()

    #
    # -------------------------
    #           LOGIN
    # -------------------------
    #
    # Login form animations.
    #

    if $(".Login-form").length > 0
        Oxygen.initLogin()

    #
    # -------------------------
    #           OTHER
    # -------------------------
    #
    # Other event handlers.
    #

    Dropdown.registerEvents()
    Form.findAll()
    Upload.registerEvents()
    TabSwitcher.findAll()
    Slider.findAll()

    Oxygen.load = Oxygen.load || [];
    for callback in Oxygen.load
        callback()

Oxygen.init()

#
# -------------------------
#       SMOOTH STATE
# -------------------------
#
# Calls the smoothState.js library.
#

if Preferences.get('pageLoad.smoothState.enabled', true) == true
    smoothState = new SmoothState()
    smoothState.init()
    smoothState.setTheme(Preferences.get('pageLoad.smoothState.theme', 'slide'))

progressThemes = Preferences.get('pageLoad.progress.theme', ["minimal", "spinner"])
for theme in progressThemes
    $(document.body).addClass("Page-progress--" + theme)
