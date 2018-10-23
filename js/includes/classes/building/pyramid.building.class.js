Pyramid = function(height,width,img,prc,dmg,atkRate,atkLife,atkMove) {

    var self = Building(height,width,img,prc,dmg,atkRate,atkLife,atkMove);
    self.projectileImg = Img.pyramidAmmo;

    self.upgradeType.dmg = {name:'Damage',stat:'dmg',amt:0.25,cst:3,img:Img.arrowUp};

    self.loadAmmo = function() {
        //generate projectile
        self.ammo = Projectile(6,6,Img.pyramidAmmo,self.aimAngle,self.atkLifeSpan,self.atkMoveSpeed,self.dmg,Building.list[self.id],self.target);
    };

    self.executeAttack = function() {

        for (var i = 0; i < 360; i = i + 22.5) {
            self.aimAngle = i;
            self.loadAmmo();
            Projectile.list[self.ammo.id] = self.ammo;
            delete self.ammo;
        }
        self.atkTimer = 0;

    };

    return self;

};