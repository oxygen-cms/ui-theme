import vex from 'vex-js/src/vex.combined';
import 'vex-js/sass/vex.sass';

class Dialog {

    static registerEvents(container) {
        for(let item of container.querySelectorAll('[data-dialog-type=\'confirm\']')) {
            item.addEventListener('click', Dialog.handleConfirmClick);
        }
        for(let item of container.querySelectorAll('[data-dialog-type=\'alert\']')) {
            item.addEventListener('click', Dialog.handleAlertClick);
        }
    }

    static handleAlertClick(event) {
        vex.dialog.alert({
            unsafeMessage: event.currentTarget.getAttribute('data-dialog-message'),
            className: Dialog.classes.main
        });
    }

    static handleConfirmClick(event, customConfig) {
        const target = event.currentTarget;
        if(target.getAttribute('data-dialog-disabled') !== 'true') {
            let defaultConfig;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            defaultConfig = {
                unsafeMessage: target.getAttribute('data-dialog-message'),
                callback(value) {
                    if (value) {
                        target.setAttribute('data-dialog-disabled', 'true');
                        target.click();
                    }
                },
                className: Dialog.classes.main
            };

            for (var attribute in customConfig) {
                defaultConfig[attribute] = customConfig[attribute];
            }

            return vex.dialog.confirm(defaultConfig);
        }
    }
}

Dialog.classes = {
    main: 'Dialog'
};

export default Dialog;


