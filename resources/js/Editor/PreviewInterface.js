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
        /*var head = "";
        var iterable = this.editor.stylesheets;
        for (var i = 0, stylesheet; i < iterable.length; i++) {
            stylesheet = iterable[i];
            head += "<link rel=\"stylesheet\" href=\"" + stylesheet + "\">";
        }
        this.view.contents().find("head").html(head);
        return this.view.contents().find("html").addClass("no-js " + $("html").attr("class").replace("js ", ""));*/
    }

    hide() {
        return $("#" + this.editor.name + "-preview").addClass(Editor.classes.state.isHidden);
    }

    valueFromForm() {
        var promise = Ajax.request(
            "GET",
            "content?content=" + encodeURIComponent(this.editor.textarea.val()),
            new FormData(),
            "html"
        ).then((data) => {
            this.view[0].srcdoc = /*'data:text/html;charset=utf-8,' + encodeURIComponent(*/data;
            console.log(data);
        }).catch(Ajax.handleError);
    }

    // we can't and don't want to do this
    valueToForm() {}
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
