"use strict";

$(document).ready(function () {
    let _timeline = $(".timeline").eq(0)
    let _day = $(".day").eq(0);
    let _coursesWrapper = $(".courses").eq(0);
    let _modalB = $(".backdrop.modal").hide();

    $("html").hide();

    $("#signOut").on("click", function () {
        let signOut_ = inviaRichiesta("POST", "server/logout.php", {});
        signOut_.fail(redirect);
    });

    let userProp_ = inviaRichiesta("POST", "server/getIndexProperties.php", {});
    userProp_.done(function (data) {
        $("#user").text(data["nome"]);
        if (data["st"] != "0")//SONO UNO STUDENTE
            $("<section>", {
                addClass: "add-wrapper col-sm-12 justify-content-center",
                append: [
                    $("<div>", {
                        addClass: "row add",
                        append: [
                            //div iscrizione corso
                            $("<div>", {
                                addClass: "col-sm-5 add-part",
                                css: {
                                    marginBottom: "10%",
                                },
                                append: [
                                    $("<span>", {
                                        addClass: "add-title col-sm-12",
                                        text: "Course",
                                        css: {
                                            height: "7vh",
                                            marginBottom: "5vh"
                                        }
                                    }), $("<br>"),
                                    $("<span>", {
                                        addClass: "col-sm-3",
                                        text: "Code: ",
                                        css: {
                                            height: "fit-content",
                                        }
                                    }),
                                    $("<input>", {
                                        addClass: "col-sm-6",
                                        type: "number",
                                        id: "nNomeCorso",
                                        css: {
                                            marginTop: "0%",
                                            marginBottom: "5%"
                                        },
                                        placeholder: "Course code",
                                    }),
                                    $("<span>", {
                                        addClass: "col-sm-3",
                                    }),
                                    $("<span>", {
                                        addClass: "btn-grad sq col-sm-6",
                                        text: "Add",
                                        css: {
                                            textAlign: "center",
                                            height: "fit-content",
                                        },
                                        click: function () {
                                            $("#nNomeCorso").removeClass("error");
                                            if ($("#nNomeCorso").val() == "") {
                                                $("#nNomeCorso").addClass("error");
                                            }
                                            else {
                                                let addSub_ = inviaRichiesta("POST", "server/subscribeToCourse.php", {
                                                    "id": $("#nNomeCorso").val()
                                                });
                                                $("#nNomeCorso").val("");
                                                addSub_.done(function (data) {
                                                    setCourses();
                                                    $("#addResults").removeClass("fail-alert").addClass("success-alert")
                                                        .text("Perfect! You are now enrolled in the course!").hide().fadeIn(200);
                                                })
                                                addSub_.fail(function (jqXHR, test_status, str_error) {
                                                    redirect(jqXHR, test_status, str_error);
                                                    $("#addResults").removeClass("success-alert").addClass("fail-alert")
                                                        .hide().fadeIn(200);
                                                })
                                            }
                                        }
                                    })
                                ]
                            }),//SX
                            $("<div>", {
                                addClass: "col-sm-6 justify-content-center",
                                append: [
                                    $("<span>", {
                                        addClass: "col-sm-12 sq neutral-alert",
                                        id: "addResults",
                                        text: "Enter the course code to register!"
                                    }),
                                ]
                            }),//DX
                        ]
                    }),

                ],
                appendTo: $(_modalB).find("#modalAdd")
            })//Section per la creazione di corsi e/o eventi
        else {// SONO UN'INSEGNANTE
            $("<section>", {
                addClass: "add-wrapper col-sm-12 justify-content-center",
                append: [
                    $("<div>", {
                        addClass: "row add",
                        append: [
                            //div creazione corso
                            $("<div>", {
                                addClass: "col-sm-6 add-part row",
                                append: [
                                    $("<span>", {
                                        addClass: "add-title col-sm-12",
                                        text: "Course",
                                        css: {
                                            height: "7vh",
                                            marginBottom: "5vh"
                                        }
                                    }), $("<br>"),
                                    $("<span>", {
                                        addClass: "col-sm-3",
                                        text: "Name: ",
                                        css: {
                                            height: "fit-content",
                                        }
                                    }),
                                    $("<input>", {
                                        addClass: "col-sm-6",
                                        type: "text",
                                        id: "txtNomeCorso",
                                        css: {
                                            marginTop: "0%",
                                            marginBottom: "5%"
                                        },
                                        placeholder: "Course name",

                                    }),
                                    $("<span>", {
                                        addClass: "col-sm-12",
                                    }),
                                    $("<span>", {
                                        addClass: "col-sm-4",
                                    }),
                                    $("<span>", {
                                        addClass: "btn-grad sq col-sm-6",
                                        text: "Add",
                                        css: {
                                            textAlign: "center",
                                            height: "fit-content",
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
                                                    $("#cmbCourse").append($("<option>", {
                                                        value: data["data"]["id"],
                                                        text: data["data"]["nome"]
                                                    }))
                                                    $(_coursesWrapper).append(
                                                        $("<div>", {
                                                            appendTo: _coursesWrapper,
                                                            addClass: "sq course",
                                                            append: [
                                                                $("<span>", {
                                                                    addClass: "course-name",
                                                                    text: data["data"]["nome"],
                                                                }),
                                                                $("<span>", {
                                                                    addClass: "course-teacher",
                                                                    text: "Teacher: " + data["teachers"]["cognome"] + " " + data["teachers"]["nome"],
                                                                }),
                                                                $("<span>", {
                                                                    addClass: "course-id",
                                                                    text: "Code: " + data["data"]["id"],
                                                                })
                                                            ]
                                                        })
                                                    )
                                                })
                                                addCourse_.fail(redirect)
                                            }
                                        }
                                    }),
                                    $("<span>", {
                                        addClass: "col-sm-8 sq neutral-alert",
                                        id: "addResults",
                                        text: "Enter the datas to create a new course or a new event!"
                                    }),
                                ]
                            }),
                        ]
                    }),

                ],
                appendTo: $(_modalB).find("#modalAdd")
            })//Section per la creazione di corsi e/o eventi
            let courses_ = inviaRichiesta("POST", "server/getCourses.php");
            courses_.done(function (data) {
                if (data["data"].length > 0) {
                    $(".add").eq(0).append([
                        $("<div>", {
                            addClass: "col-sm-6 add-part row",
                            css: {
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
                                    addClass: "col-sm-4",
                                    text: "Course: ",
                                    css: {
                                        height: "fit-content",
                                    }
                                }),
                                $("<select>", {
                                    addClass: "col-sm-6",
                                    id: "cmbCourse",
                                    placeholder: "Seleziona corso",
                                    css: {
                                        marginTop: "0%",
                                    },
                                    append: function () {
                                        let o = [];
                                        for (let i = 0; i < data["data"].length; i++) {
                                            o.push($("<option>", {
                                                value: data["data"][i]["id"],
                                                text: data["data"][i]["nome"],
                                            }));
                                        }
                                        return o;
                                    }
                                }), $("<br>"),
                                $("<span>", {
                                    addClass: "col-sm-4",
                                    text: "Schedule: ",
                                    css: {
                                        height: "fit-content",
                                    }

                                }),
                                $("<input>", {
                                    addClass: "col-sm-6",
                                    type: "datetime-local",
                                    id: "time",
                                    css: {
                                        marginTop: "0%",
                                    },
                                    min: function () {
                                        var today = new Date();
                                        var dd = today.getDate();
                                        var mm = today.getMonth() + 1; //January is 0!
                                        var yyyy = today.getFullYear();
                                        return yyyy + '-' + pad(mm) + '-' + pad(dd + 1) + "T00:00:00.00";
                                    }
                                }),
                                $("<textarea>", {
                                    addClass: "col-sm-10",
                                    placeholder: "Write the topic of the event",
                                }),
                                $("<span>", {
                                    addClass: "btn-grad sq col-sm-6",
                                    text: "Add",
                                    css: {
                                        textAlign: "center",
                                        marginLeft: "2%",
                                        marginBottom: "5%"
                                    },
                                    click: function () {
                                        $("#cmbCourse").removeClass("error");
                                        $("#time").removeClass("error");
                                        $("textarea").removeClass("error");
                                        if ($("#cmbCourse").val() == "") {
                                            $("#cmbCourse").addClass("error");
                                        }
                                        else if ($("#time").val() == "") {
                                            $("#time").addClass("error");
                                        }
                                        else if ($("textarea").val() == "") {
                                            $("textarea").addClass("error");
                                        }
                                        else {
                                            let addCourse_ = inviaRichiesta("POST", "server/addEvent.php", {
                                                "courseId": $("#cmbCourse").val(),
                                                "do": $("#time").val(),
                                                "argomento": $("textarea").val()
                                            });
                                            $("textarea").val("");
                                            addCourse_.done(function (data) {
                                                if (isToday(data["do"]) || isTomorrow(data["do"])) {
                                                    $(_timeline).append(event(data["data"], data["teachers"]));
                                                }
                                            })
                                            addCourse_.fail(redirect)
                                        }
                                    }
                                }),
                            ]
                        })
                    ])
                }
            });
            courses_.fail(redirect);
        }
    });
    userProp_.fail(redirect);

    setCourses();
    setEvents();

    $("#settings .fail-alert").on("click", function () {
        if (confirm("You are about to delete your profile. Are you sure?")) {
            let delete_ = inviaRichiesta("POST", "server/deleteProfile.php");
            delete_.fail(redirect);
        }
    })

    $("#settings .success-alert").on("click", function () {
        $("#changePwd").removeClass("error");
        $("#changePwdConfirm").removeClass("error");

        if ($("#changePwd").val() == "") {
            $("#changePwd").addClass("error");
        }
        else if ($("#changePwdConfirm").val() == "") {
            $("#changePwdConfirm").addClass("error");
        }
        else if($("#changePwdConfirm").val()!=$("#changePwd").val()){
            $("#changePwd").addClass("error");
            $("#changePwdConfirm").addClass("error");
        }
        else {
            let u_ = inviaRichiesta("POST", "server/updatePassword.php",{"password":$("#changePwd").val()});
            u_.done(function(data){
                alert("Password aggiornata!");
            })
            u_.fail(redirect);
        }
        $("#changePwd").val("")
        $("#changePwdConfirm").val("")
    });

    $(".links li a[name=add]").on("click", function () {
        $(_modalB).children().fadeIn(200)
        $(_modalB).fadeIn(200)
    });

    $(_modalB).find(".close-btn").on("click", modalClose)

    $(".links li a[name=oggi]").on("click", function () {
        setEvents();
        $(_day).find("span").removeClass("day-visible").eq(0).addClass("day-visible")
    })
    $(".links li a[name=domani]").on("click", function () {
        setEvents();
        $(_day).find("span").removeClass("day-visible").eq(1).addClass("day-visible")
    })

    function modalClose() {
        $(_modalB).children().fadeOut(200)
        $(_modalB).fadeOut(200)
    }

    function setCourses() {
        let courses_ = inviaRichiesta("POST", "server/getCourses.php");
        courses_.done(function (data) {
            $(_coursesWrapper).html("");
            if (data["data"].length == 0) {
                $("<span>", {
                    appendTo: _coursesWrapper,
                    text: "You have not yet enrolled in any courses!",
                    addClass: "row justify-content-center",
                    css: {
                        marginTop: "9vh"
                    }
                })
            }
            for (let i = 0; i < data["data"].length; i++) {
                course(data, i).appendTo(_coursesWrapper);
            }
        })
        courses_.fail(redirect)
    }

    function setEvents() {
        let events_ = inviaRichiesta("POST", "server/getEvents.php");
        events_.done(function (data) {
            let ok = true
            $(_timeline).children().slideUp(400).fadeOut(400);
            for (let i = 0; i < data["data"].length; i++) {
                $(_timeline).css({
                    minHeight: "0",
                });
                if (isToday(data["data"][i]["do"]) || isTomorrow(data["data"][i]["do"])) {
                    let l = event(data["data"][i], data["teachers"][i]).hide();
                    $(_timeline).append(l);
                    $(l).fadeIn(200);
                    ok = false;
                }
            }
            if (ok) {
                $(_timeline).css({
                    minHeight: "20vh",
                });
                $("<span>", {
                    appendTo: _timeline,
                    text: "You don't have any events " + $(".day-visible").text() + "!",
                    addClass: "row justify-content-center",
                    css: {
                        marginTop: "9vh"
                    },
                    id: "noEvents"
                }).hide().fadeIn(200);
            }
        })
        events_.fail(redirect)
    }

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

    function course(data, i) {
        return $("<div>", {
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
                    addClass: "course-id",
                    text: "Code: " + data["data"][i]["id"],
                })
            ]
        });
    }

    function event(data, teacher) {
        let d = new Date(data["do"]);
        return $("<div>", {
            addClass: "row event",
            append: [
                $("<div>", {
                    addClass: "col-sm-2 text-center",
                    text: d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " - " + d.getHours() + ":" + pad(d.getMinutes()),
                    name: "orario",
                }),
                $("<div>", {
                    addClass: "col-sm-3 text-center",
                    text: teacher["cognome"] + " " + teacher["nome"],
                    name: "teacher"
                }),
                $("<div>", {
                    addClass: "col-sm-3 text-center",
                    text: data["courseId"],
                    name: "materia"
                }),
                $("<div>", {
                    addClass: "col-sm-3 text-center",
                    text: data["argomento"],
                    name: "argomento"
                }),
            ],
        })
    }

    setTimeout(function () { $("html").fadeIn(500) }, 1000);
});