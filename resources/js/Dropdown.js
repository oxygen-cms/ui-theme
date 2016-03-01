// ================================
//             Dropdown
// ================================ 

class Dropdown {

    static registerGlobalEvent() {
        return $(document).on("click", this.handleGlobalClick.bind(this));
    }

    static registerEvents(container) {
        return container.find("." + Dropdown.classes.dropdownToggle).on("click", this.handleClick.bind(this));
    }

    static handleClick(event) {
        var container = $(event.target);
        while (!container.hasClass(Dropdown.classes.dropdownToggle)) {
            if (container.is("a[href], form")) { return; }
            container = container.parent();
        }
        var dropdown = container.find("." + Dropdown.classes.dropdownList);
        if (dropdown.hasClass(Dropdown.classes.isActive)) {
            return dropdown.removeClass(Dropdown.classes.isActive);
        } else {
            $("." + Dropdown.classes.dropdownList).removeClass(Dropdown.classes.isActive);
            return dropdown.addClass(Dropdown.classes.isActive);
        }
    }

    static handleGlobalClick(event) {
        var target = $(event.target);
        var targetHasClass = target.hasClass(Dropdown.classes.dropdownToggle);
        var parentHasClass = target.parent().hasClass(Dropdown.classes.dropdownToggle);
        var ancestorExists = target.parents("." + Dropdown.classes.dropdownToggle).length;
        if (!targetHasClass && !parentHasClass && !ancestorExists) { return $("." + Dropdown.classes.dropdownList).removeClass(Dropdown.classes.isActive); }
    }
};

Dropdown.classes = {
    dropdownToggle: "Dropdown-container",
    dropdownList: "Dropdown",
    isActive: "is-active"
};