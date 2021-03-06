// ================================
//             Dropdown
// ================================

import { parentMatchingSelector, selectorMatches } from "../util";

class Dropdown {

    static registerGlobalEvent() {
        return document.addEventListener('click', Dropdown.handleGlobalClick);
    }

    static registerEvents(container) {
        for(let item of container.querySelectorAll('.' + Dropdown.classes.dropdownToggle)) {
            item.addEventListener('click', Dropdown.handleClick);
        }
    }

    static handleClick(event) {
        var c = event.target;
        while (!c.classList.contains(Dropdown.classes.dropdownToggle)) {
            if (selectorMatches(c, 'a[href], form')) { return; }
            c = c.parentNode;
        }
        // var dropdown = c.querySelector('.' + Dropdown.classes.dropdownList);
        var dropdown = c;
        if (dropdown.classList.contains(Dropdown.classes.isActive)) {
            dropdown.classList.remove(Dropdown.classes.isActive);
        } else {
            Dropdown.reset();
            dropdown.classList.add(Dropdown.classes.isActive);
        }
    }

    static handleGlobalClick(event) {
        if(parentMatchingSelector(event.target, '.' + Dropdown.classes.dropdownToggle) == null) {
            Dropdown.reset();
        }
    }

    static reset(event) {
        for(let item of document.querySelectorAll('.' + Dropdown.classes.dropdownToggle)) {
            item.classList.remove(Dropdown.classes.isActive);
        }
    }

};

Dropdown.classes = {
    dropdownToggle: 'Dropdown-container',
    dropdownList: 'Dropdown',
    isActive: 'is-active'
};

export default Dropdown;
