// ================================
//            AjaxRequest
// ================================

class Dialog {

    static registerEvents(container) {
        container.find("[data-dialog-type=\"confirm\"]").on("click", this.handleConfirmClick);
        return container.find("[data-dialog-type=\"alert\"]").on("click", this.handleAlertClick);
    }

    static handleAlertClick(event) {
        var target = $(event.currentTarget);
        return vex.dialog.alert(target.attr("data-dialog-message"));
    }

    static handleConfirmClick(event, customConfig) {
        var target = $(event.currentTarget);

        if (!(target.attr("data-dialog-disabled") === "true")) {
            var defaultConfig;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation(),

            defaultConfig = {
                message: target.attr("data-dialog-message"),
                callback(value) {
                    if (value) {
                        target.attr("data-dialog-disabled", "true");
                        return target[0].click();
                    }
                }
            };

            for (var attribute in customConfig) {
                defaultConfig[attribute] = customConfig[attribute];
            }

            return vex.dialog.confirm(defaultConfig);
        }
    }
};


