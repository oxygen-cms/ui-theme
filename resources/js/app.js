import Dropdown from './Core/Dropdown';
import { Form } from './Core/Form';
import Preferences from './Core/Preferences';
import SmoothState from './Core/SmoothState';
import { init, reset } from './pages';
import '../scss/main.scss';

if(window.location === window.parent.location && window.location.href.search('/oxygen/view') !== -1)
{
    // we are *not* inside an iframe, that is bad news
    window.location.assign(window.location.href.replace('/oxygen/view', '/oxygen'));
}

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
