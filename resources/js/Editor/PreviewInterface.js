// ================================
//          PreviewInterface
// ================================

import {getFormDataObject } from '../Core/Form';
import Editor from './Editor';
import { respond, FetchOptions } from '../Core/Fetch';
import {Toggle} from "../Core/Toggle";

class PreviewInterface {

    constructor(editor) {
        this.editor = editor;
        this.view = null;
        this.renderLayoutToggle = new Toggle(
            this.editor.container.querySelector('.' + Editor.classes.button.toggleRenderLayout),
            () => { this.renderLayout = true; this.valueFromForm(); },
            () => { this.renderLayout = false; this.valueFromForm(); }
        );
    }

    create() {
        let preview = document.createElement('iframe');
        preview.id = this.editor.name + '-preview';
        preview.classList.add(Editor.classes.editor.preview);
        this.editor.container.querySelector('.Editor-content').appendChild(preview);
        this.view = preview;
        this.view.addEventListener('load', this.onIframeLoaded.bind(this));
    }

    show(full) {
        if(this.editor.fullscreenToggle.get() && !this.renderLayout) {
            this.renderLayoutToggle.set(true);
        }

        let preview = document.getElementById(this.editor.name + '-preview')
        preview.classList.remove(Editor.classes.state.isHidden);

        this.editor.container.querySelector('.' + Editor.classes.button.toggleRenderLayout).style.display = 'block';

        if(full) {
            preview.style.width = '100%';
        }
    }

    hide() {
        document.getElementById(this.editor.name + '-preview').classList.add(Editor.classes.state.isHidden);

        this.editor.container.querySelector('.' + Editor.classes.button.toggleRenderLayout).style.display = 'none';
    }

    valueFromForm() {
        let data = {
            _token: this.editor.container.querySelector('.contentPreviewCSRFToken').value,
            renderLayout: this.renderLayoutToggle.get() ? 'true' : 'false',
            content: this.editor.textarea.value
        };
        let url = this.editor.container.querySelector('.contentPreviewURL').value;
        let method = this.editor.container.querySelector('.contentPreviewMethod').value;
        console.debug('Regenerating preview content');
        window.fetch(
            url,
            FetchOptions.default()
                .method(method)
                .body(getFormDataObject(data))
        )
            .then(respond.checkStatus)
            .then(respond.text)
            .then((data) => {
                this.view.srcdoc = data;
            })
            // this particular endpoint returns an HTML error page, so we provide a custom handler.
            .catch((error) => {
                if(error.response && error.response instanceof Response) {
                    console.error(error);
                    error.response.text().then((data) => {
                        this.view.srcdoc = data;
                    });
                } else {
                    throw error;
                }
            });
    }

    // we can't and don't want to do this
    valueToForm() {}

    onLoadedPage(id) {
        if(this.editor.name === 'content') {
            console.log('Navigated', id);
            if(window.location.pathname === '/oxygen/view/pages/' + id + '/edit') {
                console.log('Already on this page');
                return true;
            }
            window.location.replace('/oxygen/view/pages/' + id + '/edit?mode=' + this.editor.currentMode);
            return true;
        }
        return false;
    }

    onIframeLoaded() {
        // TODO: make this less of a hack
        // we rewrite intra-page anchor elements to use `about:srcdoc` as the page URL
        // that way it doesn't break when loaded inside of an iframe using the `srcdoc` attribute.
        console.log('iframe loaded, rewriting anchor tags');
        let anchors = this.view.contentDocument.querySelectorAll('a[href^=\\#]');
        for(let anchor of anchors) {
            anchor.href = 'about:srcdoc#' + anchor.getAttribute('href').substring(1);
        }
    }

    onEnteredFullscreen() {
        if(!this.renderLayoutToggle.get()) {
            this.renderLayoutToggle.set(true);
        }
    }

    onExitedFullscreen() {
        if(this.renderLayoutToggle.get()) {
            this.renderLayoutToggle.set(false);
        }
    }

}

export default PreviewInterface;
