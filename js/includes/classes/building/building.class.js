//Buildings code
Building = function (height,width,img,prc,dmg,atkRate,atkLife,atkMove) {

    var self = generateEntity(0,0,width,height,img);
    self.tile_width = self.width/Map.tileSize;
    self.tile_height = self.height/Map.tileSize;
    self.projectileImg = Img.ammo;
    self.atkTimer = 0;
    self.dmg = dmg;
    self.atkRate = atkRate;
    self.atkLifeSpan = atkLife;
    self.atkMoveSpeed = atkMove;
    self.aimAngle = 0;
    self.price = prc;

    self.upgradeType = {};
    self.upgradeType.list = ['atkRate','dmg'];
    self.upgradeType.atkRate = {name:'Atk Speed',stat:'atkRate',amt:-3,cst:5,img:Img.arrowSpd};
    self.upgradeType.dmg = {name:'Damage',stat:'dmg',amt:.5,cst:3,img:Img.arrowUp};

    self.deconstruct = function() {
        for (var i = 0; i < self.footprint.length; i++) {
            Map.arrayMap[self.footprint[i].y][self.footprint[i].x] = 0;
        }

        for (var c in Creep.list) {
            if (Creep.list.hasOwnProperty(c)) {
                Creep.list[c].pathInfo = Creep.list[c].setPath();
            }
        }

        player.resource += self.price;
        delete Building.list[self.id];
    };

    self.setFootprint = function() {

        self.footprint = [];
        self.footprint_value = 0;

        //self.pointer_tile = self.returnTile();

        for (var i = 0; i < self.tile_height; i++) {
            for (var j = 0; j < self.tile_width; j++) {
                self.footprint.push({x: self.pointer_tile.arrX + j, y: self.pointer_tile.arrY + i});
                if (self.pointer_tile.arrX + j < Map.width / Map.tileSize && self.pointer_tile.arrY + i < Map.height / Map.tileSize) {
                    self.footprint_value += Map.arrayMap[self.pointer_tile.arrY + i][self.pointer_tile.arrX + j];
                }
            }
        }

        var tile = {
            x: self.pointer_tile.x+(Map.tileSize/2),
            y: self.pointer_tile.y+(Map.tileSize/2),
            height: self.pointer_tile.height,
            width: self.pointer_tile.width
        };

        for (var c in Creep.list) {
            if (Creep.list.hasOwnProperty(c)) {
                if (self.testCollisionEntity(tile, Creep.list[c])) {
                    self.footprint_value += 1;
                }
            }
        }
    };

    self.updateMap = function() {
        for (var i = 0; i < self.footprint.length; i++) {
            Map.arrayMap[self.footprint[i].y][self.footprint[i].x] = self.id;
        }
    };

    self.executeAttack = function() {

        self.loadAmmo();

        Projectile.list[self.ammo.id] = self.ammo;
        delete self.ammo;
        self.atkTimer = 0;

    };

    self.findTarget = function() {

        var distance = (self.atkLifeSpan*self.atkMoveSpeed);
        var target = {};
        for (var c in Creep.list) {
            if (Creep.list.hasOwnProperty(c)) {
                var diffX = self.x - Creep.list[c].x;
                var diffY = self.y - Creep.list[c].y;
                var targetDistance = Math.sqrt(diffX * diffX + diffY * diffY);

                if (targetDistance <= distance) {
                    target = Creep.list[c];
                    distance = targetDistance;
                }
            }
        }

        self.target = target;

    };

    self.loadAmmo = function() {
        //establish aim angle
        var diffX = self.target.x - self.x;
        var diffY = self.target.y - self.y;
        self.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180;

        //generate projectile
        self.ammo = Projectile(8,8,self.projectileImg,self.aimAngle,self.atkLifeSpan,self.atkMoveSpeed,self.dmg,Building.list[self.id],self.target);
    };

    self.upgrade = function(stat,amt,cst) {
        if (player.resource >= cst) {
            self[stat] = self[stat] + amt;
            self.price = self.price + cst;
            player.resource = player.resource - cst;
        }
    };

    self.clickMenu = function () {

        var num = 0;
        for (var m = Math.floor((Map.width/Map.tileSize)/2); m < ((Map.width/Map.tileSize)); m = m+3) {

            if (player.pointer.x > Map.tileSize*m && player.pointer.x < Map.tileSize*(m+2) && player.pointer.y > Map.tileSize*36 && player.pointer.y < Map.tileSize*38) { // wall
                var upgrade = {};

                if (num === 6) {
                    upgrade = self.upgradeType.atkRate;
                    if (self.atkRate > 10) {
                        self.upgrade(upgrade.stat, upgrade.amt, upgrade.cst);
                        if (self.atkRate < 10) {
                            self.atkRate = 10;
                        }
                    }
                } else if (num === 7) {
                    upgrade = self.upgradeType.dmg;
                    self.upgrade(upgrade.stat, upgrade.amt, upgrade.cst);
                } else if (num === 8) {
                    self.deconstruct();
                    player.selection = '';
                }
                break;

            }
            num++;

        }
    };

    self.showMenu = function() {

        if (player.selection === self.id) {
            ctx.save();

            // range circle
            ctx.beginPath();
            ctx.arc(self.x,self.y,self.atkLifeSpan*self.atkMoveSpeed,0,2*Math.PI,false);
            ctx.fillStyle = 'green';
            ctx.globalAlpha = 0.3;
            ctx.fill();
            //ctx.lineWidth = 5;
            //ctx.strokeStyle = '#003300';
            //ctx.stroke();

            // info text
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, Map.tileSize*34.5, Map.width, Map.tileSize*4.5);
            ctx.font="18px Arial";
            ctx.fillStyle = 'white';
            ctx.fillText(player.selection,Map.tileSize*2,Map.tileSize*35.5);
            ctx.font="10px Arial";
            ctx.fillText('Attack Rate: '+(FRAMES/self.atkRate).toFixed(2),Map.tileSize*5,Map.tileSize*36.5);
            ctx.fillText('Attack Range: '+(self.atkLifeSpan*self.atkMoveSpeed),Map.tileSize*5,Map.tileSize*37.5);
            ctx.fillText('Damage: '+self.dmg,Map.tileSize*5,Map.tileSize*38.5);
            ctx.fillStyle = 'green';
            ctx.fillRect(Map.tileSize*2,Map.tileSize*36.25,Map.tileSize*2,Map.tileSize*2);
            ctx.drawImage(self.img,Map.tileSize*2,Map.tileSize*36.25,Map.tileSize*2,Map.tileSize*2);

            // button menu
            var num = -1;
            for (var m = Math.floor((Map.width/Map.tileSize)/2); m < ((Map.width/Map.tileSize)); m = m+3) {
                var upgrade = {};
                ctx.fillStyle = 'grey';
                ctx.font="10px Arial";
                ctx.textAlign = "center";
                if (num === -1) { //far left

                } else if (num === 5) {
                    upgrade = self.upgradeType.atkRate;
                    if (self.atkRate === 10) {
                        ctx.drawImage(Img.cancel, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    }
                } else if (num === 6) {
                    upgrade = self.upgradeType.dmg;
                }

                if (num === 7) { //far right
                    ctx.fillRect(Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    ctx.drawImage(self.img, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    ctx.drawImage(Img.cancel, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    ctx.fillStyle = 'white';
                    ctx.fillText('Delete',Map.tileSize*(m+1),Map.tileSize*38.8);
                }

                if (upgrade.hasOwnProperty('name')) {
                    ctx.fillRect(Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    ctx.drawImage(upgrade.img, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    if (player.resource < upgrade.cst) {
                        ctx.drawImage(Img.cancel, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    }
                    if (upgrade.stat === 'atkRate' && self.atkRate === 10) {
                        ctx.drawImage(Img.cancel, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    }
                }

                num++;

            }

            self.showTooltip();
            ctx.restore();
        }

    };

    self.showTooltip = function() {

        var num = 0;
        for (var m = Math.floor((Map.width/Map.tileSize)/2); m < ((Map.width/Map.tileSize)); m = m+3) {
            if (player.pointer.x > Map.tileSize*m && player.pointer.x < Map.tileSize*(m+2) && player.pointer.y > Map.tileSize*36 && player.pointer.y < Map.tileSize*38) { // wall
                var upgrade = {};
                if (num === 8) {
                    //deconstruct
                } else if (num === 7) {
                    upgrade = self.upgradeType.dmg;
                } else if (num === 6) {
                    upgrade = self.upgradeType.atkRate;
                }
                if (self.upgradeType.list.indexOf(upgrade.stat) !== -1) {

                    //build the tooltip
                    ctx.save();

                    ctx.textAlign = "center";

                    ctx.fillStyle = 'black';
                    ctx.fillRect(Map.tileSize * 40.3, Map.tileSize * 24.8, Map.tileSize * 9.4, Map.tileSize * 10);
                    ctx.fillStyle = 'grey';
                    ctx.fillRect(Map.tileSize * 40.5, Map.tileSize * 25, Map.tileSize * 9, Map.tileSize * 9.5);

                    ctx.font = "bold 18px Ariel";
                    ctx.fillStyle = "black";
                    ctx.fillText(upgrade.name, 45*Map.tileSize, Map.tileSize*26.5);
                    ctx.font = "14px Ariel";
                    ctx.textAlign = "left";
                    ctx.fillText('Cost: '+upgrade.cst, Map.tileSize*41, Map.tileSize*29.5);
                    if (upgrade === self.upgradeType.atkRate) {
                        ctx.fillText('New Value: ' + (FRAMES/(self.atkRate+upgrade.amt)).toFixed(2), Map.tileSize * 41, Map.tileSize * 32);
                    } else if (upgrade === self.upgradeType.dmg) {
                        ctx.fillText('New Value: ' + (self.dmg+upgrade.amt), Map.tileSize * 41, Map.tileSize * 32);
                    }
                    if (player.resource < upgrade.cst) {
                        ctx.fillStyle = "red";
                        ctx.fillText('Need more gold', Map.tileSize * 41, Map.tileSize * 34);
                    }
                    ctx.restore();

                }
                break;
            }
            num++;
        }

    };

    self.update = function() {
        self.atkTimer++;
        self.setFootprint();
        self.updateMap();
        self.showMenu();
        self.draw();
        self.findTarget();
        if (self.target.hasOwnProperty('hp') && self.atkTimer >= self.atkRate) {
            self.executeAttack();
        }
    };

    return self;

};

Building.list = {};

Building.update = function(){
    for (var key in Building.list) {
        if (Building.list.hasOwnProperty(key)) {
            if (player.paused) {
                Building.list[key].draw();
                Building.list[key].showMenu();
                continue;
            }
            Building.list[key].update()
        }
    }
};