<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MazeCraft</title>
    <link rel="stylesheet" type="text/css" href="./css/mazecraft.css">
</head>
<body>
<div id="canvas_div">
    <canvas id="ctx" width="848" height="624" style="border:1px solid #000000;"></canvas>
</div>

<?php

$include_dirs = array();
$include_dirs[0]   = './js/includes/';
$include_dirs[1]   = $include_dirs[0].'classes/';
$dir = new DirectoryIterator($include_dirs[1]);
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot()) {
        if ($fileinfo->isDir()) {
            $include_dirs[] = $include_dirs[1].$dir.'/';
        }
    }
}

foreach ($include_dirs as $directory) {
    $dir = new DirectoryIterator($directory);
    foreach ($dir as $fileinfo) {
        if (substr($fileinfo->getFilename(),-3) === '.js') {
            echo '<script type="text/javascript" src="'.ltrim($directory,'./').$fileinfo->getFilename().'"></script><br />';
        }
    }
}

echo '<script type="text/javascript" src="js/mazecraft_controls.js"></script><br />';
echo '<script type="text/javascript" src="js/mazecraft.js"></script><br />';
?>

</body>
</html>


<!--

    Special thanks to Duke_wintermaul

    Many images from http://clipart.nicubunu.ro/?gallery=rpg_map

    Map made with the below tileset {
        --------------------------------------------------------------------------------
        *.png
        --------------------------------------------------------------------------------
        every single tileset file is based on / uses parts of the Tiled Terrains Tileset
        http://opengameart.org/content/tiled-terrains
        which is submitted by adrix89 and licensed under cc-by-sa 3.0 and gpl 3.0.
        For attribution of these tiles see the included terrain_attribution.txt.
        They are rescaled to 16x16 and improved
        Some parts come from other tilesets, they are listed here (if something is not listed here, it is from the Tiled Terrains Tileset)
        --------------------------------------------------------------------------------
        tileset_basic_terrain.png
        --------------------------------------------------------------------------------
        flower tiles (on grass) from:
        http://opengameart.org/content/lpc-forest-tiles
        licensed under CC-BY-SA
        -  Based on LPC's Grass made by Lanea Zimmerman (Sharm)
        grass-structure from:
        http://opengameart.org/content/16x16-game-assets
        licensed under cc-by 3.0
        based on grass tiles by George_
        --------------------------------------------------------------------------------
        tileset_cave.png
        --------------------------------------------------------------------------------
        cave-ground uses structure from sand as overlay
        --------------------------------------------------
        from / based on
        http://opengameart.org/content/16x16-game-assets
        licensed under cc-by 3.0
        by George_
        are:
        crystals, rocks and "lower wall" (8.png)
        cave wall uses structure ( 7.png)
        cave entrance (5.png)
        --------------------------------------------------------------------------------
        tileset_mountains.png
        --------------------------------------------------------------------------------
        from / based on
        http://opengameart.org/content/16x16-game-assets
        licensed under cc-by 3.0
        by George_
        are:
        crystals, rocks and "lower wall" (8.png)
        cave wall uses structure ( 7.png)
        cave entrance (5.png)
        grass-structure (1.png)
        --------------------------------------------------------------------------------
        tileset_mountains2.png
        --------------------------------------------------------------------------------
        based on tileset_mountains.png,
        ground from tileset_cave.png and brown ground from default path (tileset_basic_terrain.png)
        --------------------------------------------------------------------------------
        tileset_other.png
        --------------------------------------------------------------------------------
        buildings, fence, hedge, flowers, signs (under fence) and mailbox from
        http://opengameart.org/content/orthographic-outdoor-tiles
        by buch
        released under CC0
        darker signs and tree-trunks, trees and bushes
        from
        http://opengameart.org/content/outdoor-tiles-again
        by buch
        released under cc-by 3.0
        (i added more trees and bushes and added a snow-variant)
        Bee nests from:
        http://opengameart.org/content/lpc-forest-tiles
        released under CC-BY-SA
         by Tuomo Untinen
        --------------------------------------------------------------------------------
        tileset_water_animated.png
        --------------------------------------------------------------------------------
        ice is based on default snow
        grass-structure from:
        http://opengameart.org/content/16x16-game-assets
        licensed under cc-by 3.0
        based on grass tiles by George_
        animated water and default rocks in water from:
        http://opengameart.org/content/lpc-forest-tiles
        snow, sand and waterfall animated by me.
        cold water, water transition
        based on
        http://opengameart.org/content/lpc-terrain-repack-2
        released under cc-by-sa 3.0 and gpl 3.0. (which comes originally from http://opengameart.org/content/lpc-colorful-sand-deep-water
        --------------------------------------------------------------------------------
        tileset_water.png
        --------------------------------------------------------------------------------
        based on tileset_water_animated.png
        )

        I got the bullets from somewhere on http://opengameart.org also...


-->
