"use strict";

$(document).ready(function () {
    let user={};
    let _openIcon = $(".icon");
    let _linksList = $(".links-wrapper ul li");
    let _backdrop = $(".backdrop");
    let _closeIcon = $(".close-btn");
    let _responsiveLinks = $("#menuNavbar");
    let _navbar = document.getElementsByClassName("responsive-navbar")[0];

    var sticky = _navbar.offsetTop;
    $(document).on("scroll", () => {
        if (window.pageYOffset >= sticky) {
            $(_navbar).addClass("sticky");
        } else {
            $(_navbar).removeClass("sticky");
        }
    });

    //LINKS UPDATE
    $(_responsiveLinks).children().remove();
    for (let i = 0; i < _linksList.length; i++) {
        let _a = $(_linksList).eq(i).find("a");
        let _newa;
        $("<li>", {
            appendTo: _responsiveLinks,
            append: [
                (_newa = $("<a>", {
                    text: $(_a).text(),
                    addClass: $(_a).attr("class"),
                }).on("click", () => {
                    $(_responsiveLinks).parent().removeClass("open");
                })),
            ],
        }); //AGGIORNAMENTO DEL MENU' RESPONSIVE
        if (!$(_a).prop("class").includes("googleIcon")) {
            _newa.prop("href", _a.prop("href"));
        }
    }

    //RESPONSIVE MENU'
    $(_openIcon).on("click", () => {
        $(_responsiveLinks).parent().addClass("open");
        $(_responsiveLinks).animate({ opacity: 1 }, 125);
    });
    $(_closeIcon).on("click", () => {
        $(_responsiveLinks).animate({ opacity: 0 }, 125, () => {
            $(_responsiveLinks).parent().removeClass("open");
        });
    });
    $(_backdrop).on("click", () => {
        $(_responsiveLinks).animate({ opacity: 0 }, 125, () => {
            $(_responsiveLinks).parent().removeClass("open");
        });
    });

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

    let user_=inviaRichiesta("GET","http://localhost:3000/USERS?id=0");
    user_.done(function(data){
        user=data[0];
        $("#user").text(user["nome"]);
        if(user["st"])
            $("a[name=change]").text("teachers");
        let events_=inviaRichiesta(
    });
    user_.fail(function(){console.log("errore")})



});