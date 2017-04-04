// ================================
//             Notification
// ================================

class NotificationCenter {
    static initializeExistingMessages() {
        let notifications = document
            .querySelector("." + Notification.classes.container)
            .querySelectorAll("." + Notification.classes.item)
        for(let item of notifications) {
            NotificationCenter.registerHide(new Notification({
                message: item
            }));
        }
    }

    static present(notification) {
        document
            .querySelector("." + Notification.classes.container)
            .appendChild(notification.message);

        NotificationCenter.registerHide(notification)
    }

    static registerHide(notification) {
        if(notification.hideAfter != null) {
            let auto = setTimeout(
                function() { NotificationCenter.hide(notification); },
                notification.hideAfter
            );
        }

        notification.message.addEventListener(
            "click",
            event => {
                NotificationCenter.hide(notification);
                if(typeof auto !== 'undefined') {
                    clearTimeout(auto);
                }
            }
        );
    }

    static hide(notification) {
        notification.message.classList.add("is-sliding-up");
        setTimeout(
            function() {
                let node = notification.message;
                if(node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            },
            500
        );
    }
}

class Notification {
    constructor(options) {
        if (options.log) { console.log(options.log); }

        this.hideAfter = 15 * 1000;

        if (options.message) {
            // Constructs a Notification object
            // using a pre-existing message element.
            this.message = options.message;
            this.message.classList.remove("is-hidden");
        } else if (options.status && options.content) {
            // Constructs a Notification object,
            // creating a new message element.
            this.message = document.createElement("div");
            this.message.classList.add(Notification.classes.item);
            this.message.classList.add("Notification--" + options.status);
            if(options.status == "failed") {
                this.hideAfter = null;
            }
            this.message.innerHTML = options.content +
                "<span class=\"Notification-dismiss Icon Icon-times\"></span>";
        } else {
            throw new Error("Invalid Arguments For New Notification: " + JSON.stringify(options));
        }
    }

    static isNotification(obj) {
        return obj.message !== undefined || (obj.content !== undefined && obj.status !== undefined);
    }
}

Notification.classes = {
    container: "Notification-container",
    item: "Notification"
};
