// ================================
//          CodeViewInterface
// ================================

class CodeViewInterface {

    constructor(editor) {
        this.editor = editor;
        this.view = null;
    }

    create() {
        // edit the textarea
        var object = ace.edit(this.editor.name + "-ace-editor");

        // set user preferences
        object.getSession().setMode("ace/mode/" + this.editor.language);
        object.setTheme(Preferences.get('editor.ace.theme'));
        object.getSession().setUseWrapMode(Preferences.get('editor.ace.wordWrap'));
        object.setHighlightActiveLine(Preferences.get('user.editor.ace.highlightActiveLine'));
        object.setShowPrintMargin(Preferences.get('editor.ace.showPrintMargin'));
        object.setShowInvisibles(Preferences.get('editor.ace.showInvisibles'));
        object.setReadOnly(this.editor.readOnly);
        $("#" + this.editor.name + "-ace-editor").css("font-size", Preferences.get('editor.ace.fontSize'));

        // store object
        return this.view = object;
    }

    show(full) {
        let editor = $("#" + this.editor.name + "-ace-editor");
        editor.removeClass(Editor.classes.state.isHidden);
        if (full) {
            return editor.css("width", "100%");
        }

        // after animation is completed
        setTimeout(() => {
            this.resize()
        }, 300)
    }

    hide() {
        console.log("CodeViewInterface.hide");
        return $("#" + this.editor.name + "-ace-editor").addClass(Editor.classes.state.isHidden);
    }

    valueFromForm() {
        this.view.setValue(this.editor.textarea.val(), -1);
    }

    valueToForm() {
        this.editor.textarea.val(this.view.getValue());
    }

    resize() {
        this.view.resize();
    }
}