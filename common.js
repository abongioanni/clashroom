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
    else if(jqXHR.status == 500){
        $("#addResults").text("You have already enrolled in this course or the course does not exist!")
    }
}