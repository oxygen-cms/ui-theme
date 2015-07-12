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

MainNav.headroom()

if user?
    Preferences.setPreferences(user)

Oxygen.reset = () ->
    window.editors = []
    Oxygen.load = []
    Dropdown.handleGlobalClick({ target: document.body })

Oxygen.init = (container) ->

    #
    # -------------------------
    #       FLASH MESSAGE
    # -------------------------
    #
    # This small delay helps to
    # reduce lag on page load.
    #

    setTimeout(Notification.initializeExistingMessages, 250)

    Dialog.registerEvents(container)

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

    ImageEditor.initialize(container)

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

    Dropdown.registerEvents(container)
    Form.findAll(container)
    Upload.registerEvents(container)
    TabSwitcher.findAll(container)
    Slider.findAll(container)

    Oxygen.load = Oxygen.load || [];
    for callback in Oxygen.load
        callback()

Oxygen.init $(document)

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

Form.registerKeydownHandler()
Dropdown.registerGlobalEvent()