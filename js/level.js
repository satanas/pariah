// Based on http://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268
// Arguments: level number, width, height, number of enemies, item to be placed, leaf size
$.Level = function(n, w, h, en, it, ls) {
  this.n = n;
  // Randomize w and h if they are undefined
  this.w = w;
  this.h = h;
  this.maxLeafSize = ls || 15;
  this.leafs = [];
  var root = new $.Leaf(0, 0, w, h);
  this.map = [];

  this.leafs.push(root);

  this.isWall = function(x, y) {
    return (this.map[x][y] === '#') ? true : false;
  };

  // Return a random point inside a room
  this.rPoint = function(r, p) {
    var pad = p || 0; // Padding
    return {
      x: $.util.randInt(r.l + pad, r.r - pad),
      y: $.util.randInt(r.t + pad, r.b - pad)
    };
  };

  // Checks if the point (x,y) is a corner of the room r
  this.isCorner = function(x, y, r) {
    return ((x === r.t && y === r.l) ||
            (x === r.t && y === r.r) ||
            (x === r.b && y === r.l) ||
            (x === r.b && y === r.r));
  };

  // Let's create all the leafs using a recursive method
  //this.makeLeafs = function(l) {
  function makeLeafs(l) {
    if (l.lc === null && l.rc === null) {
      // Split if the leaf is too big or 75% chance
      if (l.w > this.maxLeafSize || l.height > this.maxLeafSize || $.util.randInt(0, 101) > 25) {
        if (l.split()) {
          this.leafs.push(l.lc);
          this.leafs.push(l.rc);
          makeLeafs.call(this, l.lc);
          makeLeafs.call(this, l.rc);
        }
      }
    }
  }

  makeLeafs.call(this, root);
  root.makeRooms();

  // Make map
  for (var i=0; i<w; i++) {
    this.map[i] = [];
    for (var j=0; j<h; j++){
      this.map[i][j] = '#';
    }
  }

  var self = this;
  var ar = []; // Available rooms
  this.leafs.forEach(function(l) {
    var r = l.room;
    if (r !== null) {
      ar.push(r);
      for (var i=r.l; i<=r.r; i++) {
        for (var j=r.t; j<=r.b; j++) {
          self.map[i][j] = '.';
        }
      }
    }

    l.halls.forEach(function(h) {
      for (var i=h.l; i<=h.r; i++) {
        for (var j=h.t; j<=h.b; j++) {
          self.map[i][j] = '.';
        }
      }
    });
  });

  // Last room
  var lr = ar.pop();

  // Place enemies
  // We chose a random point in a random room and we try to put the 
  // enemy. If there is an enemy in that position another point will
  // be selected inside the same room. If after 5 tries the algorithm
  // can't find a spot for the enemy, another room is selected.
  var ec = en;
  var p = null;
  var epr = (en / ar.length);
  var t = 0;
  while (ec > 0) {
    var rr = ar[$.util.randInt(0, ar.length)];
    p = this.rPoint(rr);
    while (this.map[p.x][p.y] === 'e') {
      t++;
      if (t > 4) {
        rr = ar[$.util.randInt(0, ar.length)];
        t = 0;
      }
      p = this.rPoint(rr);
    }
    $.enemies.push(new $.Zombie(p.x * 32, p.y * 32));
    ec--;
    this.map[p.x][p.y] = 'e';
  }

  // Place hero and entrance
  p = this.rPoint(lr);
  var b = null;
  while (true) {
    b = {x: p.x, y: p.y};
    var rw = $.util.randInt(0, 4);
    if (rw === 0) { // North wall
      p.y = lr.t - 1;
      b.y = p.y + 2;
    } else if (rw === 1) { // East wall
      p.x = lr.r + 1;
      b.x = p.x - 2;
    } else if (rw === 2) { // South wall
      p.y = lr.b + 1;
      b.y = p.y - 2;
    } else if (rw === 3) { // West wall
      p.x = lr.l - 1;
      b.x = p.x + 2;
    }
    if (!this.isWall(p.x, p.y) || this.isCorner(p.x, p.y, lr)) {
      p = this.rPoint(lr);
    } else {
      break;
    }
  }
  $.hero = new $.Hero(b.x * 32, b.y * 32);
  $.walls.push(new $.Entrance(p.x * 32, p.y * 32));
  this.map[p.x][p.y] = '*';
  this.map[b.x][b.y] = 'h';

  // Place exit
  // We select a random room and place the exit in one of its walls
  var xr = ar[$.util.randInt(0, ar.length)];
  p = this.rPoint(xr);
  while (true) {
    var xw = $.util.randInt(0, 4);
    if (xw === 0) { // North wall
      p.y = xr.t - 1;
    } else if (xw === 1) { // East wall
      p.x = xr.r + 1;
    } else if (xw === 2) { // South wall
      p.y = xr.b + 1;
    } else if (xw === 3) { // West wall
      p.x = xr.l - 1;
    }
    if (!this.isWall(p.x, p.y) || this.isCorner(p.x, p.y, xr)) {
      p = this.rPoint(xr);
    } else {
      break;
    }
  }
  $.exit[0] = new $.Exit(p.x * 32, p.y * 32);
  this.map[p.x][p.y] = '@';

  // Place items
  for (i=it.length; i--;) {
    var ir = ar[$.util.randInt(0, ar.length)];
    p = this.rPoint(ir);
    $.items.push(new it[i](p.x * 32 + 8, p.y * 32 + 8));
    this.map[p.x][p.y] = 'i';
  }


  // Showing off
  for (var v=0; v<this.h; v++) {
    var row = [];
    for (var u=0; u<this.w; u++) {
      row.push(self.map[u][v]);
    }
    console.log(v, row.join(''));
  }

};

