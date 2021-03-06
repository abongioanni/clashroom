<html lang="it">

<?php
    require "server/_libreria.php";
    _checkSession("user");
    $user = $_SESSION["user"];
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Clashroom | Reset password</title>

    <link rel="stylesheet" type="text/css"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/fontawesome.min.js"></script>

    <link rel="icon" href="icon.png" type="image/png">
    <link rel="stylesheet" type="text/css" href="main.css" />
    <script type="application/javascript" src="common.js"></script>
</head>

<body style="min-height: 1700px;">
    <div class="container-fluid">
        <header>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#652d92" fill-opacity="1"
                    d="M0,160L40,181.3C80,203,160,245,240,224C320,203,400,117,480,85.3C560,53,640,75,720,117.3C800,160,880,224,960,250.7C1040,277,1120,267,1200,250.7C1280,235,1360,213,1400,202.7L1440,192L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z">
                </path>
            </svg>
        </header>
        <div class="main" style="margin-top:5vh;">
            <section id="settings" class="course-wrapper justify-content-center container-fluid">
                <span class="courses-title"><?php echo "Welcome ".$user["nome"]?></span>
                <div class="courses row sq" style="display: flex;align-items:center">
                    <span class="col-sm-12" style="font-size:4vh;text-align:left">Change password - <?php echo $user["email"]?></span>
                    <div class="row col-sm-5">
                        <input class="col-sm-10" type="password" name="password" id="changePwd" placeholder="Password"><br>
                        <input class="col-sm-10" type="password" name="password" id="changePwdConfirm" placeholder="Confirm password"><br>
                    </div>
                    <span class="col-sm-2 text-center sq success-alert">Change password</span>
                </div>

            </section>
        </div>
    </div>
    <script>
        setPasswords();
    </script>
</body>

</html>