<html lang="it">
<?php
require "server/_libreria.php";
_checkSession("user");
$user = $_SESSION["user"];
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Clashroom | Home</title>

    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/fontawesome.min.js"></script>

    <link rel="icon" href="img/icon.png" type="image/png">
    <link rel="stylesheet" type="text/css" href="main.css" />
    <script type="application/javascript" src="common.js"></script>
    <script type="application/javascript" src="home.js"></script>
    <script>
        let isStudent = <?php echo ($user['st'] != '0' ? "true" : "false"); ?>;
    </script>
</head>

<body class="container-fluid">
    <div class="fas fa-sign-out-alt"></div>
    <div id="h">
        <div class="col-sm-12 justify-content-center">
            <h3 class="logo">Hi, <?php echo $user["nome"]; ?></h3>
            <span class="icon"><i class="fas fa-bars"></i></span>
        </div>
        <nav class="col-sm-12 responsive-navbar justify-content-center">
            <div class="links-wrapper active">
                <ul class="links">
                    <li><a name="oggi">Today</a></li>
                    <li><a name="domani">tomorrow</a></li>
                    <li><a name="change" href="#coursesW">courses</a></li>
                    <li><a name="add">add</a></li>
                    <li><a name="settings" href="#settings">Settings</a></li>
                </ul>
            </div>
        </nav>
        <div class="responsive-menu">
            <div class="close-btn"><i class="fas fa-times"></i></div>
            <ul id="menuNavbar" class="links justify-content-center">

            </ul>
        </div>
    </div>
    <header>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#652d92" fill-opacity="1" d="M0,160L40,181.3C80,203,160,245,240,224C320,203,400,117,480,85.3C560,53,640,75,720,117.3C800,160,880,224,960,250.7C1040,277,1120,267,1200,250.7C1280,235,1360,213,1400,202.7L1440,192L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z">
            </path>
        </svg>
    </header>
    <!--modal add-->
    <div class="backdrop modal container-fluid justify-content-center">
        <div id="modalAdd" class="sq row">
            <div class="close-btn"><i class="fas fa-times"></i></div>
            <?php
            if ($user["st"] != "0") { //MODIFICO L'INTERFACCIA IN BASE AL TIPO DI UTENZA
                echo "<section class='add-wrapper col-sm-12 justify-content-center'>
                        <div class='row add'>
                            <div class='col-sm-6 row'>
                                <span class='add-title col-sm-12' style='height:7vh;margin-bottom:5vh;'>Course</span>
                                <span class='col-sm-2' style='height:fit-content;'>Code: </span>
                                <input class='col-sm-5' type='number' id='nNomeCorso' style='margin-top:0%;margin-bottom:5%;' placeholder='Course code'>
                                <span class='btn-grad sq col-sm-3' id='btnAddCourseStud' style='text-align:center;height:fit-content;'>Add</span>
                                <span class='col-sm-12 sq neutral-alert' id='addResults'>Enter the course code to register!</span>
                            </div>
                        </div>
                    </section>";
            } else {
                echo "<section class='add-wrapper col-sm-12 justify-content-center'>
                        <div class='row add'>
                            <div class='col-sm-6 add-part row' style='padding-right:2%'>
                                <span class='add-title col-sm-12' style='height:7vh;margin-bottom:5vh;'>Course</span>
                                <span class='col-sm-2' style='height:fit-content;'>Name: </span>
                                <input class='col-sm-5' type='text' id='txtNomeCorso' style='margin-top:0%;margin-bottom:5%;' placeholder='Course name'>
                                <span class='btn-grad sq col-sm-3' id='btnAddCourse' style='text-align:center;height:fit-content;'>Add</span>
                                <span class='col-sm-12'></span>
                                <span class='col-sm-10 sq neutral-alert' id='addResults'>Enter the datas to create a new course or a new event!</span>
                            </div>
                        </div>
                    </section>";
            }
            ?>
        </div>
    </div>
    <!--responsive menu-->
    <div class="main">
        <section class="row day-wrapper">
            <div class="col-sm-1" style="padding-left:0"></div>
            <div class="col-sm-7 day">
                <span class="day-visible">Today</span>
                <span>Tomorrow</span>
                <span class="custom-day"></span>
                <input type="hidden" id="selectedDay">
            </div>
            <div class="col-sm-4 justify-content-center" style="display:flex;align-items:center;">
                <input id="calendar" type="date" style="background-color:transparent;border:none;">
            </div>
        </section>
        <!--event list-->
        <section class="timeline-wrapper row justify-content-center">
            <div class="timeline justify-content-center sq"></div>
        </section>
        <!--course list-->
        <section id="coursesW" class="course-wrapper row justify-content-center">
            <span class="courses-title">Courses</span>
            <div class="courses justify-content-center sq"></div>
        </section>
        <!--delete profile-->
        <section id="settings" class="course-wrapper justify-content-center container-fluid">
            <span class="courses-title">Settings</span>
            <div class="courses row sq justify-content-center" style="display: flex;align-items:center">
                <div class="col-sm-7 row">
                    <span class="col-sm-12" style="font-size:4vh;text-align:left">Change password</span>
                    <div class="row col-sm-8">
                        <input class="col-sm-10" type="password" name="password" id="changePwd" placeholder="Password"><br>
                        <input class="col-sm-10" type="password" name="password" id="changePwdConfirm" placeholder="Confirm password"><br>
                    </div>
                    <span class="col-sm-12"></span>
                    <span class="col-sm-4 text-center sq fail-alert">Delete profile</span>
                    <span class="col-sm-4 text-center sq success-alert">Change password</span>
                </div>
                <div class="col-sm-5 row justify-content-center">
                    <?php
                        $dir="server/uploads/".$user["email"];
                        $files=scandir($dir);
                        array_splice($files,0,2);
                        if(count($files)>0)
                        echo '<span class="col-sm-12" style="font-size:4vh;text-align:left">Upladed files</span>';
                        for($i=0;$i<count($files);$i++){
                            echo "<div class='col-sm-12 row sq text-white' style='padding:1vw;height:fit-content;line-height:normal;background-color:#652d92;'>
                                    <a href='$dir/".$files[$i]."' target='_blank' class='col-sm-4' style='color:#fff'>".$files[$i]."</a>
                                    <div class='col-sm-6'></div>
                                    <div class='col-sm-2 justify-content-center '>
                                        <a style='color:#fff' download href='$dir/".$files[$i]."' class='fas fa-download'></a>
                                        <i name='deleteFile' class='fas fa-times' style='padding-left:7%'><input type='hidden' value='$dir/".$files[$i]."'></i>
                                    </div>
                                </div>";
                        }
                    ?>
                </div>
            </div>

        </section>
        <script>
            setPasswords();
        </script>
    </div>

</body>

</html>