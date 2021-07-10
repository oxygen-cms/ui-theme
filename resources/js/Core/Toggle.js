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
        this.toggle.addEventListener('click', event => this.handleToggle(event));
        if(this.toggle.dataset.enabled === undefined) {
            this.toggle.dataset.enabled = 'false';
        }
    }

    set(value) {
        if(value) {
            this.toggle.dataset.enabled = 'true';
            this.enableCallback(event);
        } else {
            this.toggle.dataset.enabled = 'false';
            this.disableCallback(event);
        }
    }

    get() {
        return this.toggle.dataset.enabled === 'true';
    }

    handleToggle(event) {
        if (this.toggle.dataset.enabled === 'true') {
            this.toggle.dataset.enabled = 'false';
            this.disableCallback(event);
        } else {
            this.toggle.dataset.enabled = 'true';
            this.enableCallback(event);
        }
    }
}

Toggle.classes = {
    ifEnabled:  'Toggle--ifEnabled',
    ifDisabled: 'Toggle--ifDisabled'
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
        this.fullscreenElement.classList.add('FullscreenToggle--isFullscreen');
        document.body.classList.add('Body--noScroll');
        document.documentElement.classList.add('Body--noScroll');

        window.Oxygen.onToggleFullscreen(true);

        // var elem = document.documentElement;
        // if (elem.requestFullscreen) {
        //     elem.requestFullscreen();
        // } else if (elem.msRequestFullscreen) {
        //     elem.msRequestFullscreen();
        // } else if (elem.mozRequestFullScreen) {
        //     elem.mozRequestFullScreen();
        // } else if (elem.webkitRequestFullscreen) {
        //     elem.webkitRequestFullscreen();
        // }

        (this.enterFullscreenCallback)();
    }

    exitFullscreen() {
        this.fullscreenElement.classList.remove('FullscreenToggle--isFullscreen');
        document.body.classList.remove('Body--noScroll');
        document.documentElement.classList.remove('Body--noScroll');

        window.Oxygen.onToggleFullscreen(false);

        // if(document.fullscreenElement !== null) {
        //     if (document.exitFullscreen) {
        //         document.exitFullscreen();
        //     } else if (document.mozCancelFullScreen) {
        //         document.mozCancelFullScreen();
        //     } else if (document.webkitExitFullscreen) {
        //         document.webkitExitFullscreen();
        //     }
        // }

        (this.exitFullscreenCallback)();
    }
}

export { Toggle, FullscreenToggle };

