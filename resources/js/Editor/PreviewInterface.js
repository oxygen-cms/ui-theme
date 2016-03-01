// ================================
//          PreviewInterface
// ================================

class PreviewInterface {

    constructor(editor) {
        this.editor = editor;
        this.view = null;
    }

    create() {
        var preview = $("<iframe id=\"" + this.editor.name + "-preview\" class=\"" + Editor.classes.editor.preview + "\"></iframe>");
        preview.appendTo(this.editor.container.find(".Editor-content"));
        return this.view = preview;
    }

    show(full) {
        let preview = $("#" + this.editor.name + "-preview")
        preview.removeClass(Editor.classes.state.isHidden);

        if (full) {
            preview.css("width", "100%");
        }

        // create the stylesheets
        var head = "";
        var iterable = this.editor.stylesheets;
        for (var i = 0, stylesheet; i < iterable.length; i++) {
            stylesheet = iterable[i];
            head += "<link rel=\"stylesheet\" href=\"" + stylesheet + "\">";
        }
        this.view.contents().find("head").html(head);
        return this.view.contents().find("html").addClass("no-js " + $("html").attr("class").replace("js ", ""));
    }

    hide() {
        return $("#" + this.editor.name + "-preview").addClass(Editor.classes.state.isHidden);
    }

    valueFromForm() {
        return this.view.contents().find("body").html(this.editor.textarea.val());
    }

    // we can't and don't want to do this
    valueToForm() {}
}
