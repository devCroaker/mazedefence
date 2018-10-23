Coin = function(x,y,width,height,img) {
    var self = generateEntity(x,y,width,height,img);
    self.spriteAnimCounter = 0;
    self.toRemove = false;

    self.draw = function() {
        ctx.save();
        var x = self.x - self.width/2;
        var y = self.y - self.height/2;

        var frameWidth = self.img.width/8;
        var animMod = Math.floor(self.spriteAnimCounter)%8;

        ctx.drawImage(self.img,
            animMod*frameWidth,0,frameWidth,self.img.height,
            x,y,self.width,self.height
        );

        ctx.restore();
    };

    var super_update = self.update;
    self.update = function () {
        self.spriteAnimCounter += 0.25;
        super_update();
        if (self.spriteAnimCounter > (1000/INTERVAL)) {
            self.toRemove = true;
        }

    };

    Coin.list[self.id] = self;
};

Coin.list = {};

Coin.update = function() {
    for (var key in Coin.list) {
        if (Coin.list.hasOwnProperty(key)) {
            if (player.paused) {
                Coin.list[key].draw();
                continue;
            }
            Coin.list[key].update();
            if (Coin.list[key].toRemove) {
                delete Coin.list[key];
            }
        }
    }
};