// ================================
//            AjaxRequest
// ================================

class Dialog {

    static registerEvents(container) {
        for(let item of container.querySelectorAll("[data-dialog-type=\"confirm\"]")) {
            item.addEventListener("click", Dialog.handleConfirmClick);
        }
        for(let item of container.querySelectorAll("[data-dialog-type=\"alert\"]")) {
            item.addEventListener("click", Dialog.handleAlertClick);
        }
    }

    static handleAlertClick(event) {
        vex.dialog.alert(event.currentTarget.getAttribute("data-dialog-message"));
    }

    static handleConfirmClick(event, customConfig) {
        var target = event.currentTarget;
        if (!(target.getAttribute("data-dialog-disabled") === "true")) {
            var defaultConfig;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            defaultConfig = {
                message: target.getAttribute("data-dialog-message"),
                callback(value) {
                    if(value) {
                        target.setAttribute("data-dialog-disabled", "true");
                        target.click();
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


