// ================================
//            AjaxRequest
// ================================

class Ajax {

    static request(type, url, data) {
        var promise = new Promise(function(resolve, reject) {
            $.ajax({
                dataType: "json",
                type: type,
                url: url,
                data: data,
                processData: false,
                contentType: false,
                success: data => resolve(data),
                error: (response, textStatus, errorThrown) => reject({ response: response, textStatus: textStatus, errorThrown: errorThrown })
            })
        });
        for (let handler of Ajax.successCallbacks) {
            promise = promise.then(handler);
        }
        for (let handler of Ajax.errorCallbacks) {
            promise = promise.catch(handler);
        }
        return promise;
    }

}

Ajax.successCallbacks = [];
Ajax.errorCallbacks = [];

Ajax.displayNotification = function(data) {
    console.log(data);
    new Notification(data);
    return data;
};

Ajax.handleRedirect = function(data) {
    if(data.redirect) {
        if (window.smoothState && !(data.hardRedirect === true)) {
            window.smoothState.load(data.redirect, false);
        } else {
            window.location.replace(data.redirect);
        }
    }
    return data;
};

Ajax.handleError = function(error) {
    console.log(error);
    // handle network errors
    if(error.response.readyState === 0) {
        console.error(response);
        new Notification({
            content: "Cannot connect to the server",
            status: "info"
        });
    }

    // try to build a flash message from the error response
    try {
        var content = $.parseJSON(error.response.responseText);

        if(content.content) {
            new Notification(content);
        } else {
            console.error(content);

            new Notification({
                content:
                "Exception of type <code class=\"no-wrap\">" + content.error.type +
                "</code> with message <code class=\"no-wrap\">" + content.error.message +
                "</code> thrown at <code class=\"no-wrap\">" + content.error.file + ":" + content.error.line +
                "</code>",
                status: "failed"
            });
        }
    } catch (e) {
        console.error(error.response.responseText);

        new Notification({
            content: "Whoops, looks like something went wrong.",
            status: "failed"
        });
    }
    return error;
};