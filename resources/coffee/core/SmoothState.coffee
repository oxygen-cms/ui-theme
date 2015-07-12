# ================================
#            Slider
# ================================

window.Oxygen or= {}
window.Oxygen.SmoothState = class SmoothState

    loading: false

    init: ->
        @smoothState = $("#page").smoothState({
            anchors: ".Link--smoothState"
            root: $(document)
            cacheLength: 0
            onStart:
                duration: 350
                render: @onStart
            onProgress:
                duration: 0
                render: @onProgress
            onReady:
                duration: 0
                render: @onReady
            onAfter: @onAfter
        }).data('smoothState');

    onStart: (container) =>
        $("html, body").animate({ scrollTop: 0 })

        @loading = true

        elements = $('.Block')
        $(elements.get().reverse()).each((index) ->
            block = $(this)
            timeout = index * 100
            setTimeout( ->
                block.addClass('Block--isExiting')
            timeout)
        );

        setTimeout( =>
            if @loading
                $(".pace-activity").addClass("pace-activity-active")
        elements.length * 100)

    onProgress: (container) =>
        $("html, body").css('cursor', 'wait')
             .find('a').css('cursor', 'wait')

    onReady: (container, content) =>
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

    onAfter: ($container, $content) =>
        @loading = false

        $(".pace-activity").removeClass("pace-activity-active")

        Oxygen.init $("#page")

    setTheme: (theme) ->
        $("#page").addClass('Page-transition--' + theme)

    load: (url, isPopped, ignoreCache) ->
        #@smoothState.load(url, isPopped, ignoreCache)
        @smoothState.load(url, isPopped)