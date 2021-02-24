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
        window.Oxygen.openAlertDialog(event.currentTarget.getAttribute('data-dialog-message'));
    }

    static handleConfirmClick(event, customConfig) {
        const target = event.currentTarget;
        if(target.getAttribute('data-dialog-disabled') !== 'true') {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            let config = {
                message: target.getAttribute('data-dialog-message'),
                onConfirm: (value) => {
                    target.setAttribute('data-dialog-disabled', 'true');
                    target.click();
                }
            };

            for (const attribute in customConfig) {
                config[attribute] = customConfig[attribute];
            }

            window.Oxygen.openConfirmDialog(config);
        }
    }
}

Dialog.classes = {
    main: 'Dialog'
};

export default Dialog;


