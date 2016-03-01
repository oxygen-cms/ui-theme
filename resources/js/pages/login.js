Oxygen || (Oxygen = {});
Oxygen.initLogin = function() {
    var loginForm = $(".Login-form")
        .addClass("Login--noTransition")
        .addClass("Login--slideDown");

    loginForm[0].offsetHeight;
    loginForm.removeClass("Login--noTransition");

    setTimeout(function() {
        $("body").removeClass("Login--isHidden")
    }, 500);

    $(".Login-scrollDown").on("click", function() {
        $(".Login-message").addClass("Login--slideUp");
        loginForm.removeClass("Login--slideDown");
        $(".Login-background--blur").addClass("Login--isHidden");
    });

    loginForm.on("submit", function() {
        loginForm.addClass("Login--slideUp");
    });

    Ajax.errorCallbacks.push(function(error) {
        loginForm.removeClass("Login--slideUp");
        return error;
    });

    Ajax.successCallbacks.push(function(data) {
        if (data.status == "failed") {
            loginForm.removeClass("Login--slideUp");
        }
        return data;
    });
};