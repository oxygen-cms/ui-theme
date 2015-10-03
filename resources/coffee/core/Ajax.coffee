# ================================
#            AjaxRequest
# ================================

window.Oxygen or= {}
window.Oxygen.Ajax = class Ajax

    @handleErrorCallback = (() -> )
    @handleSuccessCallback = (() -> )

    @sendAjax: (type, url, data) ->
        $.ajax({
            dataType: "json"
            type: type
            url: url
            data: data
            success: @handleSuccess
            error: @handleError
        })
        return

    # fires a link via ajax
    @fireLink: (event) ->
        event.preventDefault();
        @sendAjax("GET", $(event.target).attr("href"), null)

    # handles a successful response
    @handleSuccess: (data) =>
        console.log(data)

        if(data.redirect)
            if smoothState && !(data.hardRedirect == true)
                smoothState.load(data.redirect, false)
            else
                window.location.replace(data.redirect)

        new Notification(data);

        @handleSuccessCallback(data)

    # handles an error during an ajax request
    @handleError: (response, textStatus, errorThrown) =>
        # try to build a flash message from the error response
        try
            content = $.parseJSON(response.responseText)

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

        @handleErrorCallback(response, textStatus, errorThrown)
        return
