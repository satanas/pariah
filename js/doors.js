$.Entrance = function(x, y) {
  this.x = x;
  this.y = y;
  this.w = 32;
  this.h = 32;
  this.t = $.util.byId('tileset');

  this.bounds = {
    b: this.y + (this.h / 2),
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.scale(2.0, 2.0);
    $.ctxfg.drawImage(this.t, 0, 0, 16, 16, tx/2, ty/2, 16, 16);
    $.ctxfg.drawImage(this.t, 0, 49, 16, 16, tx/2, ty/2 + 1, 16, 16);
    $.ctxfg.restore();
  };
};

$.Exit = function(x, y) {
  this.x = x;
  this.y = y;
  this.w = 32;
  this.h = 32;
  this.t = $.util.byId('tileset');

  this.bounds = {
    b: this.y + (this.h / 4),
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.scale(2.0, 2.0);
    $.ctxfg.drawImage(this.t, 0, 0, 16, 16, tx/2, ty/2, 16, 16);
    $.ctxfg.drawImage(this.t, 16, 49, 16, 16, tx/2, ty/2 + 1, 16, 16);
    $.ctxfg.restore();
  };
};
