"use strict";

class Corso{
    constructor(data){
        this.Id=data["id"];
        this.Nome=data["nome"];
        this.Insegnante=data["insegnante"]
    }
}


$(document).ready(function () {
    let user = {};
    let courses = {};
    let todayEvents = [];
    let tomorrowEvents = [];

    let _timeline = $(".timeline").eq(0)
    let _day=$(".day").eq(0);
    let _openIcon = $(".icon");
    let _linksList = $(".links-wrapper ul li");
    let _backdrop = $(".backdrop");
    let _closeIcon = $(".close-btn");
    let _responsiveLinks = $("#menuNavbar");
    let _navbar = document.getElementsByClassName("responsive-navbar")[0];

    /*var sticky = _navbar.offsetTop;
    $(document).on("scroll", () => {
        if (window.pageYOffset >= sticky) {
            $(_navbar).addClass("sticky");
        } else {
            $(_navbar).removeClass("sticky");
        }
    });*/

    //LINKS UPDATE
    $(_responsiveLinks).children().remove();
    for (let i = 0; i < _linksList.length; i++) {
        let _span = $(_linksList).eq(i).find("span");
        let _new;
        $("<li>", {
            appendTo: _responsiveLinks,
            append: [
                (_new = $("<span>", {
                    text: $(_span).text(),
                    addClass: $(_span).attr("class"),
                    name:$(_span).attr("name")
                }).on("click", () => {
                    $(_responsiveLinks).parent().removeClass("open");
                })),
            ],
        }); //AGGIORNAMENTO DEL MENU' RESPONSIVE
    }
    $(".links li span[name=oggi]").on("click", function () {
        $(_day).find("span").removeClass("day-visible").eq(0).addClass("day-visible")
        setEvents(todayEvents);
    })
    $(".links li span[name=domani]").on("click", function () {
        $(_day).find("span").removeClass("day-visible").eq(1).addClass("day-visible")
        setEvents(tomorrowEvents);
    })

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

    function setEvents(a) {
        if ($(_timeline).html() != "")
            $(".event").animate({ left: "-100%", opacity: 0 }, 400, function () {
                $(_timeline).html("")
                for (let i = 0; i < a.length; i++) {
                    let l = event(a[i]).fadeOut(0);
                    $(_timeline).append(l);
                    $(l).fadeIn(400);
                }
            });
        else
            for (let i = 0; i < a.length; i++) {
                let l = event(a[i]).fadeOut(0);
                $(_timeline).append(l);
                $(l).fadeIn(400);
            }


    }
    function event(data) {
        let ds = new Date(data["orarioStart"]);
        let de = new Date(data["orarioEnd"]);
console.log(courses)
        return $("<div>", {
            addClass: "row event",
            append: [
                $("<div>", {
                    addClass: "col-sm-2 text-center",
                    text: ds.getHours() + ":" + ds.getMinutes() + "-" + de.getHours() + ":" + de.getMinutes(),
                    name: "orario",
                }),
                $("<div>", {
                    addClass: "col-sm-3 text-center",
                    text: courses[data["courseId"]].Insegnante,
                    name: "teacher"
                }),
                $("<div>", {
                    addClass: "col-sm-3 text-center",
                    text: courses[parseInt(data["courseId"])]["nome"],
                    name: "materia"
                }),
                $("<div>", {
                    addClass: "col-sm-3 text-center",
                    text: data["description"],
                    name: "argomento"
                }),
                !data["seen"]?$("<div>",{
                    addClass: "col-sm-1 badge badge-warning text-center",
                    text:"new",
                    name:"visto",
                    css:{
                        fontSize:"3vh",
                        lineHeight: "normal",
                    },
                    click:function(){
                        console.log("update flag")
                        $(this).css({
                            backgroundColor: "#00bdaa",
                            lineHeight: "5vh"
                        }).html("<i class=\"fas fa-check\"></i>");
                    }
                }):"",
            ],
        })
    }

    //  TUTTO DA RIVEDERE POI CON I COOKIES
    let user_ = inviaRichiesta("GET", "http://localhost:3000/USERS?id=0");//MI RICAVO L'UTENTE
    user_.done(function (data) {
        user = data[0];
        $("#user").text(user["nome"]);
        if (user["st"])
            $("span[name=change]").text("courses");
        else
            $("span[name=change]").text("classes");

        //MI RECUPERO LE ISCRIZIONI
        let i_ = inviaRichiesta("GET", "http://localhost:3000/ISCRIZIONI?studId=" + user["id"]);
        i_.done(function (dataI) {
            for (let i = 0; i < dataI.length; i++) {
                //MI RICAVO I CORSI
                let courses_ = inviaRichiesta("GET", "http://localhost:3000/COURSES?id=" + dataI[i]["courseId"]);
                courses_.done(function (dataC) {
                    for (let i = 0; i < dataC.length; i++) {
                        let p={
                            id:dataC[i]["id"],
                            nome:dataC[i]["nome"],
                            insegnante:dataC[i]["creatorId"]
                        }
                        let p_=inviaRichiesta("GET","http://localhost:3000/USERS?id="+p["id"]);
                        p_.done(function(data){
                            p["insegnante"]=data[0]["nome"]+" "+data[0]["cognome"];
                            courses[dataC[i]["id"]]=new Corso(p);
                        })
                        //MI RICAVO GLI EVENTI
                        let events_ = inviaRichiesta("GET", "http://localhost:3000/EVENTS?courseId=" + dataC[i]["id"]);
                        events_.done(function (dataE) {
                            for (let i = 0; i < dataE.length; i++) {
                                let t = new Date().getDate();
                                let te = new Date(dataE[i]["orarioStart"])
                                te = te.getDate();
                                if (te == t) {
                                    todayEvents.push(dataE[i]);
                                    let l = event(dataE[i]).fadeOut(0);
                                    $(_timeline).append(l);
                                    $(l).fadeIn(400);
                                }
                                else if (te == t + 1) {
                                    tomorrowEvents.push(dataE[i]);
                                }
                            }
                        })
                    }
                });
            }
        })
    });
    user_.fail(function () { console.log("errore") })



});