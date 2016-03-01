// ================================
//          ProgressBar
// ================================

class TabSwitcher {

    static findAll(container) {
        return container.find("." + TabSwitcher.classes.tabs).each(function() {
            var tabs = $(this);
            if (tabs.hasClass(TabSwitcher.classes.content)) {
                container = tabs;
            } else {
                container = tabs.siblings("." + TabSwitcher.classes.content);
            }

            if (container.length === 0) { container = tabs.parent().siblings("." + TabSwitcher.classes.content); }

            return TabSwitcher.list.push(new TabSwitcher(tabs, container));
        });
    }

    // -----------------
    //       Object
    // -----------------

    constructor(tabs, container) {
        this.handleClick = this.handleClick.bind(this);
        this.tabs = tabs;
        this.container = container;
        this.findDefault();
        this.registerEvents();
    }

    findDefault() {
        var tab = this.tabs.children("[data-default-tab]").attr("data-switch-to-tab");
        return this.setTo(tab);
    }

    registerEvents() {
        return this.tabs.children("[data-switch-to-tab]").on("click", this.handleClick);
    }

    handleClick(event) {
        var tab = $(event.currentTarget).attr("data-switch-to-tab");
        return this.setTo(tab);
    }

    setTo(tab) {
        this.current = tab;
        this.container.children("[data-tab]").removeClass(TabSwitcher.classes.active);
        this.container.children("[data-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active);
        this.tabs.children("[data-switch-to-tab]").removeClass(TabSwitcher.classes.active);
        return this.tabs.children("[data-switch-to-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active);
    }
}

// -----------------
//       Static
// -----------------

TabSwitcher.classes = {
    tabs: "TabSwitcher-tabs",
    content: "TabSwitcher-content",
    active: "TabSwitcher--isActive"
};

TabSwitcher.list = [];