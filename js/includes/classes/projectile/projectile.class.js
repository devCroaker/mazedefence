//Projectile Code
Projectile = function(width,height,img,aimAngle,lifeSpan,spd,dmg,origin,target) {

    var self = generateEntity(origin.x,origin.y,height,width,img);

    self.origin = origin;
    self.target = target;
    self.aimAngle = aimAngle;
    self.lifeSpan = lifeSpan; //frames
    self.spdX = Math.cos(self.aimAngle/180*Math.PI)*spd;
    self.spdY = Math.sin(self.aimAngle/180*Math.PI)*spd;
    self.dmg = dmg;
    self.timer = 0;
    self.toRemove = false;

    self.checkHit = function() {
        for (var c in Creep.list) {
            if (Creep.list.hasOwnProperty(c)) {
                if (self.testCollisionEntity(self, Creep.list[c])) {
                    self.toRemove = true;
                    Creep.list[c].takeDamage(self.dmg);
                    break;
                }
            }
        }
    };

    self.updatePosition = function() {
        self.x += self.spdX;
        self.y += self.spdY;

        if(self.x < 0 || self.x > Map.width){
            self.toRemove = true;
        }
        if(self.y < 0 || self.y > Map.height){
            self.toRemove = true;
        }
    };

    self.update = function() {
        self.updatePosition();
        self.draw();

        self.timer++;
        if(self.timer >= self.lifeSpan) {
            self.toRemove = true;
        }

        self.checkHit();

    };

    return self;

};

Projectile.list = {};

Projectile.update = function() {
    for(var key in Projectile.list){
        if (Projectile.list.hasOwnProperty(key)) {
            if (player.paused) {
                Projectile.list[key].draw();
                continue;
            }
            Projectile.list[key].update();
            if (Projectile.list[key].toRemove) {
                delete Projectile.list[key];
            }
        }
    }
};