$.Wall = function(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.w = 32;
  this.h = 32;
  this.r = Math.sqrt(Math.pow(this.w/2, 2) + Math.pow(this.h/2, 2));
  var inView = 0;

  this.bounds = {
    b: this.y + this.h,
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.render = function(tx, ty) {
    //var tx = x - $.ofx;
    //var ty = y - $.ofy;

    //if ((tx >= -w && tx < $.vw) && (ty >= -y && ty < $.vh)) {
      $.ctxfg.save();
      $.ctxfg.fillStyle = 'rgb(131, 73, 11)';
      $.ctxfg.fillRect(tx, ty, 32, 32);
      $.ctxfg.restore();
    //}
  };
};
