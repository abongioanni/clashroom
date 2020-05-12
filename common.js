function inviaRichiesta(method, url, parameters = "") {
    return $.ajax({
        type: method,
        url: url,
        data: parameters,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        timeout: 5000
    });
}