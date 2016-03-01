// ================================
//            Slider
// ================================

class Slider {

    static findAll(container) {
        return container.find(Slider.selectors.slider).each(function() {
            return Slider.list.push(new Slider($(this)));
        });
    }

    // -----------------
    //       Object
    // -----------------

    constructor(container) {
        this.container = container;
        this.list = this.container.find(Slider.selectors.list);
        this.items = this.container.find(Slider.selectors.item);

        this.total = this.items.length;
        this.interval = this.container.attr("data-interval") || 5000;

        this.previousId = 0;
        this.currentId = 0;
        this.nextId = 0;
        this.animating = false;
        this.animationTime = 1000;

        this.registerEvents();
        this.hideAll();
        this.next();

        if (this.container.attr("data-autoplay") === "true") {
            this.play();
        }
    }

    registerEvents() {
        this.container.find(Slider.selectors.back).on("click", this.previous.bind(this));
        this.container.find(Slider.selectors.forward).on("click", this.next.bind(this));
    }

    play() {
        var callback = this.container.attr("data-direction") === "reverse" ? this.previous.bind(this) : this.next.bind(this);
        this.timer = setInterval(callback, this.interval);
    }

    pause() {
        clearInterval(this.timer);
    }

    getItem(id) {
        return this.list.children(":nth-child(" + id + ")");
    }

    hideAll() {
        this.items.removeClass();
        this.items.addClass(Slider.classes.item + " " + Slider.classes.isHidden);
    }

    static allClasses() {
        return Slider.classes.isHidden + " " + Slider.classes.slideInLeft + " " + Slider.classes.slideInRight + " " + Slider.classes.slideOutLeft + " " + Slider.classes.slideOutRight;
    }

    next() {
        if (!this.shouldAnimate()) {
            return false;
        }

        this.previousId = this.currentId;

        this.currentId += 1;
        if (this.currentId > this.total) {
            this.currentId = 1;
        }

        this.nextId = this.currentId + 1;
        if (this.nextId > this.total) {
            this.nextId = 1
        }

        current = this.getItem(this.currentId);
        previous = this.getItem(this.previousId);

        this.hideAll();

        previous
            .removeClass(Slider.allClasses())
            .addClass(Slider.classes.slideOutLeft)

        current
            .removeClass(Slider.allClasses())
            .addClass(Slider.classes.slideInRight)
    }

    previous() {
        if (!this.shouldAnimate()) {
            return false;
        }

        this.nextId = this.currentId;

        this.currentId -= 1;
        if (this.currentId < 1) {
            this.currentId = this.total;
        }

        this.previousId = this.currentId - 1
        if (this.nextId < 1) {
            this.nextId = this.total
        }

        current = this.getItem(this.currentId);
        next = this.getItem(this.nextId);

        this.hideAll();

        next
            .removeClass(Slider.allClasses())
            .addClass(Slider.classes.slideOutRight)

        current
            .removeClass(Slider.allClasses())
            .addClass(Slider.classes.slideInLeft)
    }

    shouldAnimate() {
        if (this.animating) {
            return false;
        }

        this.animating = true;
        setTimeout(
            () => {
                this.animating = false;
            },
            this.animationTime
        );

        return true;
    }
};

Slider.selectors = {
    slider: ".Slider",
    list: ".Slider-list",
    item: ".Slider-item",
    back: ".Slider-back",
    forward: ".Slider-forward"
};

Slider.classes = {
    item: "Slider-item",
    isCurrent: "Slider-item--current",
    isHidden: "Slider-item--hidden",
    slideInLeft: "Slider-item--slideInLeft",
    slideInRight: "Slider-item--slideInRight",
    slideOutLeft: "Slider-item--slideOutLeft",
    slideOutRight: "Slider-item--slideOutRight",
    isAfter: "Slider-item--after",
    noTransition: "Slider--noTransition"
};

Slider.list = [];