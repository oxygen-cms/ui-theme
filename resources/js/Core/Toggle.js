// ================================
//             Toggle
// ================================

class Toggle {

    constructor(toggle, enableCallback, disableCallback) {
        this.toggle = toggle;
        this.enableCallback = enableCallback;
        this.disableCallback = disableCallback;

        this.registerEvents();
    }

    registerEvents() {
        this.toggle.addEventListener("click", event => this.handleToggle(event));
        if(this.toggle.getAttribute("data-enabled") == undefined) {
            this.toggle.setAttribute("data-enabled", "false");
        }
    }

    handleToggle(event) {
        if (this.toggle.getAttribute("data-enabled") === "true") {
            this.toggle.setAttribute("data-enabled", "false");
            this.disableCallback(event);
        } else {
            this.toggle.setAttribute("data-enabled", "true");
            this.enableCallback(event);
        }
    }
}

Toggle.classes = {
    ifEnabled:  "Toggle--ifEnabled",
    ifDisabled: "Toggle--ifDisabled"
};

// ================================
//        FullscreenToggle
// ================================

class FullscreenToggle extends Toggle {

    constructor(toggle, fullscreenElement, enterFullscreenCallback = function() {}, exitFullscreenCallback = function() {}) {
        super(toggle, null, null);
        this.fullscreenElement = fullscreenElement;
        this.enableCallback = this.enterFullscreen;
        this.disableCallback = this.exitFullscreen;
        this.enterFullscreenCallback = enterFullscreenCallback;
        this.exitFullscreenCallback = exitFullscreenCallback;
    }

    enterFullscreen() {
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

        (this.enterFullscreenCallback)();
    }

    exitFullscreen() {
        this.fullscreenElement.classList.remove("FullscreenToggle--isFullscreen");
        document.body.classList.remove("Body--noScroll");

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }

        (this.exitFullscreenCallback)();
    }
}

