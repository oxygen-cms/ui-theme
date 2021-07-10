import ace from 'ace-builds';
import Preferences from '../Core/Preferences';
import Editor from './Editor';

class CodeViewInterface {

    constructor(editor) {
        this.editor = editor;
        this.ace = null;
    }

    create() {
        // edit the textarea
        ace.config.set('basePath', '/vendor/oxygen/ui-theme/vendor/ace/');
        ace.config.set('modePath', '/vendor/oxygen/ui-theme/vendor/ace/');
        ace.config.set('themePath', '/vendor/oxygen/ui-theme/vendor/ace/');
        ace.config.set('workerPath', '/vendor/oxygen/ui-theme/vendor/ace/');
        var object = ace.edit(this.editor.name + '-ace-editor');

        // set user preferences
        object.getSession().setMode('ace/mode/' + this.editor.language);
        object.setTheme(Preferences.get('editor.ace.theme'));
        object.getSession().setUseWrapMode(Preferences.get('editor.ace.wordWrap'));
        object.setHighlightActiveLine(Preferences.get('editor.ace.highlightActiveLine'));
        object.setShowPrintMargin(Preferences.get('editor.ace.showPrintMargin'));
        object.setShowInvisibles(Preferences.get('editor.ace.showInvisibles'));
        object.setReadOnly(this.editor.readOnly);

        // store object
        this.ace = object;
        this.view = document.getElementById(this.editor.name + '-ace-editor');
        this.view.style.fontSize = Preferences.get('editor.ace.fontSize');
    }

    show(full) {
        this.view.classList.remove(Editor.classes.state.isHidden);
        if (full) {
            this.view.style.width = '100%';
        }

        // after animation is completed
        setTimeout(() => {
            this.resize();
        }, 300);
    }

    hide() {
        this.view.classList.add(Editor.classes.state.isHidden);
    }

    valueFromForm() {
        this.ace.setValue(this.editor.textarea.value, -1);
    }

    valueToForm() {
        this.editor.textarea.value = this.ace.getValue();
    }

    async insertMediaItem() {
        try {
            let result = await window.Oxygen.insertMediaItem();
            if(result) {
                this.ace.insert(result);
            }
        } catch(e) {
            console.warn(e);
        }

    }

    resize() {
        this.ace.resize();
    }
}

export default CodeViewInterface;
