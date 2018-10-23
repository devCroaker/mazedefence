//Phase Code
Phase = function(type,creepImg,number) {
    var self = {
        type: type,
        creepImg: creepImg,
        creepHp: 2+(number*2),
        creepSpd: 2+(number/5),
        creepNumber: 30,
        creepReward: 1+Math.floor(number/11),
        creepSize: Map.tileSize,
        timer: frameCount
    };

    self.countDown = function() {
        var frames = frameCount-self.timer;
        if (frames%FRAMES === 0) {
            self.seconds--;
        }

        ctx.fillStyle = 'black';
        ctx.font="16px Arial";
        var minutes = Math.floor(self.seconds/60);
        var str = "" + self.seconds%60;
        var pad = "00";
        var sec = pad.substring(0, pad.length - str.length) + str;
        ctx.fillText(minutes + ':' + sec, Map.tileSize*26.5,Map.tileSize);

        if (self.seconds === 0) {
            self.end();
        }
    };

    self.draw = function() {
        ctx.save();

        ctx.fillStyle = 'black';
        ctx.font="18px Arial";
        var phaseStr = 'Phase: '+ Phase.current;
        if (Phase.current !== 'building') {
            phaseStr += '  -  '+(self.creepNumber)+' '+Phase.creeps[Math.floor((Phase.atkNum-1)%11)]+'s';
        }

        ctx.fillText(phaseStr,Map.tileSize,Map.tileSize);

        ctx.restore();
    };

    self.start = function() {
        if (self.type !== 'building') {
            for (var i = 0; i < self.creepNumber; i++) {
                var x = (Math.floor(Math.random()*5))*Map.tileSize;
                var y = (Math.floor(Math.random()*29)+5)*Map.tileSize;
                //['dino','golem','skeleton','slime','ghost','zombie','eye','flame','snake','jellyfish','plant']
                if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'dino') {
                    self.creep = Dino(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'golem') {
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'skeleton') {
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'ghost') {
                    self.creep = Ghost(x, y, self.creepSize, self.creepSize, self.creepImg, Math.floor(self.creepHp/4),self.creepSpd*.75,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'zombie') {
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd*.8,self.creepReward);
                    Creep.list[self.creep.id] = self.creep;
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd*.8,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'eye') {
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'flame') {
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'snake') {
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'jellyfish') {
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'plant') {
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd,self.creepReward);

                } else if (Phase.creeps[Math.floor((Phase.atkNum-1)%11)] === 'slime') {
                    self.creep = Slime(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd*.75,self.creepReward);

                } else {
                    self.creep = Creep(x, y, self.creepSize, self.creepSize, self.creepImg, self.creepHp,self.creepSpd,self.creepReward);

                }

                Creep.list[self.creep.id] = self.creep;

                self.timer = frameCount;
                self.seconds = 0;
            }
        } else {
            if (Phase.atkNum === 1) {
                self.seconds = 30;
            } else {
                self.seconds = 10;
            }
        }
    };

    self.end = function() {
        if (self.type !== 'building') {
            Phase.list['building'].start();
            Phase.current = 'building';
            Phase.atkNum++;
        } else {
            if (Phase.atkNum >= Object.keys(Phase.list).length) {
                Phase.list[Phase.atkNum] = Phase('atk',Img[Phase.creeps[Math.floor((Phase.atkNum-1)%11)]],Phase.atkNum);
            }
            Phase.list[Phase.atkNum].start();
            Phase.current = Phase.atkNum;
        }
    };

    self.update = function() {
        //self.draw();
        if (self.type !== 'building') {
            if (Object.keys(Creep.list).length === 0) {
                self.end();
            }
            //self.creepKick();
        } else {
            self.countDown();
        }
    };

    return self;
    /*
     self.creepKick = function() {
     var frames = frameCount-self.timer;
     if (frames%FRAMES == 0) {
     self.seconds++;
     }
     if (self.seconds%5 == 0 && self.seconds !== 0) {
     for (var c in Creep.list) {
     if (Creep.list.hasOwnProperty(c)) {
     //if (Math.floor((Creep.list[c].id * 5) + 1) % self.seconds == 0) {
     Creep.list[c].pathInfo = Creep.list[c].setPath();
     //}
     }
     }
     }
     };
     */

};

Phase.list = {};

Phase.update = function() {
    Phase.list[Phase.current].update();
};

Phase.generate = function () {
    Phase.list = {
        building: Phase('building')
    };
    //for (var i = 1; i < 2;i++) {
    //    Phase.list[i] = Phase('atk',Img[Phase.creeps[i-1]],4*i,4+(i/10),4+i);
    //}
    Phase.current = 'building';
    Phase.creeps = ['dino','golem','skeleton','slime','ghost','zombie','eye','flame','snake','jellyfish','plant'];
    Phase.atkNum = 1;
};