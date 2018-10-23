Ghost = function(x,y,width,height,img,hp,spd,reward) {

    var self = Creep(x,y,width,height,img,hp,spd,reward);

    var super_draw = self.draw;
    self.draw = function() {
        ctx.save();
        ctx.globalAlpha = 0.5;
        super_draw();
        ctx.restore();
    };

    self.findDirection = function() {
        var creepLocation = self.returnTile();

        self.spdFactor = Math.floor(self.spd/16);

        if (!creepLocation.onMap) {
            console.log('not on map');
            self.x = Map.tileSize*5;
            self.y = Map.tileSize*19;
            self.setPath();
        }
        self.direction = [];
        if (self.y >= 17*Map.tileSize && self.y <= 23*Map.tileSize) {
            for (var i = 0; i <= self.spdFactor;i++) {
                self.direction[i] = 'East';
            }
        } else if (self.y < 17*Map.tileSize) {
            for (var i = 0; i <= self.spdFactor;i++) {
                self.direction[i] = 'South';
            }
        } else if (self.y > 23*Map.tileSize) {
            for (var i = 0; i <= self.spdFactor;i++) {
                self.direction[i] = 'North';
            }
        } else {
            console.log('path info checks failed');
        }

    };

    var super_showMenu = self.showMenu;
    self.showMenu = function() {

        if (player.selection === self.id && self.hp > 0) {
            super_showMenu();
            ctx.save();

            ctx.textAlign = "center";
            ctx.fillStyle = 'white';
            ctx.font="bold 10px Arial";
            ctx.fillText('Abilities',Map.tileSize*12,Map.tileSize*37.5);
            ctx.fillText('____________',Map.tileSize*12,Map.tileSize*37.5);
            ctx.font="10px Arial";
            ctx.fillText('ethereal',Map.tileSize*12,Map.tileSize*38.5);

            ctx.restore();
        }

    };

    self.validatePosition = function () {

    };

  return self;

};