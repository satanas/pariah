$.FoW = function(r) {
  var _ = this;
  _.radius = r;
  _.shadowOffset = Math.ceil(r / 2) + 1;
  _.fow =[];
  _.mult = [
    [1,  0,  0, -1, -1,  0,  0,  1],
    [0,  1, -1,  0,  0, -1,  1,  0],
    [0,  1,  1,  0,  0, -1, -1,  0],
    [1,  0,  0,  1, -1,  0,  0, -1]
  ];

  _.cast = function(cx, cy, row, start, end, xx, xy, yx, yy) {
    var radius2 = _.radius * _.radius;
    var newStart = 0;

    if (start < end) return;

    for (var i = row; i <= _.radius; i++) {
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
              _.fow[x][y] = i;

            if (blocked) {
              if ($.lvl.isWall(x, y)) {
                newStart = rSlope;
                continue;
              } else {
                blocked = false;
                start = newStart;
              }
            } else {
              if ($.lvl.isWall(x, y) && i < _.radius) {
                blocked = true;
                _.cast(cx, cy, i + 1, start, lSlope, xx, xy, yx, yy);
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

  _.update = function() {
    var x = $.hero.x;
    var y = $.hero.y;
    var xx = (x % 32 <= 16) ? Math.floor(x / 32) : Math.floor(x / 32) + 1;
    var yy = (y % 32 <= 16) ? Math.floor(y / 32) : Math.floor(y / 32) + 1;
    var i, j = 0;
    for (i = 0; i <= $.ww / 32; i++) {
      _.fow[i] = [];
      for (j = 0; j <= $.wh / 32; j++) {
        _.fow[i].push(0);
      }
    }
    _.fow[xx][yy] = 1;
    for (i=8; i--;) {
      _.cast(xx, yy, 1, 1.0, 0.0, _.mult[0][i], _.mult[1][i], _.mult[2][i], _.mult[3][i]);
    }
  };

  _.render = function() {
    $.ctx1.clearRect(0, 0, $.vw, $.vh);
    $.ctx1.fillStyle = "rgba(0,0,0,1)";
    $.ctx1.fillRect(0, 0, $.vw, $.vh);
    $.ctx2.clearRect(0, 0, $.vw, $.vh);

    for (var i = 0; i < $.ww / 32; i++) {
      for (var j = 0; j < $.wh / 32; j++) {
        var f = _.fow[i][j];
        if (f >= 1) {
          var a = '1.0';
          var o = f - _.shadowOffset;
          var max = _.radius + _.shadowOffset;
          if (o >= 0)
            a = 1 - (o/max).toString().substr(0,3);

          $.ctx2.fillStyle = "rgba(255,255,255," + a +")";
          $.ctx2.fillRect((i*32) - $.cam.ofx, (j * 32) - $.cam.ofy, 33, 33);
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
