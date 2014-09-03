$.FoW = function(r) {
  this.radius = r;

  this.update = function() {
    var x = $.hero.x;
    var y = $.hero.y;
    var xx = (x % 32 <= 16) ? Math.floor(x / 32) : Math.floor(x / 32) + 1;
    var yy = (y % 32 <= 16) ? Math.floor(y / 32) : Math.floor(y / 32) + 1;
    var blocked = [];
    var fow = [];
    fow[0] = [xx, yy, 0];

    // Sweep up
    for (i= $.ww / 32; i--;)
      blocked[i] = false;
    var start = (xx - 1 < 0) ? 0 : xx - 1;
    var end = (xx + 1 > $.ww / 32) ? $.ww / 32 : xx + 1;
    for (j=yy-1; j >= yy-this.radius; j--) {
      for (i=start; i <= end; i++) {
        if (!blocked[i]) {
          if ($.tiles[i][j] === 1) {
            blocked[i] = true;
          }
          fow.push([i, j, 0]);
        }
      }
    }

    // Sweep right
    for (i = $.wh / 32; i--;)
      blocked[i] = false;
    start = (yy - 1 < 0) ? 0 : yy - 1;
    end = (yy + 1 > $.wh / 32) ? $.wh / 32 : yy + 1;
    for (j=start; j <= end; j++) {
      for (i=xx + 1; i <= xx + this.radius; i++) {
        if (!blocked[j]) {
          if ($.tiles[i][j] === 1) {
            blocked[j] = true;
          }
          fow.push([i, j, 0]);
        }
      }
    }

    // Sweep down
    for (i= $.ww / 32; i--;)
      blocked[i] = false;
    start = (xx - 1 < 0) ? 0 : xx - 1;
    end = (xx + 1 > $.ww / 32) ? $.ww / 32 : xx + 1;
    for (j=yy + 1; j <= yy + this.radius; j++) {
      for (i=start; i <= end; i++) {
        if (!blocked[i]) {
          if ($.tiles[i][j] === 1) {
            blocked[i] = true;
          }
          fow.push([i, j, 0]);
        }
      }
    }

    // Sweep left
    for (i = $.wh / 32; i--;)
      blocked[i] = false;
    start = (yy - 1 < 0) ? 0 : yy - 1;
    end = (yy + 1 > $.wh / 32) ? $.wh / 32 : yy + 1;
    for (j=start; j <= end; j++) {
      for (i=xx - 1; i >= xx - this.radius; i--) {
        if (!blocked[j]) {
          if ($.tiles[i][j] === 1) {
            blocked[j] = true;
          }
          fow.push([i, j, 0]);
        }
      }
    }

    return fow;

  };
};
