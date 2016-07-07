class SmoothState {
    constructor() {
        this.loading = false;
        this.smoothState = $("#page").smoothState({
            anchors: ".Link--smoothState",
            root: $(document),
            cacheLength: 0,
            forms: "null",
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
        }).data('smoothState');
    }

    onStart(container) {
        for(let item of document.querySelectorAll("html, body")) { item.scrollTop = 0; }
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
                return document.querySelector(".pace-activity").classList.add("pace-activity-active");
            }
        }, blocks.length * 100);*/
    }

    onProgress(container) {
        SmoothState.setCursor('wait');
    };

    static setCursor(mode) {
        let items = document.querySelectorAll("html, body");
        for(let item of items) {
            item.style.cursor = mode;
        }
        let links = document.querySelectorAll("a");
        for(let item of links) {
            item.style.cursor = mode;
        }
    }

    onReady(container, content) {
        SmoothState.setCursor('auto');

        Oxygen.reset();
        container[0].style.display = 'none';
        container.html(content);
        document.querySelector(".pace-activity").classList.remove("pace-activity-active");
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
    };

    onAfter(container, content) {
        this.loading = false;
        //document.querySelector(".pace-activity").classList.remove("pace-activity-active");
        return Oxygen.init(document.getElementById("page"));
    };

    static setTheme(theme) {
        console.log("Setting SmoothState Theme: ", theme);
        let page = document.getElementById("page");
        if(page) {
            page.classList.add('Page-transition--' + theme);
        }
    };

    load(url, push) {
        return this.smoothState.load(url, push);
    };

}
