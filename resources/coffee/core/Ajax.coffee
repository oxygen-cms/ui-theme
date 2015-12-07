# ================================
#            AjaxRequest
# ================================

window.Oxygen or= {}
window.Oxygen.Ajax = class Ajax

    @handleErrorCallback = (() -> )
    @handleSuccessCallback = (() -> )

    @sendAjax: (type, url, data, success=(->), error=(->)) ->
        $.ajax({
            dataType: "json"
            type: type
            url: url
            data: data
            processData: false
            contentType: false
            success: (data) =>
                @handleSuccess(data, [success, @handleSuccessCallback])
            error: (response, textStatus, errorThrown) =>
                @handleError(response, textStatus, errorThrown, [success, @handleErrorCallback])
        })

    # fires a link via ajax
    @fireLink: (event) ->
        event.preventDefault();
        @sendAjax("GET", $(event.target).attr("href"), null)

    # handles a successful response
    @handleSuccess: (data, callbackChain) =>
        console.log(data)

        if(data.redirect)
            if smoothState && !(data.hardRedirect == true)
                smoothState.load(data.redirect, false)
            else
                window.location.replace(data.redirect)

        new Notification(data);

        for callback in callbackChain
            callback(data)

    # handles an error during an ajax request
    @handleError: (response, textStatus, errorThrown, callbackChain) =>
        # handle network errors
        if(response.readyState == 0)
            console.error(response)
            new Notification({
                content: "Cannot connect to the server",
                status: "info"
            })
            return

        # try to build a flash message from the error response
        try
            content = $.parseJSON(response.responseText)

            if(content.content)
                new Notification(content);
            else
                console.error(content)

                new Notification({
                    content:
                        "Exception of type <code class=\"no-wrap\">" + content.error.type +
                        "</code> with message <code class=\"no-wrap\">" + content.error.message +
                        "</code> thrown at <code class=\"no-wrap\">" + content.error.file + ":" + content.error.line +
                        "</code>"
                    status: "failed"
                })
        catch e
            console.error(response.responseText)

            new Notification({
                content: "Whoops, looks like something went wrong."
                status: "failed"
            });

        for callback in callbackChain
            callback(response, textStatus, errorThrown)
