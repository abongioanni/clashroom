function inviaRichiesta(method, url, parameters = "") { //WRAPPER DELLA FUNZIONE JQUERY $.ajax
    return $.ajax({
        type: method,
        url: url,
        data: parameters,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        timeout: 5000,
    });
}

function redirect(jqXHR, test_status, str_error) {//CONTROLLO ERRORE MINIMO E REDIRECT A PAGINA DI LOGIN
    if (jqXHR.status == 403) {
        window.location.href = "login.html";
    }
    else if (jqXHR.status == 500) {
        $("#addResults").text("You have already enrolled in this course or the course does not exist!")
    }
}

function setPasswords() {       //IMPOSTAZIONE EVENTI CAMBIO PASSWORD
    $("#settings .success-alert").on("click", function () {
        $("#changePwd").removeClass("error");
        $("#changePwdConfirm").removeClass("error");

        if ($("#changePwd").val() == "") {
            $("#changePwd").addClass("error");
        }
        else if ($("#changePwdConfirm").val() == "") {
            $("#changePwdConfirm").addClass("error");
        }
        else if ($("#changePwdConfirm").val() != $("#changePwd").val()) {
            $("#changePwd").addClass("error");
            $("#changePwdConfirm").addClass("error");
        }
        else {
            if (checkPassword($("#changePwd").val())) {
                let u_ = inviaRichiesta("POST", "server/updatePassword.php", { "password": $("#changePwd").val() });
                u_.done(function (data) {

                })
                u_.fail(redirect);
            }
            else{
                alert("The new password must contains at least 1 special character, 1 number and it must to be 8 characters long!")
            }
        }
        $("#changePwd").val("")
        $("#changePwdConfirm").val("")
    });
}

function checkPassword(password) {
    var regularExpression = new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
    return regularExpression.test(password);
}

//GESTIONE DATE
function isToday(date) {
    let d = new Date(date);
    let t = getToday();
    return ($(".day-visible").text().toUpperCase() == "TODAY") &&
        (d.getFullYear() == t.year && pad(d.getMonth() + 1) == t.month && pad(d.getDate()) == t.day);
}

function isTomorrow(date) {
    let d = new Date(date);
    let t = getToday();
    return ($(".day-visible").text().toUpperCase() == "TOMORROW") &&
        (d.getFullYear() == t.year && pad(d.getMonth() + 1) == t.month && pad(d.getDate()) == pad(parseInt(t.day) + 1));
}

function getToday() {
    var today = new Date();
    var dd = pad(parseInt(today.getDate()));
    var mm = pad(parseInt(today.getMonth() + 1)); //January is 0!
    var yyyy = parseInt(today.getFullYear());
    return {
        "day": dd,
        "month": mm,
        "year": yyyy
    };
}

function pad(s) {
    return (s > 10 ? "" : "0") + s;
}

//SEXIONE INVIO NOTIFICA (INUTILIZZATO)
function sendNotification(title, text, icon) {
    if (Notification.permission === "granted") {
        createNotification(title, text, icon);
    }
    else {
        Notification.requestPermission(permission => {
            if (permission === "granted") {
                createNotification(title, text, icon);
            }
        })
    }
}

function createNotification(title, text, icon) {
    const notification = new Notification(title, {
        body: text,
        icon
    })
}