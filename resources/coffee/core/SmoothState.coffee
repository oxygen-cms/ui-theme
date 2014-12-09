# ================================
#            Slider
# ================================

window.Oxygen or= {}
window.Oxygen.SmoothState = class SmoothState

    init: ->
        @smoothState = $("#page").smoothState({
            anchors: ".Link--smoothState"
            root: $(document)
            pageCacheSize: 0
            onStart:
                duration: 350
                render: @onStart
            onProgress:
                duration: 0
                render: @onProgress
            onEnd:
                duration: 0
                render: @onEnd
            callback: @callback
        }).data('smoothState');

    onStart: (url, container) =>
        $("html, body").animate({ scrollTop: 0 })

        elements = $('.Block')
        $(elements.get().reverse()).each((index) ->
            block = $(this)
            timeout = index * 100
            setTimeout( ->
                block.addClass('Block--isExiting')
            timeout)
        );

        setTimeout( ->
            $(".pace-activity").addClass("pace-activity-active")
        elements.length * 100)

    onProgress: (url, container) =>
        $("html, body").css('cursor', 'wait')
             .find('a').css('cursor', 'wait')

    onEnd: (url, container, content) =>
        $("html, body").css('cursor', 'auto')
             .find('a').css('cursor', 'auto');

        Oxygen.reset()
        container.hide()
        container.html(content)

        $(".pace-activity").removeClass("pace-activity-active")

        $('.Block').each((index) ->
            block = $(this)
            timeout = index * 100
            block.addClass('Block--isHidden')
            setTimeout( ->
                block.removeClass('Block--isHidden')
                block.addClass('Block--isEntering')
                setTimeout( ->
                    block.removeClass('Block--isEntering')
                350)
            timeout)
        );

        container.show()

    callback: (url, $container, $content) =>
        $(".pace-activity").removeClass("pace-activity-active")

        elements = $(document).add("*")
        elements.off()
        @smoothState.bindEventHandlers($(document))
        Oxygen.init()

    setTheme: (theme) ->
        $("#page").addClass('Page-transition--' + theme)

    load: (url, isPopped, ignoreCache) ->
        @smoothState.load(url, isPopped, ignoreCache)