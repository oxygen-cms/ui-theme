// ================================
//            Slider
// ================================

class Slider {

    static findAll(container) {
        for(let item of container.querySelectorAll(Slider.selectors.slider)) {
            Slider.list.push(new Slider(item));
        }
    }

    // -----------------
    //       Object
    // -----------------

    constructor(container) {
        this.container = container;
        this.list = this.container.querySelector(Slider.selectors.list);
        this.items = this.container.querySelectorAll(Slider.selectors.item);

        this.total = this.items.length;
        this.interval = this.container.getAttribute("data-interval") || 5000;

        this.previousId = 0;
        this.currentId = 0;
        this.nextId = 0;
        this.animating = false;
        this.animationTime = 1000;

        this.registerEvents();
        this.hideAll();
        this.next();

        if (this.container.getAttribute("data-autoplay") === "true") {
            this.play();
        }
    }

    registerEvents() {
        this.container.querySelector(Slider.selectors.back).addEventListener("click", this.previous.bind(this));
        this.container.querySelector(Slider.selectors.forward).addEventListener("click", this.next.bind(this));
    }

    play() {
        var callback = this.container.getAttribute("data-direction") === "reverse" ? this.previous.bind(this) : this.next.bind(this);
        this.timer = setInterval(callback, this.interval);
    }

    pause() {
        clearInterval(this.timer);
    }

    getItem(id) {
        return this.list.querySelector(":nth-child(" + id + ")");
    }

    hideAll() {
        this.items.className = "";
        this.items.classList.add(Slider.classes.item);
        this.items.classList.add(Slider.classes.isHidden);
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

        for(item of Slider.allClasses()) {
            previous.classList.remove(item);
            current.classList.remove(item);
        }
        previous.classList.add(Slider.classes.slideOutLeft);
        current.classList.add(Slider.classes.slideInRight);
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

        for(item of Slider.allClasses()) {
            next.classList.remove(item);
            current.classList.remove(item);
        }
        next.classList.add(Slider.classes.slideOutRight);
        current.classList.add(Slider.classes.slideInLeft);
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