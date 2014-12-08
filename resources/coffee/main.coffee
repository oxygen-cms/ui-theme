#= require Ajax
#= require Form

#= require Toggle
#= require FullscreenToggle

#= require ProgressBar
#= require Dropdown
#= require Notification
#= require TabSwitcher

#= require Upload
#= require MainNav
#= require Slider
#= require Dialog

#= require Editor
#= require CodeViewInterface
#= require DesignViewInterface
#= require PreviewInterface
#= require SplitViewInterface

#= require ImageEditor

#= require <login.coffee>

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

Oxygen.reset = () ->
    window.editors = []

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

Oxygen.init()

#
# -------------------------
#       SMOOTH STATE
# -------------------------
#
# Calls the smoothState.js library.
#

initSmoothState = ->
    window.Oxygen.smoothState = $("#page").smoothState({
        anchors: ".Link--smoothState"
        root: $(document)
        pageCacheSize: 0
        onStart:
            duration: 150
            render: (url, container) ->
                $("html, body").animate({ scrollTop: 0 })
                container.removeClass('Page--isEntering')
                setTimeout( ->
                    container.addClass('Page--isExiting')
                0)
        onProgress:
            duration: 0,
            render: (url, container) ->
                $("html, body").css('cursor', 'wait')
                     .find('a').css('cursor', 'wait')
        onEnd:
            duration: 0
            render: (url, container, content) ->
                $("html, body").css('cursor', 'auto')
                     .find('a').css('cursor', 'auto');
                Oxygen.reset()
                container.hide()
                container.removeClass('Page--isExiting')
                setTimeout( ->
                    container.addClass('Page--isEntering')
                    container.html(content)
                    container.show()
                    elements = $(document).add("*")
                    elements.off()
                    Oxygen.smoothState.bindEventHandlers($(document))
                    Oxygen.init()
                0)
    }).data('smoothState');

if user.smoothState && user.smoothState.enabled
    initSmoothState()

