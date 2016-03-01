// ================================
//          DesignViewInterface
//   ================================

class DesignViewInterface {

    constructor(editor) {
        this.editor = editor;
        this.view = null;
    }

    create() {
        var config = Preferences.get('editor.ckeditor', {});
        config.customConfig = config.customConfig || '';
        config.contentsCss = this.editor.stylesheets;

        console.log(config);

        // create instance
        var object = CKEDITOR.replace(this.editor.name + "-editor", config);

        // store object
        return this.view = object;
    }

    show(full) {
        $("#cke_" + this.editor.name + "-editor").show();
        if (full) {
            $("#" + this.editor.name + "-ace-editor").css("width", "100%");
        }
        return;
    }

    hide() {
        $("#cke_" + this.editor.name + "-editor").hide();
    }

    valueFromForm() {
        return this.view.setData(this.editor.textarea.val());
    }

    valueToForm() {
        return $("textarea[name=\"" + this.editor.name + "\"]").val(this.view.getData());
    }
}