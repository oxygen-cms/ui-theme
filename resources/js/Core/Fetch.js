// ================================
//            AjaxRequest
// ================================

window.Oxygen || (window.Oxygen = {});

class FetchOptions {
    constructor() {
        this.headers = new Headers();
    }
    wantJson() {
        this.headers.set("Accept", "application/json");
        return this;
    }
    contentType(type) {
        this.headers.set("Content-Type", type);
        return this;
    }
    method(method) {
        this.method = method;
        return this;
    }
    body(body) {
        this.body = body;
        return this;
    }
    cookies() {
        this.credentials = "same-origin";
        return this;
    }

    static default() {
        return (new FetchOptions()).cookies()
    }
}

Oxygen.respond = {};

Oxygen.respond.text = function(response) {
    return response.text();
}
Oxygen.respond.json = function(response) {
    return response.json();
}

Oxygen.respond.checkStatus = function(response) {
    if(response.ok) {
        return response;
    } else {
        let error = new Error();
        error.response = response;
        throw error;
            /*.catch(error => {
                response.text().then(text => {
                    Oxygen.error.jsonParseError(error, text);
                });
                throw error;
            })*/
    }
};

Oxygen.respond.notification = function(data) {
    if(Notification.isNotification(data)) {
        NotificationCenter.present(new Notification(data));
    }
    return data;
};

Oxygen.respond.redirect = function(data) {
    if(data.redirect) {
        if (window.smoothState && !(data.hardRedirect === true)) {
            window.smoothState.load(data.redirect, false);
        } else {
            window.location.replace(data.redirect);
        }
    }
    return data;
};

// handle network errors
// if(error.response.readyState === 0) {
//     console.error(response);
// }
// Oxygen.error.jsonParseError = function(error, text) {
//     console.error("Error while parsing JSON: ", error);
//     console.log("Raw response: ", text);
//
//     new Notification({
//         content: "Could not parse JSON response. This is a bug.",
//         status: "failed"
//     });
// };

Oxygen.respond.handleAPIError = function(error) {
    if(error.response && error.response instanceof Response) {
        error.response
            .json()
            .then(Oxygen.handleAPIError)
            .catch(err => {
                console.err("Error response did not contain valid JSON: ", err);
                NotificationCenter.present(new Notification({
                    content: "Whoops, looks like something went wrong.",
                    status: "failed"
                }));
            });
    } else {
        throw error;
    }
};

Oxygen.handleAPIError = function(content) {
    console.error(content);
    if(Notification.isNotification(content)) {
        NotificationCenter.present(new Notification(content));
    } else if(content.error) {
        NotificationCenter.present(new Notification({
            content:
            "PHP Exception of type <code class=\"no-wrap\">" + content.error.type +
            "</code> with message <code class=\"no-wrap\">" + content.error.message +
            "</code> thrown at <code class=\"no-wrap\">" + content.error.file + ":" + content.error.line +
            "</code>",
            status: "bug"
        }));
    } else {
        console.log("JSON error response unhandled: ", content);

        NotificationCenter.present(new Notification({
            content: "Whoops, looks like something went wrong.",
            status: "failed"
        }));
    }
};
