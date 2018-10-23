//pointer base class for most everything
generatePointer = function(x,y) {

    var self = {
        x: x,
        y: y
    };

    self.returnTile = function() {

        var x = self.x;
        var y = self.y;
        var onMap = true;

        x = Math.floor(x/Map.tileSize);
        y = Math.floor(y/Map.tileSize);

        if (x < 0) {
            x = 0;
            onMap = false;
        }
        if (x > (Map.width/Map.tileSize)-1) {
            x = Map.width / Map.tileSize - 1;
            onMap = false;
        }
        if (y < 0) {
            y = 0;
            onMap = false;
        }
        if (y > (Map.height/Map.tileSize)-1) {
            y = Map.height / Map.tileSize - 1;
            onMap = false;
        }

        return {
            arrX: x,
            arrY: y,
            x:x*Map.tileSize,
            y:y*Map.tileSize,
            height:Map.tileSize,
            width:Map.tileSize,
            onMap: onMap
        };

    };

    self.returnTileValue = function() {

        var tile = self.returnTile();
        return Map.arrayMap[tile.arrY][tile.arrX];

    };

    self.testCollisionEntity = function (entity,entity2) { //return if colliding (true/false)
        var rect1 = {
            x:entity.x - entity.width/2,
            y:entity.y - entity.height/2,
            width:entity.width,
            height:entity.height
        };
        var rect2 = {
            x:entity2.x - entity2.width/2,
            y:entity2.y - entity2.height/2,
            width:entity2.width,
            height:entity2.height
        };
        return self.testCollisionRectRect(rect1,rect2);

    };

    self.testCollisionRectRect = function(rect1,rect2){
        return rect1.x <= rect2.x + rect2.width
            && rect2.x <= rect1.x + rect1.width
            && rect1.y <= rect2.y + rect2.height
            && rect2.y <= rect1.y + rect1.height;
    };

    return self;

};