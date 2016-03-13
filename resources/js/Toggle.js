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
        this.toggle.on("click", event => this.handleToggle(event));
        if(this.toggle.attr("data-enabled") == undefined) {
            this.toggle.attr("data-enabled", "false");
        }
    }

    handleToggle(event) {
        if (this.toggle.attr("data-enabled") === "true") {
            this.toggle.attr("data-enabled", "false");
            this.disableCallback(event);
        } else {
            this.toggle.attr("data-enabled", "true");
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

    constructor(toggle, fullscreenElement, enterFullscreenCallback, exitFullscreenCallback) {
        super(toggle, null, null);
        this.fullscreenElement = fullscreenElement;
        this.enableCallback = this.enterFullscreen;
        this.disableCallback = this.exitFullscreen;
        this.enterFullscreenCallback = enterFullscreenCallback;
        this.exitFullscreenCallback = exitFullscreenCallback;
    }

    enterFullscreen() {
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

        (this.enterFullscreenCallback)();
    }

    exitFullscreen() {
        this.fullscreenElement.removeClass("FullscreenToggle--isFullscreen");
        $(document.body).removeClass("Body--noScroll");

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

