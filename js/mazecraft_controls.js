// Controls //
document.addEventListener("mousemove", function(mouse) {

    var rect = document.getElementById('ctx').getBoundingClientRect();

    player.pointer.x = mouse.clientX - rect.left;
    player.pointer.y = mouse.clientY - rect.top;

});

document.onclick = function(){

    if (player.pointer.y > Map.tileSize*34.5) {  //clicked on menu

        if (player.building) { // player is building

            player.clickMenu();

        } else if (player.selection !== '') { //tower or creep?

            if (Building.list[player.selection]) { // have a selected tower?
                Building.list[player.selection].clickMenu();
            }

        } else if (player.pointer.x > Map.tileSize*23.5 && player.pointer.x < Map.tileSize*29.5 && player.pointer.y > Map.tileSize*35 && player.pointer.y < Map.tileSize*37.5) {
            player.building = true;
            player.menutab = 0;
        }

    } else if (player.pointer.y <= Map.tileSize*34.5) { // clicked above menu

        //player is building
        if (player.building) {

            if (player.construction) {
                if (player.valid) {
                    player.construct();
                }
            } else {
                player.building = false;
                document.getElementById('ctx').style.cursor = 'auto';
                if (Building.list.hasOwnProperty(player.pointer.returnTileValue())) { //clicked on tower?
                    player.selection = player.pointer.returnTileValue();
                } else if (player.pointer.isOnCreep()) { //clicked on creep?
                }
            }

        //player is not building
        } else if (Building.list.hasOwnProperty(player.pointer.returnTileValue())) { //clicked on tower?
            player.selection = player.pointer.returnTileValue();

        } else if (player.pointer.isOnCreep()) { //clicked on creep?
            //you have selected the creep

        } else {
            player.selection = '';
        }

        //end game menu
        if (player.paused === true && player.lives <= 0) {
            if (player.pointer.x > Map.tileSize*22.5 && player.pointer.x < Map.tileSize*30.5 && player.pointer.y > Map.tileSize*16 && player.pointer.y < Map.tileSize*19)
            {
                player.lives = 30;
                player.paused = false;
            }
            else if (player.pointer.x > Map.tileSize*22.5 && player.pointer.x < Map.tileSize*30.5 && player.pointer.y > Map.tileSize*20 && player.pointer.y < Map.tileSize*23)
            {
                startNewGame();
            }
            else if (player.pointer.x > Map.tileSize*22.5 && player.pointer.x < Map.tileSize*30.5 && player.pointer.y > Map.tileSize*24 && player.pointer.y < Map.tileSize*27)
            {
                window.location.href = 'http://mazedefence.com';
            }
        }

    }

};

document.addEventListener('contextmenu', function(mouse) {

    delete player.construction;
    player.selection = '';
    player.building = false;
    document.getElementById('ctx').style.cursor = 'auto';
    mouse.preventDefault();

});

document.addEventListener("keydown", function(e) {

    if (e.keyCode === 32) { //space
        if (player.lives > 0) {
            player.paused ^= true;
        }
        e.preventDefault();
    }

    if (e.key === 'b') { // build
        player.building ^= true;
        if (!player.building) {
            document.getElementById('ctx').style.cursor = 'auto';
        } else {
            player.menutab = 0;
        }
        player.selection = '';
        delete player.construction;
    }

    if (player.building) { // build hotkeys NEED TO REVAMP THIS SOMEHOW

        var build = {};
        //self.buildingType.list = ['tower','seekingTower','wall','pyramid'];
        if (e.key === 't') {
            delete player.construction;
            build = player.buildingType[player.buildingType.list[0]];
            player.construction = build.type(build.height,build.width,build.img,build.cst,build.dmg,build.atkRate,build.atkLife,build.atkMove);
        }
        if (e.key === 'w') {
            delete player.construction;
            build = player.buildingType[player.buildingType.list[2]];
            player.construction = build.type(build.height,build.width,build.img,build.cst,build.dmg,build.atkRate,build.atkLife,build.atkMove);
        }
        if (e.key === 'p') {
            delete player.construction;
            build = player.buildingType[player.buildingType.list[3]];
            player.construction = build.type(build.height,build.width,build.img,build.cst,build.dmg,build.atkRate,build.atkLife,build.atkMove);
        }
        if (e.key === 's') {
            delete player.construction;
            build = player.buildingType[player.buildingType.list[4]];
            player.construction = build.type(build.height,build.width,build.img,build.cst,build.dmg,build.atkRate,build.atkLife,build.atkMove);
        }
    }

});