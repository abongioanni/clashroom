"use strict";

$(document).ready(function () {
	let _password = $("#password")
	let _email = $("#email")
	let _lblError = $(".fail-alert").hide().css({ color: "#fff" })
	let _login = $(".login-login").eq(0);
	let _btnLogin = $(".btn-grad").eq(0);

	$("html").hide();

	let auth2;
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
				var profile = googleUser.getBasicProfile();
				$("#signEmail").val(profile.getEmail());
				$("#signCognome").val(profile.getFamilyName());
				$("#signNome").val(profile.getGivenName());
			}, function (error) {
			});
	}

	$(_btnLogin).on("click", function () {
		checkLogin();
	});

	$(document).on('keydown', function (e) {
		if (e.keyCode == 13)
			checkLogin();
	});

	$("#forgot").on("click", resetPassword);

	let _a = $("a#sign").on("click", function () {
		$(_login).children().fadeOut(200, changeInterface);
	})

	function resetPassword() {
		_email.removeClass("error");
		if (_email.val() == "") {
			_email.addClass("error")
		}
		else{
			$("#forgot").off();
			let em = $(_email).val();
			let up_ = inviaRichiesta("POST", "server/sendMailToResetPassword.php", { "email": em });
			up_.done(function (data) {
				$("#forgot").on("click", resetPassword);
				$(_lblError).slideDown(200).removeClass("fail-alert").addClass("success-alert").html("Bene!, hai ricevuto una mail con la password!")
			});
			up_.fail(function (jqXHR, test_status, str_error) {
				$("#forgot").on("click", resetPassword);
				if (jqXHR.status == 200)
					$(_lblError).slideDown(200).removeClass("fail-alert").addClass("success-alert").html("Well!, you have received an email with the password!")
				else
					$(_lblError).removeClass("success-alert").addClass("fail-alert").slideDown(200).html("<b>Login failed:</b> Try again to enter your credentials or if you are not yet registered press the link below!")
			})
		}
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
					$(_lblError).removeClass("success-alert").addClass("fail-alert").slideDown(200).html("This email already has a registered account!")
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
					$(_lblError).removeClass("success-alert").addClass("fail-alert").slideDown(200).html("<b>Login failed:</b!> Try again to enter your credentials or if you are not yet registered press the link below!")
				} else {
					$(_lblError).removeClass("success-alert").addClass("fail-alert").slideDown(200).html("<b>Login failed:</b> Try again to enter your credentials or if you are not yet registered press the link below!")
				}
			});
		}
	}

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





	startApp();
	$("html").fadeIn(500);

	
});