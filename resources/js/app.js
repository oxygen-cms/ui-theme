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

    if (typeof window.Oxygen.onNavigate === 'undefined') {
        window.Oxygen.onNavigationBegin = (url) => {console.log('Navigating to', url);}
        window.Oxygen.onNavigationEnd = () => {console.log('Navigation end');}
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
