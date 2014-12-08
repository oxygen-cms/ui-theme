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
                duration: 0,
                render: @onProgress
            onEnd:
                duration: 0
                render: @onEnd
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

    onProgress: (url, container) =>
        $("html, body").css('cursor', 'wait')
             .find('a').css('cursor', 'wait')

    onEnd: (url, container, content) =>
        $("html, body").css('cursor', 'auto')
             .find('a').css('cursor', 'auto');

        Oxygen.reset()
        container.hide()
        container.html(content)

        console.log($('.Block'))

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
        elements = $(document).add("*")
        elements.off()
        @smoothState.bindEventHandlers($(document))
        Oxygen.init()

    setTheme: (theme) ->
        $("#page").addClass('Page-transition--' + theme)