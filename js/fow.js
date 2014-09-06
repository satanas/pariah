$.FoW = function(r) {
  this.radius = r;
  this.shadowOffset = Math.ceil(r / 2) + 1;
  this.fow =[];
  this.mult = [
    [1,  0,  0, -1, -1,  0,  0,  1],
    [0,  1, -1,  0,  0, -1,  1,  0],
    [0,  1,  1,  0,  0, -1, -1,  0],
    [1,  0,  0,  1, -1,  0,  0, -1]
  ];

  this.cast = function(cx, cy, row, start, end, xx, xy, yx, yy) {
    var radius2 = this.radius * this.radius;
    var newStart = 0;

    if (start < end) return;

    for (var i = row; i <= this.radius; i++) {
      var dx = -i - 1;
      var dy = -i;
      var blocked = false;

      while (dx <= 0) {
        dx += 1;

        var x = cx + dx * xx + dy * xy;
        var y = cy + dx * yx + dy * yy;

        if (x < $.ww / 32 && x >= 0 && y < $.wh / 32 && y >=0) {
          var lSlope = (dx - 0.5) / (dy + 0.5);
          var rSlope = (dx + 0.5) / (dy - 0.5);

          if (start < rSlope) {
            continue;
          } else if (end > lSlope) {
            break;
          //} else if (rSlope < start) {
          } else {
            if (dx*dx + dy*dy < radius2)
              this.fow[x][y] = i;

            if (blocked) {
              if ($.lvl.isWall(x, y)) {
                newStart = rSlope;
                continue;
              } else {
                blocked = false;
                start = newStart;
              }
            } else {
              if ($.lvl.isWall(x, y) && i < this.radius) {
                blocked = true;
                this.cast(cx, cy, i + 1, start, lSlope, xx, xy, yx, yy);
                newStart = rSlope;
              }
            }
          }
        }
      }

      if (blocked)
        break;
    }
  };

  this.update = function() {
    var x = $.hero.x;
    var y = $.hero.y;
    var xx = (x % 32 <= 16) ? Math.floor(x / 32) : Math.floor(x / 32) + 1;
    var yy = (y % 32 <= 16) ? Math.floor(y / 32) : Math.floor(y / 32) + 1;
    var i, j = 0;
    for (i = 0; i <= $.ww / 32; i++) {
      this.fow[i] = [];
      for (j = 0; j <= $.wh / 32; j++) {
        this.fow[i].push(0);
      }
    }
    this.fow[xx][yy] = 1;
    for (i=8; i--;) {
      this.cast(xx, yy, 1, 1.0, 0.0, this.mult[0][i], this.mult[1][i], this.mult[2][i], this.mult[3][i]);
    }
  };

  this.render = function() {
    $.ctx1.clearRect(0, 0, $.vw, $.vh);
    $.ctx1.fillStyle = "rgba(0,0,0,1)";
    $.ctx1.fillRect(0, 0, $.vw, $.vh);
    $.ctx2.clearRect(0, 0, $.vw, $.vh);

    for (var i = 0; i < $.ww / 32; i++) {
      for (var j = 0; j < $.wh / 32; j++) {
        var f = this.fow[i][j];
        if (f >= 1) {
          var a = '1.0';
          var o = f - this.shadowOffset;
          var max = this.radius + this.shadowOffset;
          if (o >= 0)
            a = 1 - (o/max).toString().substr(0,3);

          $.ctx2.fillStyle = "rgba(255,255,255," + a +")";
          $.ctx2.fillRect((i*32) - $.ofx, (j * 32) - $.ofy, 33, 33);
        }
      }
    }

    $.ctx1.save();
    $.ctx1.globalCompositeOperation = 'destination-out';
    $.ctx1.drawImage($.cv2, 0, 0, $.vw, $.vh);
    $.ctx1.restore();
    $.ctxfg.drawImage($.cv1,0, 0, $.vw, $.vh);
  };
};
