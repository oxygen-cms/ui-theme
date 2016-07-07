// ================================
//          PreviewInterface
// ================================

class PreviewInterface {

    constructor(editor) {
        this.editor = editor;
        this.view = null;
    }

    create() {
        var preview = document.createElement("iframe");
        preview.id = this.editor.name + "-preview";
        preview.classList.add(Editor.classes.editor.preview);
        this.editor.container.querySelector(".Editor-content").appendChild(preview);
        this.view = preview;
    }

    show(full) {
        let preview = document.getElementById(this.editor.name + "-preview")
        preview.classList.remove(Editor.classes.state.isHidden);

        if (full) {
            preview.style.width = "100%";
        }
    }

    hide() {
        return document.getElementById(this.editor.name + "-preview").classList.add(Editor.classes.state.isHidden);
    }

    valueFromForm() {
        Pace.start();
        var promise = window.fetch(
            "content?content=" + encodeURIComponent(this.editor.textarea.value),
            FetchOptions.default().method('get')
        )
            .then(Oxygen.respond.checkStatus)
            .then(Oxygen.respond.text)
            .then((data) => {
                this.view.srcdoc = data;
            }).catch(Oxygen.respond.handleAPIError);
    }

    // we can't and don't want to do this
    valueToForm() {}
}
