Dino = function(x,y,width,height,img,hp,spd,reward) {

    var self = Creep(x,y,width,height,img,hp,spd,reward);
    self.speedBoost = false;
    self.speedBoostTimer = 0;

    self.useSpeedBoost = function() {
        if (self.speedBoost) {

            if (self.speedBoostTimer == 0) {
                self.spd = self.spd*1.5
            }
            if (self.speedBoostTimer == FRAMES) {
                self.speedBoost = false;
                self.speedBoostTimer = self.speedBoostTimer*2;
                self.spd = self.spd/1.5
            }
            self.speedBoostTimer++;

        } else if (self.speedBoostTimer > 0) {

            self.speedBoostTimer--;

        }
    };

    var super_takeDamage = self.takeDamage;
    self.takeDamage = function(dmg) {
        super_takeDamage(dmg);
        if (self.speedBoostTimer == 0) {
            self.speedBoost = true;
        }
    };

    var super_draw = self.draw;
    self.draw = function() {
        ctx.save();
        super_draw();
        if (self.speedBoost) {
            //reestablish variables :/
            var x = self.x - self.width / 2;
            var y = self.y - self.height / 2;

            var frameWidth = self.img.width / 4;
            var frameHeight = self.img.height / 4;

            var walkingMod = Math.floor(self.spriteAnimCounter) % 4;
            var directionMod = 3;	//draw right
            if (self.direction[self.direction.length - 1] === 'South')	//down
                directionMod = 0;
            else if (self.direction[self.direction.length - 1] === 'West')	//left
                directionMod = 1;
            else if (self.direction[self.direction.length - 1] === 'North')	//up
                directionMod = 2;

            if (directionMod == 3) { // right
                x -= self.width / 2;
            } else if (directionMod == 0) { // down
                y -= self.height / 2;
            } else if (directionMod == 1) { // left
                x += self.width / 2;
            } else if (directionMod == 2) { // up
                y += self.height / 2;
            }

            //actually draw go fast
            ctx.globalAlpha = 0.5;
            ctx.drawImage(self.img,
                walkingMod * frameWidth, directionMod * frameHeight, frameWidth, frameHeight,
                x, y, self.width, self.height
            );
            if (directionMod == 3) { // right
                x -= self.width / 2;
            } else if (directionMod == 0) { // down
                y -= self.height / 2;
            } else if (directionMod == 1) { // left
                x += self.width / 2;
            } else if (directionMod == 2) { // up
                y += self.height / 2;
            }
            ctx.globalAlpha = 0.3;
            ctx.drawImage(self.img,
                walkingMod * frameWidth, directionMod * frameHeight, frameWidth, frameHeight,
                x, y, self.width, self.height
            );
        }
        ctx.restore();
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
            ctx.fillText('Speed Burst',Map.tileSize*12,Map.tileSize*38.5);

            ctx.restore();
        }

    };

    var super_update = self.update;
    self.update = function() {
        self.useSpeedBoost();
        super_update();
    };

  return self;

};