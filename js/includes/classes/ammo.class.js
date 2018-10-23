generateAmmo = function(width,height,img,diffY,diffX,range,spd,dmg) {

    var self = generateEntity(0,0,width,height,img);
    self.aimAngle = Math.atan2(diffY, diffX) / Math.PI * 180;
    self.range = range; //frames, 1 second
    self.spdX = Math.cos(self.aimAngle/180*Math.PI)*spd;
    self.spdY = Math.sin(self.aimAngle/180*Math.PI)*spd;
    self.dmg = dmg;

    return self;

};