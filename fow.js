$.FoW = function(r) {
  this.r = r;

  //this.check = function(i, j, b) {
  //  var f = [];
  //  if (!b[i]) {
  //    if ($.tiles[i][j] === 1) {
  //      b[i] = true;
  //    }
  //    f.push([i, j, 0]);
  //  }
  //  return f;
  //};

  this.update = function() {
    var x = $.hero.x;
    var y = $.hero.y;
    var xx = (x % 32 <= 16) ? Math.floor(x / 32) : Math.floor(x / 32) + 1;
    var yy = (y % 32 <= 16) ? Math.floor(y / 32) : Math.floor(y / 32) + 1;
    // Blocked tiles
    var b = [];
    var fow = [];
    fow[0] = [xx, yy, 0];

    // Sweep up
    for (i= $.ww / 32; i--;)
      b[i] = false;
    // Start (s) and end (e)
    var s = (xx - 1 < 0) ? 0 : xx - 1;
    var e = (xx + 1 > $.ww / 32) ? $.ww / 32 : xx + 1;
    for (j=yy-1; j >= yy-this.r; j--) {
      for (i=s; i <= e; i++) {
        if (!b[i]) {
          if ($.tiles[i][j] === 1) {
            b[i] = true;
          }
          fow.push([i, j, 0]);
        }
      }
    }

    // Sweep right
    for (i = $.wh / 32; i--;)
      b[i] = false;
    s = (yy - 1 < 0) ? 0 : yy - 1;
    e = (yy + 1 > $.wh / 32) ? $.wh / 32 : yy + 1;
    for (j=s; j <= e; j++) {
      for (i=xx + 1; i <= xx + this.r; i++) {
        if (!b[j]) {
          if ($.tiles[i][j] === 1) {
            b[j] = true;
          }
          fow.push([i, j, 0]);
        }
      }
    }

    // Sweep down
    for (i= $.ww / 32; i--;)
      b[i] = false;
    s = (xx - 1 < 0) ? 0 : xx - 1;
    e = (xx + 1 > $.ww / 32) ? $.ww / 32 : xx + 1;
    for (j=yy + 1; j <= yy + this.r; j++) {
      for (i=s; i <= e; i++) {
        if (!b[i]) {
          if ($.tiles[i][j] === 1) {
            b[i] = true;
          }
          fow.push([i, j, 0]);
        }
      }
    }

    // Sweep left
    for (i = $.wh / 32; i--;)
      b[i] = false;
    s = (yy - 1 < 0) ? 0 : yy - 1;
    e = (yy + 1 > $.wh / 32) ? $.wh / 32 : yy + 1;
    for (j=s; j <= e; j++) {
      for (i=xx - 1; i >= xx - this.r; i--) {
        if (!b[j]) {
          if ($.tiles[i][j] === 1) {
            b[j] = true;
          }
          fow.push([i, j, 0]);
        }
      }
    }

    return fow;

  };
};
