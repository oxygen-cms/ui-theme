// ================================
//             Notification
// ================================

class Notification {

    static initializeExistingMessages() {

        $("." + Notification.classes.container).find("." + Notification.classes.item).each(function(index, value) {
            new Notification({message: $(this)});
        });
    }

    constructor(options) {
        if (options.log) { console.log(options.log); }

        if (options.message) {
            // Constructs a Notification object
            // using a pre-existing message element.
            this.message = options.message;
            this.message.removeClass("is-hidden");
            this.registerHide();
        } else if (options.status && options.content) {
            // Constructs a Notification object,
            // creating a new message element.
            this.message = $(
                "<div class=\"" + Notification.classes.item +
                " Notification--" +
                options.status + "\">" +
                options.content +
                "<span class=\"Notification-dismiss Icon Icon-times\"></span></div>"
            );
            this.show();
        } else {
            console.log("Invalid Arguments For New Notification");
            console.log(options);
        }
    }

    show() {
        this.message.appendTo("." + Notification.classes.container);
        this.registerHide();
    }

    registerHide() {
        this.message.click(this.hide.bind(this));
        setTimeout(this.hide.bind(this), 20000);
    }

    hide() {
        this.message.addClass("is-sliding-up");
        setTimeout(this.remove.bind(this), 500);
    }

    remove() {
        this.message.remove();
    }
}

Notification.classes = {
    container: "Notification-container",
    item: "Notification"
};

