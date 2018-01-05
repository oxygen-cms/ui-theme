// ================================
//          DesignViewInterface
//   ================================

class DesignViewInterface {

    constructor(editor) {
        this.editor = editor;
        this.ck = null;
    }

    create() {
        var config = Preferences.get('editor.ckeditor', {});
        config.customConfig = config.customConfig || '';
        config.allowedContent = true;
        config.entities = false;
        config.protectedSource = [
            // inline PHP
            /<\?[\s\S]*?\?>/g,
            // blade directives
            /(\n[ \t]*)?@\w+(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\))?\n?/g,
            // blade echo
            /{{[\s\S]*?}}}?/g
        ];
        config.contentsCss = this.editor.stylesheets;

        // create instance
        CKEDITOR.dtd.$removeEmpty["span"] = false;
        this.ck = CKEDITOR.replace(this.editor.name + "-editor", config);
        this.ck.on("instanceReady", event => {
            this.view = document.getElementById("cke_" + this.editor.name + "-editor");
            //put your code here
        });
    }

    show(full) {
        console.log("DesignViewInterface.show");
        if(this.view) {
            this.view.style.display = "block";
            if (full) {
                this.view.style.width = "100%";
            }
        } else {
            this.ck.on("instanceReady", event => {
                this.view.style.display = "block";
                if (full) {
                    this.view.style.width = "100%";
                }
            });
        }
    }

    hide() {
        this.view.style.display = "none";
    }

    valueFromForm() {
        this.ck.setData(this.editor.textarea.value);
    }

    valueToForm() {
        this.editor.textarea.value = this.ck.getData();
    }
}