// ================================
//          ProgressBar
// ================================

import {selectorMatches} from "../util";

class TabSwitcher {

    static findAll(container) {
        for(let item of container.querySelectorAll(TabSwitcher.selectors.container)) {
            console.log(item);
            /*var tabs = $(item);
            if (tabs.classList.contains(TabSwitcher.classes.content)) {
                container = tabs;
            } else {
                container = tabs.parentNode.querySelector("." + TabSwitcher.classes.content);
            }

            if (container.length === 0) { container = tabs.parentNode.parentNode.querySelector("." + TabSwitcher.classes.content); }*/

            let tabs = selectorMatches(item, TabSwitcher.selectors.tabs) ? item : item.querySelector(TabSwitcher.selectors.tabs);
            let content = selectorMatches(item, TabSwitcher.selectors.content) ? item : item.querySelector(TabSwitcher.selectors.content);

            TabSwitcher.list.push(new TabSwitcher(tabs, content));
        }
    }

    // -----------------
    //       Object
    // -----------------

    constructor(tabs, content) {
        this.tabs = tabs;
        this.content = content;
        this.findDefault();
        this.registerEvents();
    }

    findDefault() {
        var tab = this.tabs.querySelector("[data-default-tab]").getAttribute("data-switch-to-tab");
        this.setTo(tab);
    }

    registerEvents() {
        this.tabs.querySelectorAll("[data-switch-to-tab]").forEach(item => {
            item.addEventListener("click", event => {
                this.setTo(event.currentTarget.getAttribute("data-switch-to-tab"));
            });
        });
    }

    setTo(tab) {
        this.current = tab;

        for(let item of this.content.querySelectorAll("[data-tab]")) {
            item.classList.remove(TabSwitcher.classes.active);
        }
        this.content.querySelector("[data-tab=\"" + tab + "\"]").classList.add(TabSwitcher.classes.active);

        for(let item of this.tabs.querySelectorAll("[data-switch-to-tab]")) {
            item.classList.remove(TabSwitcher.classes.active);
        }
        this.tabs.querySelector("[data-switch-to-tab=\"" + tab + "\"]").classList.add(TabSwitcher.classes.active);
    }
}

// -----------------
//       Static
// -----------------

TabSwitcher.classes = {
    active: "TabSwitcher--isActive"
};

TabSwitcher.selectors = {
    container: ".TabSwitcher",
    tabs: ".TabSwitcher-tabs",
    content: ".TabSwitcher-content"
}

TabSwitcher.list = [];

export default TabSwitcher;