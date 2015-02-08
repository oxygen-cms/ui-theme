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
#= require SmoothState
#= require Preferences

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

if user?
    Preferences.setPreferences(user)

Oxygen.reset = () ->
    window.editors = []
    Oxygen.load = []
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