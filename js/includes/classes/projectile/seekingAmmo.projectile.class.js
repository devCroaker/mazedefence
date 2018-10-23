seekingAmmo = function(width,height,img,aimAngle,range,spd,dmg,origin,target) {

    var self =  Projectile(width,height,img,aimAngle,range,spd,dmg,origin,target);

    self.seekTarget = function() {
        var diffX = self.target.x - self.x;
        var diffY = self.target.y - self.y;
        self.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180;
        self.spdX = Math.cos(self.aimAngle / 180 * Math.PI) * spd;
        self.spdY = Math.sin(self.aimAngle / 180 * Math.PI) * spd;
    };

    var super_update = self.update;
    self.update = function() {
        if (self.target.hp > 0) {
            self.seekTarget();
        }
        super_update();
    };

    return self;

};