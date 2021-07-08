import Dropdown from './Core/Dropdown';
import { Form } from './Core/Form';
import Preferences from './Core/Preferences';
import { init } from './pages';
import '../scss/main.scss';

if(window.location === window.parent.location && window.location.href.search('/oxygen/view') !== -1)
{
    // we are *not* inside an iframe, that is bad news
    window.location.assign(window.location.href.replace('/oxygen/view', '/oxygen'));
}

// we only support running inside of the Vue.js <LegacyPage> component
window.Oxygen.onLoadedInsideIFrame = () => {
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

    Form.registerKeydownHandler();
    Dropdown.registerGlobalEvent();
}
