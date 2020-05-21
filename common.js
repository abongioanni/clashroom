function inviaRichiesta(method, url, parameters = "") {
    return $.ajax({
        type: method,
        url: url,
        data: parameters,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        timeout: 5000,
    });
}

function redirect(jqXHR, test_status, str_error) {
    if (jqXHR.status == 403) {
        window.location.href = "login.html";
    }
    else if (jqXHR.status == 500) {
        $("#addResults").text("You have already enrolled in this course or the course does not exist!")
    }
}
function setPasswords() {
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
            let u_ = inviaRichiesta("POST", "server/updatePassword.php", { "password": $("#changePwd").val() });
            u_.done(function (data) {
        
            })
            u_.fail(redirect);
        }
        $("#changePwd").val("")
        $("#changePwdConfirm").val("")
    });
}

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