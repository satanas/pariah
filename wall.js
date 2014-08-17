$.Wall = function(_x, _y) {
  var x = _x;
  var y = _y;
  var w = 32;
  var h = 32;
  var inView = 0;

  return {
    update: function() {},
    render: function() {
      var tx = x - $.ofx;
      var ty = y - $.ofy;

      if ((tx >= -w && tx < $.vw) && (ty >= -y && ty < $.vh)) {
        $.ctxfg.save();
        $.ctxfg.fillStyle = 'rgb(131, 73, 11)';
        $.ctxfg.fillRect(tx, ty, 32, 32);
        $.ctxfg.restore();
      }
    }
  };
};
