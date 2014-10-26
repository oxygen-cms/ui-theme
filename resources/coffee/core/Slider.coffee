# ================================
#            Slider
# ================================

window.Oxygen or= {}
window.Oxygen.Slider = class Slider

    # -----------------
    #       Static
    # -----------------

    @selectors =
        slider: ".Slider"
        list: ".Slider-list"
        item: ".Slider-item"
        back: ".Slider-back"
        forward: ".Slider-forward"

    @classes =
        item: "Slider-item"
        isCurrent: "Slider-item--current"
        isHidden: "Slider-item--hidden"
        slideInLeft: "Slider-item--slideInLeft"
        slideInRight: "Slider-item--slideInRight"
        slideOutLeft: "Slider-item--slideOutLeft"
        slideOutRight: "Slider-item--slideOutRight"
        isAfter: "Slider-item--after"
        noTransition: "Slider--noTransition"

    @list = []

    @findAll: () ->
        $(Slider.selectors.slider).each ->
            Slider.list.push new Slider($(@))

    # -----------------
    #       Object
    # -----------------

    constructor: (container) ->
        @container = container
        @list = @container.find(Slider.selectors.list)
        @items = @container.find(Slider.selectors.item)

        @total = @items.length
        @interval = @container.attr("data-interval") or 5000

        @previousId = 0
        @currentId = 0
        @nextId = 0
        @animating = false
        @animationTime = 1000

        @registerEvents()
        @hideAll()
        @next()

        if @container.attr("data-autoplay") == "true"
            @play()

    registerEvents: () ->
        @container.find(Slider.selectors.back).on("click", @previous.bind(@))
        @container.find(Slider.selectors.forward).on("click", @next.bind(@))
        return

    play: () ->
        callback = if @container.attr("data-direction") == "reverse" then @previous.bind(@) else @next.bind(@)
        @timer = setInterval(callback, @interval)
        return

    pause: () ->
        clearInterval(@timer)
        return

    getItem: (id) ->
        return @list.children(":nth-child(" + id + ")")

    hideAll: () ->
        @items.removeClass()
        @items.addClass(Slider.classes.item + " " + Slider.classes.isHidden)
        return

    allClasses: () ->
        return Slider.classes.isHidden + " " +
            Slider.classes.slideInLeft + " " +
            Slider.classes.slideInRight + " " +
            Slider.classes.slideOutLeft + " " +
            Slider.classes.slideOutRight

    next: () ->
        if !@shouldAnimate() then return false

        @previousId = @currentId

        @currentId += 1
        if @currentId > @total
            @currentId = 1

        @nextId = @currentId + 1
        if @nextId > @total
            @nextId = 1

        current = @getItem(@currentId)
        previous = @getItem(@previousId)

        @hideAll

        previous
            .removeClass(@allClasses())
            .addClass(Slider.classes.slideOutLeft)

        current
            .removeClass(@allClasses())
            .addClass(Slider.classes.slideInRight)

        return

    previous: () ->
        if !@shouldAnimate() then return false

        @nextId = @currentId

        @currentId -= 1
        if @currentId < 1
            @currentId = @total

        @previousId = @currentId - 1
        if @nextId < 1
            @nextId = @total

        current = @getItem(@currentId)
        next = @getItem(@nextId)

        @hideAll

        next
            .removeClass(@allClasses())
            .addClass(Slider.classes.slideOutRight)

        current
            .removeClass(@allClasses())
            .addClass(Slider.classes.slideInLeft)

        return

    shouldAnimate: () ->
        if @animating
            return false

        @animating = true
        setTimeout( =>
            @animating = false
            return
        @animationTime)

        return true
