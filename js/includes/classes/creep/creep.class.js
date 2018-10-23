// Creep code
Creep = function (x,y,width,height,img,hp,spd,reward) {

    var self = generateEntity(x,y,width,height,img);
    self.color = 'red';
    self.spriteAnimCounter = 0;
    self.spd = spd;
    self.hpMax = hp;
    self.hp = hp;
    self.reward = reward;
    self.direction = ['offPath'];
    self.toRemove = false;

    self.draw = function() {
        ctx.save();

        var x = self.x - self.width/2;
        var y = self.y - self.height/2;

        var frameWidth = self.img.width/4;
        var frameHeight = self.img.height/4;

        var directionMod = 3;	//draw right
        if(self.direction[self.direction.length-1] === 'South')	//down
            directionMod = 0;
        else if(self.direction[self.direction.length-1] === 'West')	//left
            directionMod = 1;
        else if(self.direction[self.direction.length-1] === 'North')	//up
            directionMod = 2;

        var walkingMod = Math.floor(self.spriteAnimCounter)%4;

        ctx.drawImage(self.img,
            walkingMod*frameWidth,directionMod*frameHeight,frameWidth,frameHeight,
            x,y,self.width,self.height
        );

        //hp bar
        ctx.globalAlpha = 1;
        y = y-self.height/4;

        ctx.fillStyle = 'red';
        var width = Map.tileSize*self.hp/self.hpMax;
        if(width < 0)
            width = 0;
        ctx.fillRect(x,y,width,4);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(x,y,Map.tileSize,4);

        ctx.restore();
    };

    self.destroyTower = function () {

        var tile = self.returnTile();

        if (tile.arrX+1 < Map.width/Map.tileSize && Map.arrayMap[tile.arrY][tile.arrX+1]%1 !== 0 ) { //destroy right
            Building.list[Map.arrayMap[tile.arrY][tile.arrX+1]%1].deconstruct();
        } else if (tile.arrY+1 < Map.width/Map.tileSize && Map.arrayMap[tile.arrY+1][tile.arrX]%1 !== 0 ) { //destroy down
            Building.list[Map.arrayMap[tile.arrY+1][tile.arrX]%1].deconstruct();
        } else if (tile.arrY-1 >= 0 && Map.arrayMap[tile.arrY-1][tile.arrX]%1 !== 0 ) { //destroy up
            Building.list[Map.arrayMap[tile.arrY-1][tile.arrX]%1].deconstruct();
        } else if (tile.arrX-1 >= 0 && Map.arrayMap[tile.arrY][tile.arrX-1]%1 !== 0 ) { //destroy left
            Building.list[Map.arrayMap[tile.arrY][tile.arrX-1]%1].deconstruct();
        } else { //destroy the last tower built
            Building.list[Object.keys(Building.list)[Object.keys(Building.list).length-1]].deconstruct();
        }

    };

    self.die = function() {
        player.resource += self.reward;
        self.toRemove = true;
        Coin(self.x,self.y,Map.tileSize,Map.tileSize,Img.coinAnimated);
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

        if (self.pathInfo[0] === 'blocked') {
            self.direction[0] = 'blocked';
        } else if (self.pathInfo.strRoute.indexOf('dft'+(creepLocation.arrY)+'dfl'+(creepLocation.arrX))  === -1) {
            console.log('not on path');
            self.pathInfo = self.setPath();
            self.findDirection();
        } else if (self.pathInfo.strRoute.lastIndexOf('dft'+(creepLocation.arrY)+'dfl'+(creepLocation.arrX)) >= 0) {
            self.direction = [];
            for (var i = 0; i <= self.spdFactor;i++) {
                if ( self.pathInfo.path[self.pathInfo.strRoute.lastIndexOf('dft' + (creepLocation.arrY) + 'dfl' + (creepLocation.arrX)) + (i + 1)] ) {
                    self.direction[i] = self.pathInfo.path[self.pathInfo.strRoute.lastIndexOf('dft' + (creepLocation.arrY) + 'dfl' + (creepLocation.arrX)) + (i + 1)];
                }
            }
        } else {
            console.log('path info checks failed');
        }

    };

    self.score = function() {
        player.lives--;
        self.toRemove = true;
    };

    self.setPath = function() {

        var tile = self.returnTile();
        var goal = {x:52,y:tile.arrY};
        var diffX = Math.abs(tile.arrX - goal.x);
        var diffY = Math.abs(tile.arrY - goal.y);
        var distance = Math.sqrt(diffX * diffX + diffY * diffY);
        var arrIndex = 0;

        if ('strRoute' in Creep.path) {
            if (Creep.path.strRoute.indexOf('dft'+tile.arrY+'dfl'+tile.arrX ) !== -1) {
                return Creep.path;
            } else {
                for (var p = 0; p < Creep.path.route.length;p++) {
                    diffX = Math.abs(tile.arrX - Creep.path.route[p].x);
                    diffY = Math.abs(tile.arrY - Creep.path.route[p].y);
                    var targetDistance = Math.sqrt(diffX * diffX + diffY * diffY);

                    if (targetDistance < distance) {
                        if (p > arrIndex) {
                            goal = Creep.path.route[p];
                            distance = targetDistance;
                            arrIndex = p;
                        }
                    }
                }
            }
        }

        var path = findShortestPath(tile, Map.arrayMap, goal);

        if (path) {

            if (Map.arrayMap[path.distanceFromTop][path.distanceFromLeft] !== 4) {
                path.path = path.path.concat(Creep.path.path.slice(arrIndex+1));
                path.route = path.route.concat(Creep.path.route.slice(arrIndex+1));
                path.strRoute = path.strRoute.concat(Creep.path.strRoute.slice(arrIndex+1));
                path.distanceFromLeft = Creep.path.distanceFromLeft;
                path.distanceFromTop = Creep.path.distanceFromTop;
            }

            Creep.path = path;

            if (path.strRoute.indexOf('dft'+tile.arrY+'dfl'+tile.arrX ) === -1) {
                if (path.strRoute.indexOf('dft' + (tile.arrY + 1) + 'dfl' + (tile.arrX)) === 0) {
                    path.path.unshift('South');
                    path.route.unshift({x:tile.arrX,y:tile.arrY});
                    path.strRoute.unshift('dft'+tile.arrY+'dfl'+tile.arrX);
                }
                else if (path.strRoute.indexOf('dft' + (tile.arrY - 1) + 'dfl' + (tile.arrX)) === 0) {
                    path.path.unshift('North');
                    path.route.unshift({x:tile.arrX,y:tile.arrY});
                    path.strRoute.unshift('dft'+tile.arrY+'dfl'+tile.arrX);
                }
                else if (path.strRoute.indexOf('dft' + (tile.arrY) + 'dfl' + (tile.arrX + 1)) === 0) {
                    path.path.unshift('East');
                    path.route.unshift({x:tile.arrX,y:tile.arrY});
                    path.strRoute.unshift('dft'+tile.arrY+'dfl'+tile.arrX);
                }
                else if (path.strRoute.indexOf('dft' + (tile.arrY) + 'dfl' + (tile.arrX - 1)) === 0) {
                    path.path.unshift('West');
                    path.route.unshift({x:tile.arrX,y:tile.arrY});
                    path.strRoute.unshift('dft'+tile.arrY+'dfl'+tile.arrX);
                }
            }

            if (Map.arrayMap[path.distanceFromTop][path.distanceFromLeft] !== 4 || Creep.path.strRoute.indexOf('dft'+tile.arrY+'dfl'+tile.arrX ) === -1) {
                console.log('break');
            }

            return path;
        } else {
            console.log('Path blocked');
            path = ['blocked'];
            return path;
        }

    };

    self.showMenu = function() {

        if (player.selection === self.id && self.hp > 0) {
            ctx.save();

            ctx.fillStyle = 'black';
            ctx.fillRect(0, Map.tileSize*34.5, Map.width, Map.tileSize*4.5);
            ctx.font="18px Arial";

            var frameWidth = self.img.width/4;
            var frameHeight = self.img.height/4;
            var directionMod = 0;
            var walkingMod = Math.floor(self.spriteAnimCounter)%4;
            ctx.fillStyle = 'green';
            ctx.fillRect(Map.tileSize*2,Map.tileSize*36.75,Map.tileSize*2,Map.tileSize*2);
            ctx.drawImage(self.img,
                walkingMod*frameWidth,directionMod*frameHeight,frameWidth,frameHeight,
                Map.tileSize*2,Map.tileSize*36.75,Map.tileSize*2,Map.tileSize*2
            );

            ctx.fillStyle = 'white';
            ctx.fillText(Phase.creeps[Math.floor(Phase.atkNum%11)-1]+' - '+player.selection,Map.tileSize*2,Map.tileSize*36.5);
            ctx.font="10px Arial";
            ctx.fillText('HP: '+self.hp+'/'+self.hpMax ,Map.tileSize*5,Map.tileSize*37.5);
            ctx.fillText('Spd: '+self.spd ,Map.tileSize*5,Map.tileSize*38.5);

            ctx.restore();
        }

    };

    self.takeDamage = function(dmg) {
        self.hp -= dmg;
    };

    self.updatePosition = function() {
        for (var i = 0; i < self.direction.length;i++) {
            if (self.direction[i] === 'North') {
                if (i < self.spdFactor) {
                    self.y -= Map.tileSize;
                } else {
                    self.y -= self.spd%Map.tileSize;
                }
            } else if (self.direction[i] === 'East') {
                if (i < self.spdFactor) {
                    self.x += Map.tileSize;
                } else {
                    self.x += self.spd%Map.tileSize;
                }
            } else if (self.direction[i] === 'South') {
                if (i < self.spdFactor) {
                    self.y += Map.tileSize;
                } else {
                    self.y += self.spd%Map.tileSize;
                }
            } else if (self.direction[i] === 'West') {
                if (i < self.spdFactor) {
                    self.x -= Map.tileSize;
                } else {
                    self.x -= self.spd%Map.tileSize;
                }
            } else if (self.direction[i] === 'blocked') {
                self.destroyTower();
            } else {
                console.log('what direction are you going?');
            }

            if (self.returnTileValue() === 4) {
                self.score();
            }

            self.validatePosition();
        }
    };

    self.validatePosition = function () {

        if (self.returnTileValue() % 2 !== 0) {//0=path,1=wall/water,2=water_shallow,3=tower,4=goal
            var tile = self.returnTile();
            if (Map.arrayMap[tile.arrY][tile.arrX - 1] % 2 === 0 && tile.onMap) {
                self.x -= Map.tileSize;
            } else if (Map.arrayMap[tile.arrY - 1][tile.arrX] % 2 === 0 && tile.onMap) {
                self.y -= Map.tileSize;
            } else if (Map.arrayMap[tile.arrY + 1][tile.arrX] % 2 === 0 && tile.onMap) {
                self.y += Map.tileSize;
            } else if (Map.arrayMap[tile.arrY + 1][tile.arrX] % 2 === 0 && tile.onMap) {
                self.x += Map.tileSize;
            } else {
                console.log("Well and truly stuck!");
            }
            self.pathInfo = self.setPath();
            self.findDirection();
        }

    };

    self.update = function() {
        self.spriteAnimCounter += 0.125;
        self.showMenu();
        self.findDirection();
        self.updatePosition();
        self.draw();
        if (self.hp <= 0) {
            self.die();
        }
    };

    self.pathInfo = self.setPath();

    return self;

};

Creep.list = {};

Creep.update = function() {
    Creep.path = {};
    for (var key in Creep.list) {
        if (Creep.list.hasOwnProperty(key)) {
            if (player.paused) {
                Creep.list[key].draw();
                Creep.list[key].showMenu();
                continue;
            }
            Creep.list[key].update();
            if (Creep.list[key].toRemove) {
                delete Creep.list[key];
            }
        }
    }
};