$.Wall = function(x, y, hf) {
  this.x = x;
  this.y = y;
  this.w = 32;
  this.h = 32;
  this.half = hf;
  this.ts = $.util.ts();

  this.bounds = {
    b: (this.half === 0) ? this.y + this.h : this.y + (this.h / 2),
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.scale(2.0, 2.0);
    $.ctxfg.drawImage(this.t, 0, 0, 16, 16, tx/2, ty/2, 16, 16);
    $.ctxfg.restore();
  };
};
