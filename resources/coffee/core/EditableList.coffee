# ================================
#              Form
# ================================

#
# The Form helper can:
# - display a message upon exit if there are any unsaved changes.
# - send an ajax request with the form data on submit or change
#

window.Oxygen or= {}
window.Oxygen.EditableList = class EditableList

    @classes =
        container: "EditableList"
        template: "EditableList-template"
        row: "EditableList-row"
        remove: "EditableList-remove"
        add: "EditableList-add"

    @registerEvents: (container) ->
        container.find("." + EditableList.classes.add).on("click", EditableList.handleAdd)
        container.on("click", "." + EditableList.classes.remove, EditableList.handleRemove)

    @handleAdd: (event) ->
        container = $(event.currentTarget).siblings("." + EditableList.classes.container)
        template = container.find("." + EditableList.classes.template)
        template = template.clone().removeClass(EditableList.classes.template)
        console.log(template)
        container.append(template)
        console.log('add')

    @handleRemove: (event) ->
        row = $(event.currentTarget).closest("." + EditableList.classes.row)
        row.remove()
        console.log('remove')

