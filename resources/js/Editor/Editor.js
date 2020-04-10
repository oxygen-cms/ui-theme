import SplitViewInterface from './SplitViewInterface';
import PreviewInterface from './PreviewInterface';
import CodeViewInterface from './CodeViewInterface';
import DesignViewInterface from './DesignViewInterface';
import { FullscreenToggle } from '../Core/Toggle';
import { parentMatchingSelector } from "../util";
import Preferences from "../Core/Preferences";

class Editor {

    // only create if textarea exists
    static createEditors(editors) {
        for (var i = 0, editor; i < editors.length; i++) {
            editor = editors[i];
            var textarea = document.querySelector('textarea[name=\"' + editor.name + '\"]');
            if (textarea) {
                console.log('Editor found');
                if(!editor.mode) { editor.mode = Preferences.get('editor.defaultMode'); }
                console.log(editor);
                var e = new Editor(editor.name, editor.language, editor.mode, editor.readOnly, editor.stylesheets);
                Editor.list.push(e);
            } else {
                console.log('Editor not found');
                console.log(editor);
            }
        }
    }

    constructor(name, language, currentMode, readOnly, stylesheets = []) {
        this.enterFullscreen = this.enterFullscreen.bind(this);
        this.exitFullscreen = this.exitFullscreen.bind(this);
        this.handleSwitchEditor = this.handleSwitchEditor.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.name = name;
        this.language = language;
        this.currentMode = currentMode;
        this.readOnly = readOnly;
        this.stylesheets = stylesheets;
        this.modes = {};
        this.textarea = document.querySelector('textarea[name=\"' + this.name + '\"]');
        this.container = parentMatchingSelector(this.textarea, '.' + Editor.classes.editor.container);
        var toggle = this.container.querySelector('.' + Editor.classes.button.fullscreenToggle);
        if(toggle) {
            this.fullscreenToggle = new FullscreenToggle(toggle, this.container, this.enterFullscreen, this.exitFullscreen);
        }

        this.show();
        this.resizeToContent();
        this.registerEvents();
    }

    getMode(mode) {
        if (!(typeof mode !== 'undefined' && mode !== null)) {
            return this.currentMode;
        } else {
            return mode;
        }
    }

    registerEvents() {
        // switch editor button
        for(let button of this.container.querySelectorAll('.' + Editor.classes.button.switchEditor)) {
            button.addEventListener('click', this.handleSwitchEditor);
        }

        // ask the form to tell us when its data is being read,
        // so we can flush changes to the underlying <input>/<textarea> element
        var form = parentMatchingSelector(this.container, 'form');
        if(form !== null && form.formObject) {
            form.formObject.contentGenerators.push(form =>
                this.valueToForm()
            );
        }
    }

    create(m) {
        var mode = this.getMode(m);
        switch (mode) {
            case 'code':
                this.modes.code = new CodeViewInterface(this);
                break;
            case 'design':
                this.modes.design = new DesignViewInterface(this);
                break;
            case 'preview':
                this.modes.preview = new PreviewInterface(this);
                break;
            case 'split':
                this.modes.split = new SplitViewInterface(this);
                break;
        }
        this.modes[mode].create();
    }

    show(m, full = true) {
        var mode = this.getMode(m);
        if (!this.modes[mode]) { this.create(mode); }
        this.modes[mode].show(full);
        this.currentMode = mode;
        this.valueFromForm(mode);
    }

    hide(m) {
        var mode = this.getMode(m);
        this.modes[mode].hide();
        this.valueToForm(mode);
    }

    valueFromForm(m) {
        var mode = this.getMode(m);
        this.modes[mode].valueFromForm();
    }

    valueToForm(m) {
        var mode = this.getMode(m);
        this.modes[mode].valueToForm();
    }

    resizeToContainer() {
        // resize ace
        if (this.modes.code) { this.modes.code.resize(); }
    }

    resizeToContent() {
        // size to content
        this.container.querySelector('.' + Editor.classes.editor.content).style.height = (this.textarea.rows * 1.5) + 'em';

        // resize ace
        if (this.modes.code) { this.modes.code.resize(); }
    }

    // enter fullscreen
    enterFullscreen() {
        console.log('fullscreen');
        this.resizeToContainer();
    }

    // exit fullscreen
    exitFullscreen() {
        console.log('exit');
        console.trace();
        this.resizeToContent();
    }

    handleSwitchEditor(event) {
        console.log('Editor.handleSwitchEditor');
        var editorToSwitch = event.currentTarget.getAttribute('data-editor');
        this.hide();
        return this.show(editorToSwitch);
    }

    handleFormSubmit() {
        return this.valueToForm();
    }
}

Editor.list = [];
Editor.classes = {
    editor: {
        container: 'Editor',
        header: 'Editor-header',
        content: 'Editor-content',
        footer: 'Editor-footer',
        preview: 'Editor-preview'
    },
    state: {
        isHidden: 'Editor--hidden',
        contentIsSplit: 'Editor-content--isSplit'
    },
    button: {
        switchEditor: 'Editor--switchEditor',
        fullscreenToggle: 'Editor--toggleFullscreen'
    }
};

export default Editor;