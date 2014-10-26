# ================================
#          ProgressBar
# ================================

window.Oxygen or= {}
window.Oxygen.TabSwitcher = class TabSwitcher

    # -----------------
    #       Static
    # -----------------

    @classes =
        tabs: "TabSwitcher-tabs"
        content: "TabSwitcher-content"
        active: "TabSwitcher--isActive"

    @list = []

    @findAll: ->
        $("." + TabSwitcher.classes.tabs).each ->
            TabSwitcher.list.push new TabSwitcher($(@), $(@).parent().parent().find("." + TabSwitcher.classes.content))
        return

    # -----------------
    #       Object
    # -----------------

    constructor: (tabs, container) ->
        @tabs = tabs
        @container = container
        @findDefault()
        @registerEvents()
        return

    findDefault: ->
        tab = @tabs.find("[data-default-tab]").attr("data-switch-to-tab");
        @setTo(tab);
        return

    registerEvents: ->
        @tabs.find("[data-switch-to-tab]").on("click", @handleClick)
        return

    handleClick: (event) =>
        tab = $(event.currentTarget).attr("data-switch-to-tab")
        @setTo(tab);
        return

    setTo: (tab) ->
        @container.find("[data-tab]").removeClass(TabSwitcher.classes.active)
        @container.find("[data-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active)
        @tabs.find("[data-switch-to-tab]").removeClass(TabSwitcher.classes.active)
        @tabs.find("[data-switch-to-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active)
        return