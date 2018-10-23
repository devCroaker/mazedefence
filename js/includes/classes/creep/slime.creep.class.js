Slime = function(x,y,width,height,img,hp,spd,reward) {

    var self = Creep(x, y, width, height, img, hp, spd, reward);
    self.split = true;

    var super_die = self.die;
    self.die = function () {
        if (self.reward > 0) {
            player.resource += self.reward;
            Coin(self.x, self.y, Map.tileSize, Map.tileSize, Img.coinAnimated);
        }
        self.toRemove = true;

        if (self.split === true) {
            var yAdj = 0;
            var xAdj = 0;
            if (self.direction === 'North' || self.direction === 'South') {
                yAdj = 4;
            } else if (self.direction === 'East' || self.direction === 'West') {
                xAdj = 4;
            }
            var baby1 = Slime(self.x - xAdj, self.y - yAdj, self.width *.75, self.height *.75, self.img, Math.floor(self.hpMax / 4), self.spd, 0);
            var baby2 = Slime(self.x + xAdj, self.y + yAdj, self.width *.75, self.height *.75, self.img, Math.floor(self.hpMax / 4), self.spd, 0);
            baby1.split = false;
            baby2.split = false;
            Creep.list[baby1.id] = baby1;
            Creep.list[baby2.id] = baby2;
        }
    };

    var super_showMenu = self.showMenu;
    self.showMenu = function () {

        if (player.selection === self.id && self.hp > 0) {
            super_showMenu();
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = 'white';
            ctx.font = "bold 10px Arial";
            ctx.fillText('Abilities', Map.tileSize * 12, Map.tileSize * 37.5);
            ctx.fillText('____________', Map.tileSize * 12, Map.tileSize * 37.5);
            ctx.font = "10px Arial";
            ctx.fillText('Split', Map.tileSize * 12, Map.tileSize * 38.5);

            ctx.restore();
        }

    };

    return self;
};