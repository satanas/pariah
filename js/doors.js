$.Entrance = function(x, y, hf) {
  this.x = x;
  this.y = y;
  this.w = 32;
  this.h = 32;
  this.half = hf;
  this.t = $.util.byId('tileset');
  this.r = Math.sqrt(Math.pow(this.w/2, 2) + Math.pow(this.h/2, 2));
  var inView = 0;

  this.bounds = {
    b: (this.half === 0) ? this.y + this.h : this.y + (this.h / 2),
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.render = function(tx, ty) {
    //var tx = x - $.ofx;
    //var ty = y - $.ofy;

    //if ((tx >= -w && tx < $.vw) && (ty >= -y && ty < $.vh)) {
      $.ctxfg.save();
      $.ctxfg.fillStyle = 'rgb(131, 0, 0)';
      $.ctxfg.fillRect(tx, ty, 32, 32);
      $.ctxfg.restore();
    //}
  };
};

$.Exit = function(x, y, hf) {
  this.x = x;
  this.y = y;
  this.w = 32;
  this.h = 32;
  this.t = $.util.byId('tileset');
  var inView = 0;

  this.bounds = {
    b: this.y + (this.h / 4),
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.render = function(tx, ty) {
    //var tx = x - $.ofx;
    //var ty = y - $.ofy;

    //if ((tx >= -w && tx < $.vw) && (ty >= -y && ty < $.vh)) {
      $.ctxfg.save();
      $.ctxfg.fillStyle = 'rgb(0, 131, 0)';
      $.ctxfg.fillRect(tx, ty, 32, 32);
      $.ctxfg.restore();
    //}
  };
};
