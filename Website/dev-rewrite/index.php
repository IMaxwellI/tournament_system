<!-- 
Version 0.4 / 25.03.2023 
Changelog:
    - Added Changelog
    - Added php
    - Changed folder structure

    > Uploaded to dev.imaxwelli.com

-->
<!DOCTYPE html>
<html lang="en">

<?php
    $title = "IMaxwellI";
?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/index.css">
    <script src="https://kit.fontawesome.com/3aba878674.js" crossorigin="anonymous"></script>
    <title><?php echo $title; ?></title>
</head>

<body>
    <div class="background-image"></div>

    <?php include_once("./navbar.php"); ?>
    
    <section class="landing">
        <div class="content">
            <h1 class="welcome">Welcome!</h1>
            <h2 class="welcome">This is me, IMaxwellI</h2>
            <hr class="line">
            <p class="sub-title1">Freelance TO / TL</p>
            <p class="sub-title2">Rocket League / osu! / etc.</p>
        </div>
    </section>

</body>

</html>