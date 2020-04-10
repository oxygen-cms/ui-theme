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
        this.interval = this.container.getAttribute("data-interval") || 5000;

        this.previousId = 0;
        this.currentId = 0;
        this.nextId = 0;
        this.animating = false;
        this.animationTime = 1000;

        this.registerEvents();
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

    hideAll() {
        for(var item of this.items) {
            item.classList = "";
            item.classList.add(Slider.classes.item);
            item.classList.add(Slider.classes.isHidden);
        }
    }

    getItem(id) {
        let item = this.items[id];
        if(item === undefined || item === null) {
            console.error("no slider item at index: ", id);
        }
        return item;
    }

    next() {
        if (!this.shouldAnimate()) {
            return false;
        }

        this.previousId = this.currentId;

        this.currentId += 1;
        if (this.currentId >= this.items.length) {
            this.currentId = 0;
        }

        this.nextId = this.currentId + 1;
        if (this.nextId >= this.items.length) {
            this.nextId = 0;
        }

        var current = this.getItem(this.currentId);
        var previous = this.getItem(this.previousId);

        this.hideAll();

        previous.classList.remove(Slider.classes.isHidden);
        previous.classList.add(Slider.classes.slideOutLeft);
        current.classList.remove(Slider.classes.isHidden);
        current.classList.add(Slider.classes.slideInRight);
    }

    previous() {
        if (!this.shouldAnimate()) {
            return false;
        }

        this.nextId = this.currentId;

        this.currentId -= 1;
        if (this.currentId <= 0) {
            this.currentId = this.items.length - 1;
        }

        this.previousId = this.currentId - 1
        if (this.nextId <= 0) {
            this.nextId = this.items.length - 1;
        }

        var current = this.getItem(this.currentId);
        var next = this.getItem(this.nextId);

        this.hideAll();

        next.classList.remove(Slider.classes.isHidden);
        next.classList.add(Slider.classes.slideOutRight);
        current.classList.remove(Slider.classes.isHidden);
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

export default Slider;