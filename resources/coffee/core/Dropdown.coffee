# ================================
#             Dropdown
# ================================ 

window.Oxygen or= {}
window.Oxygen.Dropdown = class Dropdown

    @classes =
        dropdownToggle: "Dropdown-container"
        dropdownList: "Dropdown"
        isActive: "is-active"

    @registerGlobalEvent ->
        $(document).on("click", @handleGlobalClick.bind(@))

    @registerEvents: (container) ->
        container.find("." + @classes.dropdownToggle).on("click", @handleClick.bind(@))

    @handleClick: (event) ->
        container = $(event.target)
        while !container.hasClass(@classes.dropdownToggle)
            return if container.is("a[href], form")
            container = container.parent()
        dropdown = container.find("." + @classes.dropdownList)
        if dropdown.hasClass(@classes.isActive)
            dropdown.removeClass(@classes.isActive)
        else
            $("." + @classes.dropdownList).removeClass(@classes.isActive)
            dropdown.addClass(@classes.isActive)

    @handleGlobalClick: (event) ->
        target = $(event.target)
        targetHasClass = target.hasClass(@classes.dropdownToggle)
        parentHasClass = target.parent().hasClass(@classes.dropdownToggle)
        ancestorExists = target.parents("." + @classes.dropdownToggle).length
        $("." + @classes.dropdownList).removeClass(@classes.isActive)  if not targetHasClass and not parentHasClass and not ancestorExists