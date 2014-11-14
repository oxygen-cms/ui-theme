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
            tabs = $(@)
            if tabs.hasClass(TabSwitcher.classes.content)
                container = tabs
            else
                container = tabs.siblings("." + TabSwitcher.classes.content)

            container = tabs.parent().siblings("." + TabSwitcher.classes.content)  if container.length == 0

            TabSwitcher.list.push new TabSwitcher(tabs, container)

    # -----------------
    #       Object
    # -----------------

    constructor: (tabs, container) ->
        @tabs = tabs
        @container = container
        @findDefault()
        @registerEvents()

    findDefault: ->
        tab = @tabs.children("[data-default-tab]").attr("data-switch-to-tab");
        @setTo(tab);

    registerEvents: ->
        @tabs.children("[data-switch-to-tab]").on("click", @handleClick)

    handleClick: (event) =>
        tab = $(event.currentTarget).attr("data-switch-to-tab")
        @setTo(tab);

    setTo: (tab) ->
        @current = tab
        @container.children("[data-tab]").removeClass(TabSwitcher.classes.active)
        @container.children("[data-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active)
        @tabs.children("[data-switch-to-tab]").removeClass(TabSwitcher.classes.active)
        @tabs.children("[data-switch-to-tab=\"" + tab + "\"]").addClass(TabSwitcher.classes.active)