//player, has a pointer but is not a pointer
player = function () {

    var self = {};
    self.building = false;
    self.selection = '';
    self.resource = 0;
    self.lives = 0;
    self.paused = false;
    self.menutab = 0;

    self.pointer = generatePointer(0,0);
    self.pointer.isOnCreep = function() {
        for (var c in Creep.list) {
            if (Creep.list.hasOwnProperty(c)) {
                if (Creep.list[c].testCollisionEntity(Creep.list[c], self.pointer.returnTile())) {
                    self.selection = Creep.list[c].id;
                    return true;
                }
            }
        }
    };

    self.buildingType = {};
    self.buildingType.list = ['tower','seekingTower','wall','pyramid'];
    self.buildingType.tower = {type:Building,name:'Base Tower',height:32,width:32,img:Img.tower,cst:8,dmg:2,atkRate:Math.floor(FRAMES*.75),atkLife:30,atkMove:7,atkType:''};
    self.buildingType.seekingTower = {type:SeekingTower,name:'Seeking Tower',height:32,width:32,img:Img.seekingTower,cst:12,dmg:1.5,atkRate:Math.floor(FRAMES*.8),atkLife:25,atkMove:12,atkType:'seeking'};
    self.buildingType.wall = {type:Wall,name:'Wall',height:32,width:32,img:Img.wall,cst:1,dmg:0,atkRate:10000000000,atkLife:0,atkMove:0,atkType:'none'};
    self.buildingType.pyramid = {type:Pyramid,name:'Pyramid',height:32,width:32,img:Img.pyramid,cst:20,dmg:1,atkRate:FRAMES,atkLife:10,atkMove:4.2,atkType:'burst'};

    self.construct = function () {
        if (player.construction.x !== 0 && player.construction.y !== 0 && player.paused != true) {
            if (self.resource >= self.construction.price) {
                self.resource = self.resource - self.construction.price;
                Building.list[self.construction.id] = self.construction;
                delete player.construction;
                document.getElementById('ctx').style.cursor = 'auto';
            }
        } else {

        }
    };

    self.showConstruction = function () {

        document.getElementById('ctx').style.cursor = 'none';
        self.construction.pointer_tile = self.pointer.returnTile();
        self.construction.x = self.construction.pointer_tile.x+(self.construction.width/2);
        self.construction.y = self.construction.pointer_tile.y+(self.construction.height/2);

        self.valid = true;
        self.construction.setFootprint();

        ctx.save();

        if (self.construction.footprint_value === 0) { //0=path,1=wall/water,2=water_shallow,3=tower
            self.valid = true;
        } else {
            self.valid = false;
        }
        if (self.resource < self.construction.price) {
            self.valid = false;
        }

        if (self.valid) {
            ctx.fillStyle = 'green';
        } else {
            ctx.fillStyle = 'red';
        }
        ctx.globalAlpha = 0.6;
        ctx.fillRect(self.construction.pointer_tile.x,self.construction.pointer_tile.y,self.construction.width,self.construction.height);
        self.construction.draw();

        ctx.restore();

        return self;

    };

    self.clickMenu = function () {

        var num = 0;
        for (var m = Math.floor((Map.width/Map.tileSize)/2); m < ((Map.width/Map.tileSize)); m = m+3) {
            if (player.pointer.x > Map.tileSize*m && player.pointer.x < Map.tileSize*(m+2) && player.pointer.y > Map.tileSize*36 && player.pointer.y < Map.tileSize*38) {
                if (num === 8 && self.menutab !== Math.floor(self.buildingType.list.length/7)) {
                    self.menutab++;
                } else if (num === 0 && self.menutab !== 0) {
                    self.menutab--;
                } else {
                    num = num+(self.menutab*7)-1;
                    if (self.buildingType.list[num]) {
                        var build = self.buildingType[self.buildingType.list[num]];
                        player.construction = build.type(build.height,build.width,build.img,build.cst,build.dmg,build.atkRate,build.atkLife,build.atkMove);
                    }

                }
                break;
            }
            num++;
        }

    };

    self.showMenu = function() {

        ctx.save();

        ctx.fillStyle = 'black';
        ctx.font="18px Arial";
        var phaseStr = 'Phase: '+Phase.current;
        if (Phase.current !== 'building') {
            var creeps = 30;
            if (Phase.creeps[Math.floor((Phase.current-1)%11)] === 'zombie') {
                creeps = creeps*2;
            }
            phaseStr += '  -  '+(creeps)+' '+Phase.creeps[Math.floor((Phase.atkNum-1)%11)]+'s';
        }

        ctx.fillText(phaseStr,Map.tileSize,Map.tileSize);

        if (self.building) {

            ctx.fillRect(0, Map.tileSize * 34.5, Map.width, Map.tileSize * 4.5);
            ctx.fillStyle = 'white';
            ctx.fillText('Construction', Map.tileSize * 2, Map.tileSize * 36.5);
            /*
            ctx.font = "10px Arial";
            ctx.fillStyle = 'white';
            ctx.fillText('Tower (T)', Map.tileSize * 38, Map.tileSize * 35.5);
            ctx.fillText('Seek. (S)', Map.tileSize * 41, Map.tileSize * 35.5);
            ctx.fillText('Wall (W)', Map.tileSize * 44, Map.tileSize * 35.5);
            ctx.fillText('Pyr. (P)', Map.tileSize * 47, Map.tileSize * 35.5);
             */

            var num = -1;
            for (var m = Math.floor((Map.width/Map.tileSize)/2); m < ((Map.width/Map.tileSize)); m = m+3) {

                ctx.fillStyle = 'green';
                ctx.font="12px Arial bold";
                ctx.textAlign = "center";

                if (num === -1) { //far left

                    if (self.menutab === 0) {  //on first menu tab

                    } else {
                        ctx.fillRect(Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                        ctx.drawImage(Img.arrowLeft, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    }

                } else if (num === 7) { //far right

                    if (self.menutab === Math.floor(self.buildingType.list.length/7)) { //On last menu tab

                    } else {
                        ctx.fillRect(Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                        ctx.drawImage(Img.arrowRight, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    }

                } else if (self.buildingType.list[num+(7*self.menutab)]) {
                    var build = self.buildingType[self.buildingType.list[num+(7*self.menutab)]];
                    ctx.fillRect(Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    ctx.drawImage(build.img, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    ctx.fillStyle = 'white';
                    ctx.fillText(build.name.substring(0,1).toUpperCase(),Map.tileSize*(m+1),Map.tileSize*38.8);
                    if (player.resource < build.cst) {
                        ctx.drawImage(Img.cancel, Map.tileSize * m, Map.tileSize * 36, Map.tileSize * 2, Map.tileSize * 2);
                    }
                }

                num++;

            }

            self.showTooltip();

        } else if (player.selection === '') {
            ctx.fillStyle = 'grey';
            ctx.fillRect(Map.tileSize * 23.3, Map.tileSize * 34.8, Map.tileSize * 6.4, Map.tileSize * 2.9);
            ctx.fillStyle = 'black';
            ctx.fillRect(Map.tileSize * 23.5, Map.tileSize * 35, Map.tileSize * 6, Map.tileSize * 2.5);
            ctx.fillStyle = 'white';
            ctx.textAlign = "center";
            ctx.font="32px Arial bold";
            ctx.fillText('Build',Map.width/2,Map.tileSize*37);
        }

        if (player.paused) {
            ctx.font = "bold 24px Ariel";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            if (self.lives > 0) {
                ctx.fillText('PAUSED', Map.width / 2, Map.tileSize * 4);
            }
        }

        ctx.restore();

    };

    self.showTooltip = function() {

        var num = 0;
        for (var m = Math.floor((Map.width/Map.tileSize)/2); m < ((Map.width/Map.tileSize)); m = m+3) {
            if (player.pointer.x > Map.tileSize*m && player.pointer.x < Map.tileSize*(m+2) && player.pointer.y > Map.tileSize*36 && player.pointer.y < Map.tileSize*38) { // wall
                if (num == 8 && self.menutab != Math.floor(self.buildingType.list.length/7)) {
                    self.menutab++;
                } else if (num == 0 && self.menutab != 0) {
                    self.menutab--;
                } else {
                    num = num+(self.menutab*7)-1;
                    if (self.buildingType.list[num]) {
                        var build = self.buildingType[self.buildingType.list[num]];

                        //build the tooltip
                        ctx.save();

                        ctx.textAlign = "center";

                        ctx.fillStyle = 'black';
                        ctx.fillRect(Map.tileSize * 40.3, Map.tileSize * 24.8, Map.tileSize * 9.4, Map.tileSize * 10);
                        ctx.fillStyle = 'grey';
                        ctx.fillRect(Map.tileSize * 40.5, Map.tileSize * 25, Map.tileSize * 9, Map.tileSize * 9.5);

                        ctx.font = "bold 18px Ariel";
                        ctx.fillStyle = "black";
                        ctx.fillText(build.name+' ('+build.name.substring(0,1).toUpperCase()+')', 45*Map.tileSize, Map.tileSize*26.5);
                        ctx.font = "14px Ariel";
                        ctx.textAlign = "left";
                        ctx.fillText('Cost: '+build.cst, Map.tileSize*41, Map.tileSize*28);
                        ctx.fillText('Damage: '+build.dmg, Map.tileSize*41, Map.tileSize*29);
                        ctx.fillText('AtK Spd: '+(FRAMES/build.atkRate).toFixed(2), Map.tileSize*41, Map.tileSize*30);
                        ctx.fillText('Atk Range: '+build.atkLife*build.atkMove, Map.tileSize*41, Map.tileSize*31);
                        if (build.atkType != '') {
                            ctx.fillText('AtK: '+build.atkType, Map.tileSize*41, Map.tileSize*32);
                        }

                        if (player.resource < build.cst) {
                            ctx.fillStyle = "red";
                            ctx.fillText('Need more gold', Map.tileSize * 41, Map.tileSize * 34);
                        }

                        ctx.restore();

                    }

                }
                break;
            }
            num++;
        }

    };

    self.showResource = function() {
        ctx.save();

        ctx.fillStyle = 'black';
        ctx.font="bold 16px Arial";
        ctx.drawImage(Img.heart,Map.tileSize*43,2,Map.tileSize,Map.tileSize);
        ctx.fillText(' '+self.lives,Map.tileSize*44,Map.tileSize);
        ctx.drawImage(Img.coin,Map.tileSize*48,2,Map.tileSize,Map.tileSize);
        ctx.fillText(' '+self.resource,Map.tileSize*49,Map.tileSize);

        ctx.restore();
    };

    self.update = function () {

        self.showResource();
        self.showMenu();
        if (self.lives<=0) {
            endGame();
        }
        if (player.construction && player.paused !== true) {
            player.showConstruction();
        }

    };

    return self;

};