# ================================
#              Form
# ================================

#
# The Form helper can:
# - display a message upon exit if there are any unsaved changes.
# - send an ajax request with the form data on submit or change
#

window.Oxygen or= {}
window.Oxygen.Form = class Form

    @list = []

    @messages =
        confirmation: "You have made changes to this form.<br>Are you sure you want to exit?"

    @classes =
        warnBeforeExit: "Form--warnBeforeExit"
        submitOnKeydown: "Form--submitOnKeydown"
        sendAjax: "Form--sendAjax"
        sendAjaxOnChange: "Form--sendAjaxOnChange"
        autoSubmit: "Form--autoSubmit",
        taggableInput: ".Form-taggable"

    @findAll: (container) ->
        container.find("form").each ->
            Form.list.push new Form($(@))

        container.find(Form.classes.taggableInput).tagging({
            "edit-on-delete": false
        });

    @registerKeydownHandler: ->
        $(document).on("keydown", Form.handleKeydown)

    @handleKeydown: ->
        # check for Command/Control S
        if (event.ctrlKey or event.metaKey) and event.which is 83

            newList = []
            for form in Form.list
                if document.contains(form[0])
                    newList.push form
                    if form.hasClass(Form.classes.submitOnKeydown)
                        form.submit()

            event.preventDefault()
            Form.list = newList

    constructor: (element) ->
        @form = element
        @registerEvents()

    registerEvents: ->
        # Exit Dialog
        if @form.hasClass(Form.classes.warnBeforeExit)
            @form.find(":input").on("input change", @handleChange) # sets [data-changed="true"]
            @form.on("submit", @handleSave) # sets [data-changed="false"]
            $("a, button[type=\"submit\"]").on("click", @handleExit) # displays exit dialog

        # Submit via AJAX
        @form.on("submit", @sendAjax)  if @form.hasClass(Form.classes.sendAjax)
        @form.on("change", @sendAjax)  if @form.hasClass(Form.classes.sendAjaxOnChange)

        # Auto Submit
        if @form.hasClass(Form.classes.autoSubmit)
            @form.find('button[type="submit"]')[0].click();
        return

    handleChange: (event) =>
        @form.attr("data-changed", true)
        console.log("Form Changed")
        return

    handleSave: (event) =>
        @form.attr("data-changed", false)
        console.log("Form Saved")
        return

    handleExit: (event) =>
        if @form.attr("data-changed") == "true"
            return if $(event.currentTarget).hasClass("Form-submit")
            Dialog.handleConfirmClick(event, {
                message: Form.messages.confirmation
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, text: 'Discard Changes')
                    $.extend({}, vex.dialog.buttons.NO, text: 'Cancel')
                ]
            })
        return

    sendAjax: (event) =>
        event.preventDefault()
        Ajax.sendAjax(@form.attr("method"), @form.attr("action"), Form.getFormData(@form))
        return

    @getFormData: (form) ->
        data = {}
        form.find("[name]").each ->
            name = $(this).attr("name")
            value = $(this).val()

            if $(this).is("[type=\"checkbox\"]")
                data[name] = value  if $(this).is(":checked")
            else
                data[name] = value

        return data

    @getFormDataObject: (form) ->
        data = new FormData();
        form.find("[name]").each ->
            name = $(this).attr("name")
            value = $(this).val()

            if $(this).is("[type=\"checkbox\"]")
                data.append(name, value)  if $(this).is(":checked")
            else
                data.append(name, value)

        return data
