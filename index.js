"use strict";

$(document).ready(function () {
	let _password = $("#password")
	let _email = $("#email")
	let _lblError=$(".alert-danger").hide()
	let _login=$(".login-login").eq(0);

	$(".eye").on("click", function () {
		document.querySelector('.eye').classList.toggle('slash');
		var password = document.querySelector('[name=password]');
		if (password.getAttribute('type') === 'password') {
			password.setAttribute('type', 'text');
		} else {
			password.setAttribute('type', 'password');
		}
	});

	let _btnLogin = $(".btn-grad").eq(0).on("click", function () {
		checkLogin();
	});

	$(document).on('keydown', function (e) {
		if (e.keyCode == 13)
			checkLogin();
	});

	let _a=$("a#sign").on("click",function(){
		$(_login).children().fadeOut(200,function(){
			$(_login).html("");
			$(_a).html("").addClass("col-sm-1 btn-grad sq text-center").text("Sign Up!").css({
				color:"#fff"
			})
			$(_login).append([
				$("<p>",{
					addClass:"main-icon col-sm-12"
				}),
				$("<p>",{
					text:"Sign Up!",
					css:{
						marginBottom: "2vh"
					}
				}),
				$("<input>",{
					name:"Email",
					id:"Email",
					placeholder:"Email",
					type:"text",
					addClass:"col-sm-8"
				}),
				$("<input>",{
					name:"Cognome",
					id:"Cognome",
					placeholder:"Cognome",
					type:"text",
					addClass:"col-sm-8"
				}),
				$("<input>",{
					name:"Nome",
					id:"Nome",
					placeholder:"Nome",
					type:"text",
					addClass:"col-sm-8"
				}),
				$("<input>",{
					name:"Password",
					id:"pwd",
					placeholder:"Password",
					type:"password",
					addClass:"col-sm-8"
				}),
				$("<input>",{
					name:"Conferma password",
					id:"ConfermaPassword",
					placeholder:"Conferma password",
					type:"password",
					addClass:"col-sm-8"
				}),$("<br>"),
				$("<input>",{
					type:"checkbox",
					id:"chkST",
					css:{
						marginRight: ".5vw"
					}
				}),
				$("<label>",{
					for:"chkST",
					text:"Student"
				})
			]);
			$(_btnLogin).eq(0).on("click", function () {
				checkSignUp();
			});
		
			$(document).on('keydown', function (e) {
				if (e.keyCode == 13)
					checkcheckSignUpLogin();
			});
		})
	})

	function checkSignUp(){

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

			let richiestaLogin_ = inviaRichiesta("POST", "server/login.php", { "username": em, "password": pass });
			richiestaLogin_.done(function (data) {
				if (data.ris == "ok") // test inutile
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
});