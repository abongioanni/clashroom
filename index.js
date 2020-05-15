"use strict";

$(document).ready(function () {
    let courses = {};
    let todayEvents = [];
    let tomorrowEvents = [];

    let _new;
    let _timeline = $(".timeline").eq(0)
    let _day = $(".day").eq(0);
    let _openIcon = $(".icon");
    let _linksList = $(".links-wrapper ul li");
    let _backdrop = $(".backdrop");
    let _closeIcon = $(".close-btn");
    let _responsiveLinks = $("#menuNavbar");
    let _coursesWrapper = $(".courses").eq(0);
    let userProp_ = inviaRichiesta("POST", "server/getIndexProperties.php", {});
    userProp_.done(function (data) {
        $("#user").text(data["nome"]);
        if (data["st"] != "0")
            $("span[name=change]").text("courses");
        else {
            $("<section>", {
                addClass: "add-wrapper row justify-content-center",
                append: [
                    $("<span>", {
                        addClass: "add-title",
                        text: "Add"
                    }),
                    $("<div>", {
                        addClass: "row add sq",
                        append: [
                            //div creazione corso
                            $("<div>", {
                                addClass: "col-sm-6 add-part justify-content-center",
                                css: {
                                    marginBottom: "10%",
                                },
                                append: [
                                    $("<span>", {
                                        addClass: "add-title col-sm-12",
                                        text: "Course",
                                        css: {
                                            height: "7vh",
                                        }
                                    }), $("<br>"),
                                    $("<input>", {
                                        type: "text",
                                        id: "txtNomeCorso",
                                        css: {
                                            marginLeft: "7%"
                                        },
                                        placeholder: "Inserisci nome corso",

                                    }),
                                    $("<span>", {
                                        addClass: "spa",
                                        css: {
                                            display: "inline-block",
                                            width: "30%"
                                        }
                                    }),
                                    $("<span>", {
                                        addClass: "btn-grad sq",
                                        text: "Add",
                                        css: {
                                            textAlign: "center",
                                            width: "25%"
                                        },
                                        click: function () {
                                            $("#txtNomeCorso").removeClass("error");
                                            if ($("#txtNomeCorso").val() == "") {
                                                $("#txtNomeCorso").addClass("error");
                                            }
                                            else {
                                                let addCourse_ = inviaRichiesta("POST", "server/addCourse.php", {
                                                    "nome": $("#txtNomeCorso").val()
                                                });
                                                $("#txtNomeCorso").val("");
                                                addCourse_.done(function (data) {
                                                    $(_coursesWrapper).append(
                                                        $("<div>", {
                                                            appendTo: _coursesWrapper,
                                                            addClass: "sq course",
                                                            append: [
                                                                $("<span>", {
                                                                    addClass: "course-name",
                                                                    text: data["data"][i]["nome"],
                                                                }),
                                                                $("<span>", {
                                                                    addClass: "course-teacher",
                                                                    text: "Teacher: " + data["teachers"][i]["cognome"] + " " + data["teachers"][i]["nome"],
                                                                }),
                                                                $("<span>", {
                                                                    addClass: "course-n",
                                                                    text: "Code: " + data["data"][i]["id"],
                                                                })
                                                            ]
                                                        })
                                                    )
                                                })
                                                addCourse_.fail(function (jqXHR, test_status, str_error) {
                                                    if (jqXHR.status == 403) {
                                                        window.location.href = "login.html";
                                                    }
                                                })
                                            }
                                        }
                                    })
                                ]
                            }),
                        ]
                    }),

                ],
                appendTo: ".main"
            })
        }
    });
    userProp_.fail(function (jqXHR, test_status, str_error) {
        if (jqXHR.status == 403) {
            window.location.href = "login.html";
        }
    });

    let courses_ = inviaRichiesta("POST", "server/getCourses.php");
    courses_.done(function (data) {
        if (data["data"].length > 0) {
            $(".add").eq(0).append([
                $("<div>", {
                    addClass: "col-sm-6 add-part",
                    css:{
                        paddingLeft: "2%",
                        borderLeft: "2px solid #5000ce",
                    },
                    append: [
                        $("<span>", {
                            addClass: "add-title col-sm-12",
                            text: "Event",
                            css: {
                                height: "7vh",
                            }
                        }), $("<br>"),
                        $("<span>", {
                            text: "Course: ",
                            css: {
                                marginLeft: "4%",
                                width: "100px",
                                display: "inline-block"
                            }
                        }),
                        $("<select>", {
                            id: "cmbCourse",
                            css: {
                                width: "195px",
                            },
                            placeholder: "Seleziona corso",
                            append: function () {
                                let o = [];
                                for (let i = 0; i < data["data"].length; i++) {
                                    $("<div>", {
                                        appendTo: _coursesWrapper,
                                        addClass: "sq course",
                                        append: [
                                            $("<span>", {
                                                addClass: "course-name",
                                                text: data["data"][i]["nome"],
                                            }),
                                            $("<span>", {
                                                addClass: "course-teacher",
                                                text: "Teacher: " + data["teachers"][i]["cognome"] + " " + data["teachers"][i]["nome"],
                                            }),
                                            $("<span>", {
                                                addClass: "course-n",
                                                text: "Code: " + data["data"][i]["id"],
                                            })
                                        ]
                                    })
                                    o.push($("<option>", {
                                        value: data["data"][i]["id"],
                                        text: data["data"][i]["nome"]
                                    }));
                                }
                                return o;
                            }
                        }), $("<br>"),
                        $("<span>", {
                            text: "Schedule: ",
                            css: {
                                marginLeft: "4%",
                                width: "100px",
                                display: "inline-block"
                            }
                        }),
                        $("<input>", {
                            type: "datetime-local",
                            id:"time"
                        }),
                        $("<span>", {
                            addClass: "btn-grad sq",
                            text: "Add",
                            css: {
                                textAlign: "center",
                                width: "25%",
                                marginLeft:"13%"
                            },
                            click: function () {
                                $("#cmbCourse").removeClass("error");
                                $("#time").removeClass("error");
                                $("textarea").removeClass("error");
                                if ($("#cmbCourse").val() == "") {
                                    $("#cmbCourse").addClass("error");
                                }
                                else if($("#time").val()==""){
                                    $("#time").addClass("error");
                                }
                                else if($("textarea").val()==""){
                                    $("textarea").addClass("error");
                                }
                                else {
                                    let addCourse_ = inviaRichiesta("POST", "server/addEvent.php", {
                                        "courseId": $("#cmbCourse").val(),
                                        "do":$("#time").val(),
                                        "argomento":$("textarea").val()
                                    });
                                    $("textarea").val("");
                                    addCourse_.done(function (data) {
                                        alert("si")
                                        //CREA EVENTO IN TIMELINE
                                    })
                                    addCourse_.fail(function (jqXHR, test_status, str_error) {
                                        if (jqXHR.status == 403) {
                                            window.location.href = "login.html";
                                        }
                                    })
                                }
                            }
                        }),
                        $("<textarea>", {
                            placeholder: "Write the topic of the event"
                        })
                    ]
                })
            ])
        }
    })
    courses_.fail(function (jqXHR, test_status, str_error) {
        if (jqXHR.status == 403) {
            window.location.href = "login.html";
        }
    })

    //LINKS UPDATE
    $(_responsiveLinks).children().remove();
    for (let i = 0; i < _linksList.length; i++) {
        let _span = $(_linksList).eq(i).find("span");
        $("<li>", {
            appendTo: _responsiveLinks,
            append: [
                (_new = $("<span>", {
                    text: $(_span).text(),
                    addClass: $(_span).attr("class"),
                    name: $(_span).attr("name")
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
            ],
        })
    }

    /*let i_ = inviaRichiesta("POST", "server/getSubs.php");
    i_.done(function (dataI) {
        for (let i = 0; i < dataI.length; i++) {
            //MI RICAVO I CORSI
            let courses_ = inviaRichiesta("POST", "http://localhost:3000/COURSES",{"id":dataI[i]["courseId"]});
            courses_.done(function (dataC) {
                for (let i = 0; i < dataC.length; i++) {
                    let p = {
                        id: dataC[i]["id"],
                        nome: dataC[i]["nome"],
                        insegnante: dataC[i]["creatorId"]
                    }
                    /*let p_ = inviaRichiesta("POST", "http://localhost:3000/USERS?id=" + p["id"]);
                    p_.done(function (data) {
                        p["insegnante"] = data[0]["nome"] + " " + data[0]["cognome"];
                        courses[dataC[i]["id"]] = new Corso(p);
                    })*/
    //MI RICAVO GLI EVENTI
    /*let events_ = inviaRichiesta("GET", "http://localhost:3000/EVENTS?courseId=" + dataC[i]["id"]);
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
})*/

});