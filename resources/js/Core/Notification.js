// ================================
//             Notification
// ================================

class NotificationCenter {
    static present(notification) {
        window.Oxygen.notify(notification);
    }
}

class Notification {
    constructor(options) {
        if (options.log) { console.log(options.log); }

        this.content = options.content;
        this.status = options.status;
        this.duration = 15 * 1000;

        if(this.status === 'failed') {
            this.duration = null;
        }
    }

    static isNotification(obj) {
        return obj.message !== undefined || (obj.content !== undefined && obj.status !== undefined);
    }
}

export { Notification, NotificationCenter };
