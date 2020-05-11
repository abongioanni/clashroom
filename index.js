"use strict";

$(document).ready(function () {
    let _btnLogin = $(".btn-grad").eq(0).on("click", function () {
        checkLogin();
    });
    let _password = $("#password")
    let _username = $("#username")

    $(document).on('keydown', function (e) {
        if (e.keyCode == 13)
            checkLogin();
    });

    function checkLogin() {
        if (_username.val() == "") {
            _username.addClass("is-invalid"); // bordo rosso textbox
            _username.prev().addClass("icona-rossa"); // colore icona
        }
        else if (_password.val() == "") {
            _password.addClass("is-invalid"); // bordo rosso textbox
            _password.prev().addClass("icona-rossa"); // colore icona
        }
        else {
            let user = _username.val();
            // md5 restituisce una word esadecimale, quindi è obbligatorio .toString()
            let pass = CryptoJS.MD5(_password.val()).toString();
            let _richiestaLogin = inviaRichiesta("POST", "server/login.php", { "username": user, "password": pass });
            _richiestaLogin.fail(function (jqXHR, test_status, str_error) {
                if (jqXHR.status == 401) { // unauthorized
                    _lblErrore.show();
                } else
                    error(jqXHR, test_status, str_error)
            });
            _richiestaLogin.done(function (data) {
                if (data.ris == "ok") // test inutile
                    window.location.href = "home.html"
            });
        }
    }
});