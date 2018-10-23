// Map Code
Map = function(img,height,width,tileSize,arrayMap) {

    var self = {

        x: 0,
        y: 0,
        img: img,
        height: height,
        width: width,
        tileSize: tileSize,
        arrayMap: arrayMap

    };

    self.reset = function() {
        for (var h = 0; h < self.arrayMap.length; h++) {
            for (var w = 0; w < self.arrayMap[h].length; w++) {
                if (self.arrayMap[h][w] > 0 && self.arrayMap[h][w] < 1) {
                    self.arrayMap[h][w] = 0;
                }
            }
        }
    };

    self.draw = function() {

        ctx.drawImage(self.img,self.x,self.y,self.img.width,self.img.height,self.x,self.y,self.width,self.height);

    };

    return self;

};