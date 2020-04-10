import Dropdown from './Core/Dropdown';
import { Form } from './Core/Form';
import Preferences from './Core/Preferences';
import SmoothState from './Core/SmoothState';
import MainNav from './Core/MainNav';
import { init } from './pages';
import '../scss/main.scss';

document.addEventListener('DOMContentLoaded', function() {
    MainNav.headroom();

    if ((typeof window.Oxygen.user !== 'undefined' && window.Oxygen.user !== null)) {
        Preferences.setPreferences(window.Oxygen.user);
    }

    init(document);

    if (Preferences.get('pageLoad.smoothState.enabled', true) === true) {
        console.log('smoothstate enabled');
        window.smoothState = new SmoothState();
        SmoothState.setTheme(Preferences.get('pageLoad.smoothState.theme', 'slide'));
    } else {
        console.log('smoothstate disabled');
    }

    let progressThemes = Preferences.get('pageLoad.progress.theme', ['minimal', 'spinner']);
    console.log('Applying progress themes:', progressThemes);
    for (let i = 0, theme; i < progressThemes.length; i++) {
        theme = progressThemes[i];
        document.body.classList.add('Page-progress--' + theme);
    }

    Form.registerKeydownHandler();
    Dropdown.registerGlobalEvent();
});
