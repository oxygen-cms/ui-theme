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
                if document.contains(form.form[0])
                    newList.push form
                    if form.form.hasClass(Form.classes.submitOnKeydown)
                        form.form.submit()
                        event.preventDefault()

            Form.list = newList

    constructor: (element) ->
        @form = element
        @originalData = element.serializeArray()
        @registerEvents()

    registerEvents: ->
        # Exit Dialog
        if @form.hasClass(Form.classes.warnBeforeExit)
            #@form.find(":input").on("input", @handleChange) # sets [data-changed="true"]
            @form.on("submit", @handleSave) # resets form data
            $("a, button[type=\"submit\"]").on("click", @handleExit) # displays exit dialog

        # Submit via AJAX
        @form.on("submit", @sendAjax)  if @form.hasClass(Form.classes.sendAjax)
        @form.on("change", @sendAjax)  if @form.hasClass(Form.classes.sendAjaxOnChange)

        # Auto Submit
        if @form.hasClass(Form.classes.autoSubmit)
            @form.find('button[type="submit"]')[0].click();


    handleExit: (event) =>
        return if $(event.currentTarget).hasClass("Form-submit")
        if JSON.stringify(@form.serializeArray()) != JSON.stringify(@originalData)
            Dialog.handleConfirmClick(event, {
                message: Form.messages.confirmation
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, text: 'Discard Changes')
                    $.extend({}, vex.dialog.buttons.NO, text: 'Cancel')
                ]
            })


    sendAjax: (event) =>
        event.preventDefault()
        Ajax.sendAjax(@form.attr("method"), @form.attr("action"), Form.getFormDataObject(@form), (data) =>
            if data.status == 'success'
                @originalData = @form.serializeArray()
                console.log('Form Saved Successfully')
        )

    ###@getFormData: (form) ->
        data = {}
        form.find("[name]").each ->
            name = $(this).attr("name")
            value = $(this).val()

            if $(this).is("[type=\"checkbox\"]") and !$(this).is(":checked")
                return

            if name.endsWith("[]")
                name = name.slice(0, -2);
                data[name] = []  if data[name] == undefined
                data[name].push(value)
            else
                data[name] = value

        return data###

    @getFormDataObject: (form) ->
        data = new FormData();
        form.find("[name]").each ->
            name = $(this).attr("name")
            value = $(this).val()

            if $(this).is("[type=\"checkbox\"]") and !$(this).is(":checked")
                return

            if $(this).is("[type=\"file\"]")
                files = this.filesToUpload ? this.files
                for file in files
                    data.append(name, file)
                return

            data.append(name, value)

        return data
