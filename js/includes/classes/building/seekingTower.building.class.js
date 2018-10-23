SeekingTower = function(height,width,img,prc,dmg,atkRate,atkLife,atkMove) {

    var self = Building(height,width,img,prc,dmg,atkRate,atkLife,atkMove);
    self.projectileImg = Img.seekingAmmo;

    var super_loadAmmo = self.loadAmmo;
    self.loadAmmo = function() {
        //generate projectile
        super_loadAmmo();
        self.ammo = seekingAmmo(8,8,self.projectileImg,self.aimAngle,self.atkLifeSpan,self.atkMoveSpeed,self.dmg,Building.list[self.id],self.target);
    };

    return self;

};