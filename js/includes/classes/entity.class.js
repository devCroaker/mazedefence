//basic entity
generateEntity = function(x,y,width,height,img) {
    var self = generatePointer(x,y);
    self.id = Math.random();
    self.width = width;
    self.height = height;
    self.img = img;

    self.draw = function() {
        ctx.save();
        var x = self.x - self.width/2;
        var y = self.y - self.height/2;

        ctx.drawImage(self.img,
            0,0,self.img.width,self.img.height,
            x,y,self.width,self.height
        );

        ctx.restore();
    };

    self.update = function() {
        self.draw();
    };

    return self;
};