$.Leaf = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.lc = null; // left child
  this.rc = null; // right child
  this.min = 6; // Min leaf size
  this.room = null;
  this.halls = [];

  this.split = function() {
    // Abort if the leaf is already splitted
    if (this.lc !== null || this.rc !== null)
      return false;

    // Determine direction of split
    // If the width is >25% larger than the height, we split vertically
    // If the height is >25% larger than the width, we split horizontally
    // Else we split randomly
    var splith = !!$.util.randInt(0, 2);
    if (this.w > this.h && this.w / this.h >= 0.25)
      splith = false;
    else if (this.h > this.w && this.h / this.w >= 0.25)
      splith = true;

    var max = (splith ? this.h : this.w) - this.min;
    // Abort if the area is too small to split
    if (max <= this.min)
      return false;

    var split = $.util.randInt(this.min, max);

    // Create the left and right children
    if (splith) {
      this.lc = new $.Leaf(this.x, this.y, this.w, split);
      this.rc = new $.Leaf(this.x, this.y + split, this.w, this.h - split);
    } else {
      this.lc = new $.Leaf(this.x, this.y, split, this.h);
      this.rc = new $.Leaf(this.x + split, this.y, this.w - split, this.h);
    }

    return true;
  };

  this.makeRooms = function() {
    if (this.lc !== null || this.rc !== null) {
      if (this.lc !== null)
        this.lc.makeRooms();
      if (this.rc !== null)
        this.rc.makeRooms();
      if (this.lc !== null && this.rc !== null)
        this.makeHall(this.lc.getRoom(), this.rc.getRoom());
    } else {
      var size = {
        w: $.util.randInt(3, this.w - 2),
        h: $.util.randInt(3, this.h - 2)
      };
      var pos = {
        x: $.util.randInt(1, this.w - size.w - 1),
        y: $.util.randInt(1, this.h - size.h - 1),
      };
      this.room = new $.Rect(this.x + pos.x, this.y + pos.y, size.w, size.h);
    }
  };

  this.getRoom = function() {
    if (this.room !== null) {
      return this.room;
    } else {
      var lRoom = null;
      var rRoom = null;

      if (this.lc !== null)
        lRoom = this.lc.getRoom();
      if (this.rc !== null)
        rRoom = this.lc.getRoom();

      if (lRoom === null && rRoom === null) {
        return null;
      } else if (rRoom === null) {
        return lRoom;
      } else if (lRoom === null) {
        return rRoom;
      } else if ($.util.randInt(1, 11) > 5) {
        return lRoom;
      } else {
        return rRoom;
      }
    }
  };

  // This method connects the two rooms together (l and r) with hallways
  this.makeHall = function(lRoom, rRoom) {
    var p1 = {
      x: $.util.randInt(lRoom.l + 1, lRoom.r - 2),
      y: $.util.randInt(lRoom.t + 1, lRoom.b -2)
    };
    var p2 = {
      x: $.util.randInt(rRoom.l + 1, rRoom.r - 2),
      y: $.util.randInt(rRoom.t + 1, rRoom.b -2)
    };

    var width = p2.x - p1.x;
    var height = p2.y - p1.y;

    if (width < 0) {
      if (height < 0) {
        if ($.util.randInt(0, 10) > 4) {
          this.halls.push(new $.Rect(p2.x, p1.y, Math.abs(width), 1));
          this.halls.push(new $.Rect(p2.x, p2.y, 1, Math.abs(height)));
        } else {
          this.halls.push(new $.Rect(p2.x, p2.y, Math.abs(width), 1));
          this.halls.push(new $.Rect(p1.x, p2.y, 1, Math.abs(height)));
        }
      } else if (height > 0) {
        if ($.util.randInt(0, 10) > 4) {
          this.halls.push(new $.Rect(p2.x, p1.y, Math.abs(width), 1));
          this.halls.push(new $.Rect(p2.x, p1.y, 1, Math.abs(height)));
        } else {
          this.halls.push(new $.Rect(p2.x, p2.y, Math.abs(width), 1));
          this.halls.push(new $.Rect(p1.x, p1.y, 1, Math.abs(height)));
        }
      // if (height === 0)
      } else {
        this.halls.push(new $.Rect(p2.x, p2.y, Math.abs(width), 1));
      }
    } else if (width > 0){
      if (height < 0) {
        if ($.util.randInt(0, 10) > 4) {
          this.halls.push(new $.Rect(p1.x, p2.y, Math.abs(width), 1));
          this.halls.push(new $.Rect(p1.x, p2.y, 1, Math.abs(height)));
        } else {
          this.halls.push(new $.Rect(p1.x, p1.y, Math.abs(width), 1));
          this.halls.push(new $.Rect(p2.x, p2.y, 1, Math.abs(height)));
        }
      } else if (height > 0) {
        if ($.util.randInt(0, 10) > 4) {
          this.halls.push(new $.Rect(p1.x, p1.y, Math.abs(width), 1));
          this.halls.push(new $.Rect(p2.x, p1.y, 1, Math.abs(height)));
        } else {
          this.halls.push(new $.Rect(p1.x, p2.y, Math.abs(width), 1));
          this.halls.push(new $.Rect(p1.x, p1.y, 1, Math.abs(height)));
        }
      // if (height === 0)
      } else {
        this.halls.push(new $.Rect(p1.x, p1.y, Math.abs(width), 1));
      }
    // if (width === 0)
    } else {
      if (height < 0) {
        this.halls.push(new $.Rect(p2.x, p2.y, 1, Math.abs(height)));
      } else {
        this.halls.push(new $.Rect(p1.x, p1.y, 1, Math.abs(height)));
      }
    }
  };
};
