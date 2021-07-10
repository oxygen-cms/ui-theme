import SplitViewInterface from './SplitViewInterface';
import PreviewInterface from './PreviewInterface';
import CodeViewInterface from './CodeViewInterface';
import DesignViewInterface from './DesignViewInterface';
import {FullscreenToggle, Toggle} from '../Core/Toggle';
import { parentMatchingSelector } from "../util";
import Preferences from "../Core/Preferences";

class Editor {

    // only create if textarea exists
    static createEditors(editors) {
        for (var i = 0, editor; i < editors.length; i++) {
            editor = editors[i];
            var textarea = document.querySelector('textarea[name=\"' + editor.name + '\"]');
            if (textarea) {
                if(!editor.mode) {
                    editor.mode = Preferences.get('editor.defaultMode');
                }
                console.log('Found editor', editor);

                var fullscreenImmediately = false;
                // in certain situations we go straight into fullscreen editing!!
                if(editor.name === 'content') {
                    let queryParams = decodeURI(window.location.search)
                        .substring(1)
                        .split('&')
                        .map(param => param.split('='))
                        .reduce((values, [ key, value ]) => {
                            values[ key ] = value
                            return values
                        }, {});
                    if(queryParams['mode']) {
                        fullscreenImmediately = true;
                        editor.mode = queryParams['mode'];
                    }
                }

                var e = new Editor(editor.name, editor.language, editor.mode, editor.readOnly, editor.stylesheets);
                if(fullscreenImmediately) {
                    e.fullscreenToggle.set(true);
                }

                Editor.list.push(e);
            } else {
                console.log('Editor not found');
                console.log(editor);
            }
        }
    }

    static onIframeLoadedEditablePage(id) {
        for(let editor of Editor.list) {
            if(editor.modes.preview) {
                if(editor.modes.preview.onLoadedPage(id)) {
                    break;
                }
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

        this.onCurrentModeUpdated();
        this.show();
        this.resizeToContent();
        this.registerEvents();
    }

    onCurrentModeUpdated() {
        // switch editor button
        for(let button of this.container.querySelectorAll('.' + Editor.classes.button.switchEditor)) {
            if(button.getAttribute('data-editor') === this.currentMode) {
                button.classList.add(Editor.classes.button.activeMode);
            } else {
                button.classList.remove(Editor.classes.button.activeMode);
            }
        }
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
            button.addEventListener('click', this.handleSwitchEditor.bind(this));
        }

        // ask the form to tell us when its data is being read,
        // so we can flush changes to the underlying <input>/<textarea> element
        let form = parentMatchingSelector(this.container, 'form');
        if(form !== null && form.formObject) {
            form.formObject.contentGenerators.push(form =>
                this.valueToForm()
            );
        }

        // switch editor button
        for(let button of this.container.querySelectorAll('.' + Editor.classes.button.insertMediaItem)) {
            button.addEventListener('click', this.insertMediaItem.bind(this));
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
                if(this.fullscreenToggle.get()) {
                    this.modes.preview.onEnteredFullscreen();
                }
                break;
            case 'split':
                this.modes.split = new SplitViewInterface(this);
                break;
        }
        this.modes[mode].create();
    }

    show(m, full = true) {
        var mode = this.getMode(m);
        console.log('Showing', mode);
        if (!this.modes[mode]) { this.create(mode); }
        this.modes[mode].show(full);
        this.currentMode = mode;
        this.onCurrentModeUpdated();
        this.valueFromForm(mode);
    }

    hide(m) {
        var mode = this.getMode(m);
        console.log('Hiding', mode);
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
        this.resizeToContainer();

        if(this.modes.preview) {
            this.modes.preview.onEnteredFullscreen();
        }
    }

    // exit fullscreen
    exitFullscreen() {
        this.resizeToContent();

        if(this.modes.preview) {
            this.modes.preview.onExitedFullscreen();
        }
    }

    handleSwitchEditor(event) {
        var editorToSwitch = event.currentTarget.getAttribute('data-editor');
        this.hide();
        return this.show(editorToSwitch);
    }

    insertMediaItem() {
        console.log('CURRENT MODE', this.currentMode);
        if(this.currentMode === 'code' || this.currentMode === 'split') {
            this.modes.code.insertMediaItem();
        } else {
            window.Oxygen.openAlertDialog('Please select the "Code" or "Split" view to insert media items');
        }
    }

    handleFormSubmit() {
        return this.valueToForm();
    }
}

window.Oxygen.onLoadedContentPageInsideIframe = Editor.onIframeLoadedEditablePage;

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
        fullscreenToggle: 'Editor--toggleFullscreen',
        activeMode: 'Editor--isActiveMode',
        insertMediaItem: 'Editor--insertMediaItem',
        toggleRenderLayout: 'Editor--toggleRenderLayout'
    }
};

export default Editor;
