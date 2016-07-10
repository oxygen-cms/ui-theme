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
        let data = {
            _token: this.editor.container.querySelector(".contentPreviewCSRFToken").value,
            content: this.editor.textarea.value
        };
        let url = this.editor.container.querySelector(".contentPreviewURL").value;
        let method = this.editor.container.querySelector(".contentPreviewMethod").value;
        console.log("Generating content using data ", data);
        var promise = window.fetch(
            url,
            FetchOptions.default()
                .method(method)
                .body(getFormDataObject(data))
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
