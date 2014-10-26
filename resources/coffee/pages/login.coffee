Oxygen.initLogin = () ->

    loginForm = $(".Login-form")
        .addClass("Login--noTransition")
        .addClass("Login--slideDown")

    loginForm[0].offsetHeight;
    loginForm.removeClass("Login--noTransition")

    setTimeout( ->
        $("body").removeClass("Login--isHidden")
        return
    , 500)

    $(".Login-scrollDown").on("click", ->
        $(".Login-message").addClass("Login--slideUp")
        loginForm.removeClass("Login--slideDown")
        $(".Login-background--blur").addClass("Login--isHidden")
        return
    )

    loginForm.on("submit", ->
        loginForm.addClass("Login--slideUp")
        return
    )

    Ajax.handleErrorCallback = () ->
        loginForm.removeClass("Login--slideUp")
        return

    Ajax.handleSuccessCallback = (data) ->
        console.log data
        if data.status == "failed"
            loginForm.removeClass("Login--slideUp")
        return
    return
