var ctx = document.getElementById('ctx').getContext('2d');

var FRAMES = 50;
var INTERVAL = 1000 / FRAMES;
var frameCount = 0;
var player;
var Map;

startNewGame = function(){

    frameCount = 0;
    player.lives = 30;
    player.resource = 90;
    player.paused = false;
    Map.reset();
    Creep.list = {};
    Building.list = {};
    Projectile.list = {};
    Phase.list = {};
    Phase.generate();
    Phase.list['building'].start();

};

endGame = function() {
    player.paused = true;
    delete player.construction;
    delete player.selection;
    document.getElementById('ctx').style.cursor = 'auto';

    ctx.save();
    ctx.textAlign = "center";

    ctx.fillStyle = '#9aa0a6';
    ctx.fillRect(Map.tileSize * 20.3, Map.tileSize * 9.8, Map.tileSize * 12.4, Map.tileSize * 19.4);
    ctx.fillStyle = 'black';
    ctx.fillRect(Map.tileSize * 20.5, Map.tileSize * 10, Map.tileSize * 12, Map.tileSize * 19);
    ctx.fillStyle = 'white';
    ctx.fillRect(Map.tileSize * 22.5, Map.tileSize * 16, Map.tileSize * 8, Map.tileSize * 3);
    ctx.fillRect(Map.tileSize * 22.5, Map.tileSize * 20, Map.tileSize * 8, Map.tileSize * 3);
    ctx.fillRect(Map.tileSize * 22.5, Map.tileSize * 24, Map.tileSize * 8, Map.tileSize * 3);
    ctx.fillStyle = '#9aa0a6';
    ctx.fillRect(Map.tileSize * 22.7, Map.tileSize * 16.2, Map.tileSize * 7.6, Map.tileSize * 2.6);
    ctx.fillRect(Map.tileSize * 22.7, Map.tileSize * 20.2, Map.tileSize * 7.6, Map.tileSize * 2.6);
    ctx.fillRect(Map.tileSize * 22.7, Map.tileSize * 24.2, Map.tileSize * 7.6, Map.tileSize * 2.6);

    ctx.font = "bold 24px Ariel";
    ctx.fillText('Game Over', Map.width/2, Map.tileSize*13);
    ctx.fillStyle = "black";
    ctx.font = "24px Ariel";
    ctx.fillText('Continue', Map.width/2, Map.tileSize*18);
    ctx.fillText('New Game', Map.width/2, Map.tileSize*22);
    ctx.fillText('Quit', Map.width/2, Map.tileSize*26);

    ctx.restore();

};

update = function() {

    ctx.clearRect(0,0,Map.width,Map.height);
    Map.draw();
    if (player.paused == false) {
        frameCount++;
        Phase.update();
    }
    Building.update();
    Projectile.update();
    Creep.update();
    Coin.update();
    player.update();

};

// Program //
player = player();
Map = Map(Img.map,624,848,16,array_2D_map);
startNewGame();
setInterval(update, INTERVAL);