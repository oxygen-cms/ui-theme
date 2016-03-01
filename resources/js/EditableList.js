// ================================
//              Form
// ================================

class EditableList {

    static registerEvents(container) {
        container.find("." + EditableList.classes.add).on("click", EditableList.handleAdd);
        return container.on("click", "." + EditableList.classes.remove, EditableList.handleRemove);
    }

    static handleAdd(event) {
        var container = $(event.currentTarget).siblings("." + EditableList.classes.container);
        var template = container.find("." + EditableList.classes.template);
        template = template.clone().removeClass(EditableList.classes.template);
        console.log(template);
        container.append(template);
        return console.log('add');
    }

    static handleRemove(event) {
        var row = $(event.currentTarget).closest("." + EditableList.classes.row);
        row.remove();
        return console.log('remove');
    }
};

EditableList.classes = {
    container: "EditableList",
    template: "EditableList-template",
    row: "EditableList-row",
    remove: "EditableList-remove",
    add: "EditableList-add"
};