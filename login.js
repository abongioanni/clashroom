"use strict";

$(document).ready(function () {
	let _password = $("#password")
	let _email = $("#email")
	let _lblError = $(".alert-danger").hide()
	let _login = $(".login-login").eq(0);
	let _btnLogin = $(".btn-grad").eq(0);

	$("html").hide();

	let auth2;
	var googleUser = {};
	var startApp = function () {
		gapi.load('auth2', function () {
			auth2 = gapi.auth2.init({
				client_id: "25386899513-dhlh8mnb9fkcoles551b77e4v5t1768h.apps.googleusercontent.com",
				cookiepolicy: 'single_host_origin',
			});
			attachSignin(document.getElementById('googleSignIn'));
		});
	};

	function attachSignin(element) {
		auth2.attachClickHandler(element, {},
			function (googleUser) {
				changeInterface();
				console.log(googleUser)
				$("#signEmail").val(googleUser["Pt"]["yu"]);
				$("#signCognome").val(googleUser["Pt"]["BW"]);
				$("#signNome").val(googleUser["Pt"]["CU"]);
			}, function (error) {
			});
	}

	$(".eye").on("click", function () {
		document.querySelector('.eye').classList.toggle('slash');
		var password = document.querySelector('[name=password]');
		if (password.getAttribute('type') === 'password') {
			password.setAttribute('type', 'text');
		} else {
			password.setAttribute('type', 'password');
		}
	});

	$(_btnLogin).on("click", function () {
		checkLogin();
	});

	$(document).on('keydown', function (e) {
		if (e.keyCode == 13)
			checkLogin();
	});

	let _a = $("a#sign").on("click", function () {
		$(_login).children().fadeOut(200, changeInterface);
	})

	function changeInterface() {
		$(_login).html("").css({
			paddingTop: "2vh"
		});
		$(_a).html("").addClass("col-sm-1 btn-grad sq text-center").text("Sign Up!").css({
			color: "#fff"
		})
		$(_login).append([
			$("<p>", {
				addClass: "main-icon col-sm-12"
			}),
			$("<p>", {
				text: "Sign Up!",
				css: {
					marginBottom: "0"
				}
			}),
			$("<input>", {
				name: "Email",
				id: "signEmail",
				placeholder: "Email",
				type: "text",
				addClass: "col-sm-8"
			}),
			$("<input>", {
				name: "Cognome",
				id: "signCognome",
				placeholder: "Cognome",
				type: "text",
				addClass: "col-sm-8"
			}),
			$("<input>", {
				name: "Nome",
				id: "signNome",
				placeholder: "Nome",
				type: "text",
				addClass: "col-sm-8"
			}),
			$("<input>", {
				name: "Password",
				id: "signPassword",
				placeholder: "Password",
				type: "password",
				addClass: "col-sm-8"
			}),
			$("<input>", {
				name: "Conferma password",
				id: "signConfermaPassword",
				placeholder: "Conferma password",
				type: "password",
				addClass: "col-sm-8"
			}), $("<br>"),
			$("<select>", {
				id: "signCmbSt",
				addClass: "col-sm-8",
				append: [
					$("<option>", {
						text: "Student",
						value: "1"
					}),
					$("<option>", {
						text: "Teacher",
						value: "0"
					})
				]
			}),
			_lblError = $("<div>", {
				addClass: "alert col-sm-8 alert-danger",
				css: {
					margin: "0 auto",
					padding: ".25 .5 !important"
				},
				text: ""
			}).hide()
		]);
		$(_a).off().on("click", function () {
			checkSignUp();
		});

		$(document).off().on('keydown', function (e) {
			if (e.keyCode == 13) {
				checkSignUp();
			}
		});
	}

	function checkSignUp() {
		let pass = true;
		$(_login).find("input").removeClass("error");
		for (let i = 0; i < $(_login).find("input").length; i++) {
			if ($(_login).find("input").eq(i).val() == "") {
				$(_login).find("input").eq(i).addClass("error");
				pass = false;
			}
		}
		if (pass && $("#signPassword").val() != $("#signConfermaPassword").val()) {
			pass = false;
		}
		else if (pass) {
			pass = false;
			let richiestaLogin_ = inviaRichiesta("POST", "server/signUp.php", {
				"email": $("#signEmail").val(),
				"password": CryptoJS.MD5($("#signPassword").val()).toString(),
				"cognome": $("#signCognome").val(),
				"nome": $("#signNome").val(),
				"st": $("#signCmbSt").val(),
			});

			richiestaLogin_.done(function (data) {
				if (data["ris"] == "ok") // test inutile
					window.location.href = "home.html"
			});

			richiestaLogin_.fail(function (jqXHR, test_status, str_error) {
				if (jqXHR.status == 401) {
					$(_lblError).slideDown(200).text(jqXHR.responseText)
				} else {
					//$(_lblError).slideDown()
					//throw jqXHR.responseText;
				}
			});
		}
	}

	function checkLogin() {
		_email.removeClass("error");
		_password.removeClass("error");
		if (_email.val() == "") {
			_email.addClass("error")
		}
		else if (_password.val() == "") {
			_password.addClass("error")
		}
		else {
			let em = _email.val();
			let pass = CryptoJS.MD5(_password.val()).toString();

			let richiestaLogin_ = inviaRichiesta("POST", "server/login.php", { "email": em, "password": pass });
			richiestaLogin_.done(function (data) {
				if (data["ris"] == "ok") // test inutile
					window.location.href = "home.html"
			});
			richiestaLogin_.fail(function (jqXHR, test_status, str_error) {
				$(_password).val("");
				if (jqXHR.status == 401) {
					$(_lblError).slideDown()
				} else {
					$(_lblError).slideDown()
					//throw jqXHR.responseText;
				}
			});
		}
	}
	startApp();
	$("html").fadeIn(500);
});