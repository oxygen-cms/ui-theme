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
