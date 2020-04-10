import { init, reset } from '../pages';
import $ from "jquery";
import Smoothstate from "../smoothState";

class SmoothState {
    constructor() {
        this.loading = false;
        const elem = document.getElementById('page');
        const options = {
            anchors: '.Link--smoothState',
            root: $(document),
            cacheLength: 0,
            forms: 'null',
            onStart: {
                duration: 350,
                render: this.onStart
            },
            onProgress: {
                duration: 0,
                render: this.onProgress
            },
            onReady: {
                duration: 0,
                render: this.onReady
            },
            onAfter: this.onAfter
        };
        if(elem !== null) {
            const tagname = elem.tagName.toLowerCase();
            // Checks to make sure the smoothState element has an id
            if (elem.id && tagname !== 'body' && tagname !== 'html') {
                this.smoothState = new Smoothstate(elem, options);
                // Makes public methods available via $('element').data('smoothState');
                // needed for the internal library to function
                $.data(elem, 'smoothState', this.smoothState);
            } else if (!elem.id) {
                // Throw warning if in debug mode
                console.warn('Every smoothState container needs an id but the following one does not have one:', this);
            } else if ((tagname === 'body' || tagname === 'html')) {
                // We dont support making the html or the body element the smoothstate container
                console.warn('The smoothstate container cannot be the ' + this.tagName + ' tag');
            }
        } else {
            console.warn('Smoothstate container #page not found');
        }
    }

    onStart(container) {
        for(let item of document.querySelectorAll('html, body')) { item.scrollTop = 0; }
        this.loading = true;

        var elements = document.getElementsByClassName('Block');
        var blocks = Array.prototype.slice.call(elements);
        blocks.reverse();
        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            setTimeout(function() {
                return block.classList.add('Block--isExiting');
            }, i * 50);
        }

        /*setTimeout(function() {
            if(this.loading) {
                return document.querySelector('.pace-activity').classList.add('pace-activity-active');
            }
        }, blocks.length * 100);*/
    }

    onProgress(container) {
        SmoothState.setCursor('wait');
    }

    static setCursor(mode) {
        let items = document.querySelectorAll('html, body');
        for(let item of items) {
            item.style.cursor = mode;
        }
        let links = document.querySelectorAll('a');
        for(let item of links) {
            if(mode === 'auto') {
                item.style.removeProperty('cursor');
            } else {
                item.style.cursor = mode;
            }
        }
    }

    onReady(container, content) {
        SmoothState.setCursor('auto');

        reset();
        container[0].style.display = 'none';
        container.html(content);
        // document.querySelector('.pace-activity').classList.remove('pace-activity-active');
        let blocks = document.getElementsByClassName('Block');
        for(var i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            block.classList.add('Block--isHidden');
            setTimeout(function() {
                block.classList.remove('Block--isHidden');
                block.classList.add('Block--isEntering');
                setTimeout(function() {
                    block.classList.remove('Block--isEntering');
                }, 250);
            }, i * 50);
        }
        container[0].style.display = 'block';
    }

    onAfter(container, content) {
        this.loading = false;
        //document.querySelector('.pace-activity').classList.remove('pace-activity-active');
        return init(document.getElementById('page'));
    }

    static setTheme(theme) {
        console.log('Setting SmoothState Theme: ', theme);
        let page = document.getElementById('page');
        if(page) {
            page.classList.add('Page-transition--' + theme);
        }
    }

    load(url, push) {
        return this.smoothState.load(url, push);
    }

}

export default SmoothState;
