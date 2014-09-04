$.Map = function() {
	this.tiles = [[]];

	this.transformLevel = function(walls) {
		var self = this;
		for(var i = 0; i < $.ww / 32; i++) {
      		this.tiles[i] = [];
      		for(var j = 0; j < $.wh / 32; j++) {
        		this.tiles[i][j] = 0;
      		}
    	}
    	walls.forEach(function(w) {
      		if(w.x / 32 < $.ww / 32 && w.y / 32 < $.wh / 32) {
       			self.tiles[w.x / 32][w.y / 32] = 1;
      		}
    	});
	};

	this.walkableTile = function(x, y) {
		return ((this.tiles[x] != null) && (this.tiles[x][y] != null) && (this.tiles[x][y] <= 0));
	};
};