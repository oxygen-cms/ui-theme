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

