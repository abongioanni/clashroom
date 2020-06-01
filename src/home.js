"use strict";

$(document).ready(function () {
    let _timeline = $(".timeline").eq(0);
    let _day = $(".day").eq(0);
    let _coursesWrapper = $(".courses").eq(0);
    let _modalB = $(".backdrop.modal").hide();
    let _openIcon = $(".icon");
    let _linksList = $(".links-wrapper ul");
    let _closeIcon = $(".close-btn");
    let _responsiveLinks = $("#menuNavbar");
    let _selectedDay = $("#selectedDay");

    $("html").hide();

    //LINKS UPDATE
    $(_responsiveLinks).children().remove();
    $(_linksList).find("li a").each(function () {
        $("<li>", {
            appendTo: _responsiveLinks,
            append: $(this).clone().on("click", () => {
                $(_responsiveLinks).parent().removeClass("open");
            })
        }); //AGGIORNAMENTO DEL MENU' RESPONSIVE
    });

    //EVENT PER LO SCROLL DELLA PAGINA SUGLI ANCHOR
    $(_responsiveLinks).append("<li style='height:10vh;'><a class='fas fa-sign-out-alt'></a></li>");
    document.querySelectorAll('a[href^="#"]').forEach(_anchor => {
        $(_anchor).on('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

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

    //LINK EVENTS
    $(".links li a[name=add]").on("click", function () {
        $(_modalB).children().fadeIn(200)
        $(_modalB).fadeIn(200)
    });
    $(".links li a[name=oggi]").on("click", function () {
        let today = getToday();
        $(_selectedDay).val(today.year + "-" + pad(today.month) + "-" + pad(today.day));
        setEvents($(_selectedDay).val());
        $(_day).find("span").removeClass("day-visible")
        $(_day).find("span").eq(0).addClass("day-visible")
    })
    $(".links li a[name=domani]").on("click", function () {
        let today = getToday();
        $(_selectedDay).val(today.year + "-" + pad(today.month) + "-" + pad(parseInt(today.day) + 1));
        setEvents($(_selectedDay).val());
        $(_day).find("span").removeClass("day-visible")
        $(_day).find("span").eq(1).addClass("day-visible")
    })
    $("#calendar")/*.prop("min",function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        return yyyy + '-' + pad(mm) + '-' + pad(dd);
    })*/.on("change", function () {
        setEvents($(this).val());
        $(_selectedDay).val($(this).val());
        $(_day).find("span").removeClass("day-visible")
        $(_day).find(".custom-day").addClass("day-visible").text($(this).val())
    })

    //BOTTONI DI LOGOUT
    $(".fa-sign-out-alt").on("click", function () {
        let signOut_ = inviaRichiesta("POST", "server/logout.php", {});
        signOut_.fail(redirect);
    });

    //SUB ADD
    $("#btnAddCourseStud").on("click", function () {
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
    });

    //COURSE ADD
    $("#btnAddCourse").on("click", function () {
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
                }));
                setCourses();
                if ($(".add").find(".add-part").length == 1) {
                    setTeacherInterface();
                }
                modalClose();
            })
            addCourse_.fail(redirect);
        }
    });

    //CONTROLLO SE L'INSEGNANTE HA GIA' CREATO ALMENO UN'EVENTO
    if (!isStudent) setTeacherInterface();

    //IMPOSTO CORSI ED EVENTI
    setCourses();
    let today = getToday();
    $(_selectedDay).val(today.year + "-" + pad(today.month) + "-" + pad(today.day));
    $(_selectedDay).val()
    setEvents($(_selectedDay).val());

    //EVENTO ELIMINAZIONE ACCOUNT
    $("#settings .fail-alert").on("click", function () {
        if (confirm("You are about to delete your profile. Are you sure?")) {
            let delete_ = inviaRichiesta("POST", "server/deleteProfile.php");
            delete_.fail(redirect);
        }
    });

    //GESTIONE MODALE
    $(_modalB).find(".close-btn").on("click", modalClose)

    function modalClose() {
        $(_modalB).children().fadeOut(200)
        $(_modalB).fadeOut(200)
    }

    //SE E' GIA' STATO CREATO ALMENO UN CORSO AGGIUNGO LA PARTE PER LA CREAZIONE DEGLI EVENTI
    function setTeacherInterface() {
        let courses_ = inviaRichiesta("POST", "server/getCourses.php");
        courses_.done(function (data) {
            if (data["data"].length > 0) {
                $(".add").find(".add-part").eq(1).remove()
                $(".add").eq(0).append([
                    $("<div>", {
                        addClass: "col-sm-6 add-part row",
                        css: {
                            paddingLeft: "2%",
                            borderLeft: "2px solid #652d92",
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
                                    var t = getTomorrow();
                                    return t.year + "-" + t.month + "-" + t.day + "T00:00:00.00";
                                }
                            }),
                            $("<textarea>", {
                                addClass: "col-sm-10",
                                placeholder: "Write the topic of the event",
                            }),
                            $("<input>", {
                                type: "file",
                                id: "files",
                                css: {
                                    display: "none"
                                }
                            }),
                            $("<label>", {
                                addClass: "btn-grad sq col-sm-4",
                                html: "<i class='fas fa-upload'></i> Upload",
                                css: {
                                    height: "fit-content"
                                },
                                for: "files"
                            }),
                            $("<span>", {
                                addClass: "btn-grad sq col-sm-6",
                                text: "Add",
                                css: {
                                    verticalAlign: "middle",
                                    textAlign: "center",
                                    marginLeft: "2%",
                                    marginBottom: "5%",
                                    height: "fit-content"
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
                                        let addEvent_;
                                        var files = $('#files').prop('files');
                                        if (files.length > 0) {
                                            var formData = new FormData();
                                            formData.append("courseId", $("#cmbCourse").val())
                                            formData.append("do", $("#time").val())
                                            formData.append("argomento", $("textarea").val())
                                            for (let file of files)
                                                formData.append('files[]', file);
                                            addEvent_ = inviaRichiestaMultipart("POST", "server/addEvent.php", formData);
                                        }
                                        else {
                                            addEvent_ = inviaRichiesta("GET", "server/addEvent.php", {
                                                "argomento":$("textarea").val(),
                                                "do":$("#time").val(),
                                                "courseId":$("#cmbCourse").val()
                                            });
                                        }
                                        $("textarea").val("");
                                        addEvent_.done(function (data) {
                                            modalClose();
                                            setEvents($(_selectedDay).val());
                                        })
                                        addEvent_.fail(redirect)
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
                course(data["data"][i], data["teachers"][i]).appendTo(_coursesWrapper);
            }
        })
        courses_.fail(redirect)
    }

    function setEvents(date) {
        let events_ = inviaRichiesta("POST", "server/getEventsByDate.php", { "date": date });
        events_.done(function (data) {
            $(_timeline).children().slideUp(400).fadeOut(400);
            if (data["data"].length > 0)
                for (let i = 0; i < data["data"].length; i++) {
                    $(_timeline).css({
                        minHeight: "0",
                    });
                    let l = event(data["data"][i], data["teachers"][i]).hide();
                    $(_timeline).append(l);
                    $(l).fadeIn(200);
                }
            else {
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

    function deleteCourse(_course) {
        let courseId = $(_course).find(".course-id").eq(0).text().split(": ")[1];
        let deleteSub_ = inviaRichiesta('POST', 'server/deleteSubCourse.php', { "courseId": courseId });
        deleteSub_.done(function (data) {
            $(_course).fadeOut(400, function () {
                $(_course).remove()
                for (let i = 0; i < data.length; i++) {
                    $(".event input[value=" + data[i]["id"] + "]").remove();
                }
                $("#cmbCourse").find("option[value=" + courseId + "]").remove();
                if ($(_coursesWrapper).find(".course").length == 0) {
                    $(".add").find(".add-part").eq(1).remove();
                }
                setCourses();
            });
        })
    }

    function deleteEvent(_event) {
        let eventId = $(_event).find("input[type=hidden]").eq(0).val();
        let deleteEvent_ = inviaRichiesta('POST', 'server/deleteEvent.php', { "eventId": eventId });
        deleteEvent_.done(function (data) {
            setEvents($(_selectedDay).val());
        });
    }

    $("i[name=deleteFile]").on("click",function(){
        let sender=$(this).parent().parent();
        let file=$(this).find("input[type=hidden]").val()
        if (confirm("You are deleting "+getFileName(file)+". Are you sure?")) {
            let deleteFile_=inviaRichiesta("POST","server/deleteFile.php",{
                "file":file
            })
            deleteFile_.done(function(data){
                $(sender).remove();
            });
            deleteFile_.fail(redirect);
        }
    })

    function course(data, t) {
        let _course = $("<div>", {
            addClass: "sq course",
            append: [
                $("<span>", {
                    addClass: "course-name",
                    text: data["nome"],
                }),
                $("<span>", {
                    addClass: "course-teacher",
                    text: "Teacher: " + t["cognome"] + " " + t["nome"],
                }),
                !isStudent ? $("<span>", {
                    addClass: "course-id",
                    text: "Code: " + data["id"],
                }) : "",
                $("<span>", {
                    addClass: "close-btn",
                    css: {
                        position: "absolute",
                        top: "10%",
                        right: "2%",
                        fontSize: "2vh"
                    },
                    html: "<i class='fas fa-times'></i>",
                    click: function () {
                        if (confirm(!isStudent ? "Do you want to delete this element?" : "Do you want to unsubscribe to this course?")) {
                            deleteCourse(_course);
                        }
                    }
                }),
                !isStudent ? $("<a>", {
                    addClass: "share-btn",
                    href: "mailto:?subject=Invito%20a%20partecipare%20al%20corso&body=Ecco%20il%20codice%20del%20corso:%20" + data["id"],
                    css: {
                        position: "absolute",
                        bottom: "10%",
                        right: "2%",
                        fontSize: "2vh"
                    },
                    html: '<i class="fas fa-share-alt"></i>',
                }) : ""
            ],
        });
        return _course;
    }

    function event(data, teacher) {
        let d = new Date(data["do"]);
        let _event = $("<div>", {
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
                $("<input>", {
                    type: "hidden",
                    value: data["id"]
                }),
                (!isStudent ? $("<span>", {
                    addClass: "close-btn",
                    css: {
                        position: "absolute",
                        top: "15%",
                        right: "2%",
                        fontSize: "2vh"
                    },
                    html: "<i class='fas fa-times'></i>",
                    click: function () {
                        if (confirm("Do you want to delete this element?")) {
                            deleteEvent(_event);
                        }
                    }
                }) : ""),
                data["download"]!=""?$("<a>", {
                    addClass: "share-btn",
                    download: getFileName(data["download"]),
                    href: data["download"],
                    css: {
                        position: "absolute",
                        bottom: "15%",
                        right: "2%",
                        fontSize: "2vh"
                    },
                    html: '<i class="fas fa-download"></i>',
                }):""
            ],
        })
        return _event;
    }

    setTimeout(function () { $("html").fadeIn(500) }, 1000);
});