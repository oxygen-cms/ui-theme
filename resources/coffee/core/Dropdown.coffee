# ================================
#             Dropdown
# ================================ 

window.Oxygen or= {}
window.Oxygen.Dropdown = class Dropdown

    @classes =
        dropdownToggle: "Dropdown-container"
        dropdownList: "Dropdown"
        isActive: "is-active"

    @registerEvents: ->
        $("." + @classes.dropdownToggle).on("click", @handleClick.bind(@))
        $(document).on("click", @handleGlobalClick.bind(@))

    @handleClick: (event) ->
        target = $(event.target)
        container = undefined
        if target.hasClass(@classes.dropdownToggle)
          container = target
        else
          container = target.parent()
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