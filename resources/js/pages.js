import {NotificationCenter} from './Core/Notification';
import Dialog from './Core/Dialog';
import ImageEditor from './ImageEditor/ImageEditor';
import Dropdown from './Core/Dropdown';
import EditableList from './Core/EditableList';
import { Form } from './Core/Form';
import Upload from './Core/Upload';
import TabSwitcher from './Core/TabSwitcher';
import Slider from './Core/Slider';
import Editor from './Editor/Editor';
import initLogin from './login';
import initPreviewBox from './previewBox';
import initThemeChooser from './themeChooser';

window.Oxygen = window.Oxygen || {};

const reset = function() {
    window.Oxygen.editors = [];
    setBodyScrollable(true);
    return Dropdown.handleGlobalClick({ target: document.body });
};

const setBodyScrollable = function(scrollable) {
    if(scrollable) {
        document.body.classList.remove('Body--noScroll');
    } else {
        document.body.classList.add('Body--noScroll');
    }
};

const init = function(container) {

    Dialog.registerEvents(container);

    //
    // -------------------------
    //       IMAGE EDITOR
    // -------------------------
    //
    // Initialises image editors for the page.
    //

    ImageEditor.initialize(container);

    //
    // -------------------------
    //           LOGIN
    // -------------------------
    //
    // Login form animations.
    //

    if(document.querySelector('.Login-form')) {
        initLogin();
    }

    if(document.querySelector('.Content-preview')) {
        initPreviewBox();
    }

    if(document.querySelector('.ThemeChooser')) {
        initThemeChooser();
    }

    //
    // -------------------------
    //           OTHER
    // -------------------------
    //
    // Other event handlers.
    //

    Dropdown.registerEvents(container);
    EditableList.registerEvents(container);
    Form.findAll(container);
    Upload.registerEvents(container);
    TabSwitcher.findAll(container);
    Slider.findAll(container);

    //
    // -------------------------
    //       CODE EDITOR
    // -------------------------
    //
    // Initialises code editors for the page.
    //

    if ((typeof window.Oxygen.editors !== 'undefined' && window.Oxygen.editors !== null)) {
        Editor.createEditors(window.Oxygen.editors);
    }
};

export { init, setBodyScrollable, reset };
