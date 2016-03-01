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
        var elements;
        $("html, body").animate({
            scrollTop: 0
        });
        this.loading = true;
        elements = $('.Block');
        $(elements.get().reverse()).each(function(index) {
            var block, timeout;
            block = $(this);
            timeout = index * 100;
            return setTimeout(function() {
                return block.addClass('Block--isExiting');
            }, timeout);
        });
        return setTimeout(function() {
            if (this.loading) {
                return $(".pace-activity").addClass("pace-activity-active");
            }
        }, elements.length * 100);
    }

    onProgress(container) {
        return $("html, body").css('cursor', 'wait').find('a').css('cursor', 'wait');
    };

    onReady(container, content) {
        $("html, body").css('cursor', 'auto').find('a').css('cursor', 'auto');
        Oxygen.reset();
        container.hide();
        container.html(content);
        $(".pace-activity").removeClass("pace-activity-active");
        $('.Block').each(function (index) {
            var block, timeout;
            block = $(this);
            timeout = index * 100;
            block.addClass('Block--isHidden');
            return setTimeout(function () {
                block.removeClass('Block--isHidden');
                block.addClass('Block--isEntering');
                return setTimeout(function () {
                    return block.removeClass('Block--isEntering');
                }, 350);
            }, timeout);
        });
        return container.show();
    };

    onAfter(container, content) {
        this.loading = false;
        $(".pace-activity").removeClass("pace-activity-active");
        return Oxygen.init($("#page"));
    };

    static setTheme(theme) {
        return $("#page").addClass('Page-transition--' + theme);
    };

    load(url, push) {
        return this.smoothState.load(url, push);
    };

}