Oxygen || (Oxygen = {});
Oxygen.initLogin = function() {
    var loginForm = document.querySelector(".Login-form");
    loginForm.classList.add("Login--noTransition");
    loginForm.classList.add("Login--slideDown");

    loginForm.offsetHeight;
    loginForm.classList.remove("Login--noTransition");

    setTimeout(function() {
        document.body.classList.remove("Login--isHidden");
    }, 500);

    document.querySelector(".Login-scrollDown").addEventListener("click", function() {
        document.querySelector(".Login-message").classList.add("Login--slideUp");
        loginForm.classList.remove("Login--slideDown");
        document.querySelector(".Login-background--blur").classList.add("Login--isHidden");
    });

    let form = loginForm.querySelector("form");

    form.addEventListener("submit", function() {
        loginForm.classList.add("Login--slideUp");
    });

    form.modifyPromise = function(promise) {
        return promise.then(
            function(data) {
                if(data.status !== "success") {
                    loginForm.classList.remove("Login--slideUp");
                }
                return data;
            },
            function(error) {
                alert("awesome");
                loginForm.classList.remove("Login--slideUp");
                throw error;
            }
        );
    };
};
