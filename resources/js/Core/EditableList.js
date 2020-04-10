// ================================
//              Form
// ================================

import { parentOrSelfMatchingSelector, parentMatchingSelector } from '../util';

class EditableList {

    static registerEvents(container) {
        for(let item of container.getElementsByClassName(EditableList.classes.add)) {
            item.addEventListener('click', EditableList.handleAdd);
        }
        container.addEventListener('click', EditableList.handleRemove);
    }

    static handleAdd(event) {
        var container = event.currentTarget.parentNode.querySelector('.' + EditableList.classes.container);
        var template = container.querySelector('.' + EditableList.classes.template);
        var template2 = template.cloneNode(true);
        template2.classList.remove(EditableList.classes.template);
        container.appendChild(template2);
    }

    static handleRemove(event) {
        let item = parentOrSelfMatchingSelector(event.target, '.' + EditableList.classes.remove);
        if(item) {
            var row = parentMatchingSelector(event.target, '.' + EditableList.classes.row);
            if(row.parentNode) {
                row.parentNode.removeChild(row);
                console.log('removed node');
            }
        }
    }
}

EditableList.classes = {
    container: 'EditableList',
    template: 'EditableList-template',
    row: 'EditableList-row',
    remove: 'EditableList-remove',
    add: 'EditableList-add'
};

export default EditableList;