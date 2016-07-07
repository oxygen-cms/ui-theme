window.Oxygen || (window.Oxygen = {});
Oxygen.reset = function() {
    window.editors = [];
    Oxygen.load = [];
    Oxygen.setBodyScrollable(true);
    return Dropdown.handleGlobalClick({ target: document.body });
};

Oxygen.setBodyScrollable = function(scrollable) {
    if (scrollable) {
        document.body.classList.remove("Body--noScroll");
    } else {
        document.body.classList.add("Body--noScroll");
    }
};

Oxygen.init = function(container) {

    //
    // -------------------------
    //       FLASH MESSAGE
    // -------------------------
    //
    // This small delay helps to
    // reduce lag on page load.
    //

    NotificationCenter.initializeExistingMessages();

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

    if(document.querySelector(".Login-form")) {
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

    if ((typeof editors !== "undefined" && editors !== null)) {
        Editor.createEditors(editors);
    }

    let load = Oxygen.load || [];
    for (let i = 0, callback; i < load.length; i++) {
        callback = load[i];
        callback();
    }
};

document.addEventListener("DOMContentLoaded", function() {
    MainNav.headroom();

    if ((typeof user !== "undefined" && user !== null)) {
        Preferences.setPreferences(user);
    }

    Oxygen.init(document);

    if (Preferences.get('pageLoad.smoothState.enabled', true) === true) {
        window.smoothState = new SmoothState();
        SmoothState.setTheme(Preferences.get('pageLoad.smoothState.theme', 'slide'));
    }

    let progressThemes = Preferences.get('pageLoad.progress.theme', ["minimal", "spinner"]);
    console.log("Applying progress themes:", progressThemes);
    for (let i = 0, theme; i < progressThemes.length; i++) {
        theme = progressThemes[i];
        document.body.classList.add("Page-progress--" + theme);
    }

    Form.registerKeydownHandler();
    Dropdown.registerGlobalEvent();
});
