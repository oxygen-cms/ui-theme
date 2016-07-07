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
        var items = this.editor.container.querySelectorAll("." + Editor.classes.editor.content);
        for(let item of items) {
            item.classList.add(Editor.classes.state.contentIsSplit);
        }

        var e = this.editor;

        e.show("code", false);
        e.show("preview", false);
        e.modes.code.view.style.width = "50%";
        e.modes.preview.view.style.width = "50%";
        e.modes.code.ace.addEventListener("change", this.synchronize.bind(this));
    }

    hide() {
        var items = this.editor.container.querySelectorAll("." + Editor.classes.editor.content);
        for(let item of items) {
            item.classList.remove(Editor.classes.state.contentIsSplit);
        }

        this.editor.hide("code");
        this.editor.hide("preview");
    }

    valueFromForm() {
    }

    valueToForm() {
    }

    synchronize() {
        if(this.currentTimer) {
            clearTimeout(this.currentTimer);
        }
        this.currentTimer = setTimeout(() => {
            if(this.editor.currentMode === "split") {
                this.editor.valueToForm("code");
                this.editor.valueFromForm("preview");
            }
        }, 1000);
    }
}
