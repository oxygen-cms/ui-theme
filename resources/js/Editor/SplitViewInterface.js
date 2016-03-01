// ==========================
//     SplitViewInterface
// ==========================

class SplitViewInterface {

    constructor(editor) {
        this.editor = editor;
        this.view = null;
    }

    create() {
    }

    show() {
        this.editor.container.find("." + Editor.classes.editor.content).addClass(Editor.classes.state.contentIsSplit);
        this.editor.show("code", false);
        this.editor.show("preview", false);
        $("#" + this.editor.name + "-ace-editor, #" + this.editor.name + "-preview").css("width", "50%");
        return this.editor.modes.code.view.on("change", this.synchronize.bind(this));
    }

    hide() {
        this.editor.container.find("." + Editor.classes.editor.content).removeClass(Editor.classes.state.contentIsSplit);
        this.editor.hide("code");
        return this.editor.hide("preview");
    }

    valueFromForm() {
    }

    valueToForm() {
    }

    onChange() {
        return this.hasChanged = true;
    }

    synchronize() {
        if (this.editor.currentMode === "split") {
            console.log("SplitViewInterface.synchronize");
            this.editor.valueToForm("code");
            this.editor.valueFromForm("preview");
            return this.hasChanged = false;
        }
    }
}
