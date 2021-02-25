import Dropdown from './Core/Dropdown';
import { Form } from './Core/Form';
import Preferences from './Core/Preferences';
import SmoothState from './Core/SmoothState';
import { init, reset } from './pages';
import '../scss/main.scss';

document.addEventListener('DOMContentLoaded', function() {
    if ((typeof window.Oxygen.user !== 'undefined' && window.Oxygen.user !== null)) {
        Preferences.setPreferences(window.Oxygen.user);
    }

    // these are set by the parent page
    if (typeof window.Oxygen.onNavigationBegin === 'undefined') {
        window.Oxygen.onNavigationBegin = (url) => {
            console.log('Navigating to', url);
        }
    }
    if(typeof window.Oxygen.onNavigationEnd === 'undefined') {
        window.Oxygen.onNavigationEnd = () => {}
    }

    init(document);

    if (Preferences.get('pageLoad.smoothState.enabled', true) === true) {
        console.log('smoothstate enabled');
        window.smoothState = new SmoothState();
        SmoothState.setTheme(Preferences.get('pageLoad.smoothState.theme', 'page'));
    } else {
        console.log('smoothstate disabled');
    }

    Form.registerKeydownHandler();
    Dropdown.registerGlobalEvent();
});
