Wall = function(height,width,img,prc,dmg,atkRate,atkLife,atkMove) {

    var self = Building(height,width,img,prc,dmg,atkRate,atkLife,atkMove);
    self.atkRate = 1000000000000000000;
    self.dmg = 0;

    self.executeAttack = function () {

    };

    self.findTarget = function() {
        self.target = {};
    };

    return self;

};