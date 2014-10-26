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
            console.error("Invalid Arguments For New Notification")
            console.error(options)
        return

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

