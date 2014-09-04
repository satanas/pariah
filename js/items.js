$.Item = function(x, y, t) {
  this.x = x;
  this.y = y;
  this.w = 16;
  this.h = 16;
  this.t = t;
  this.bounds = {
    b: this.y + this.h,
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.update = function(i) {
    if ($.collide.rect(this, $.hero)) {
      //$.hero.gainPower(this);
      this.die(i);
    }
  };

  this.die = function(i) {
    $.items.splice(i, 1);
  };
};

$.FireItem = function(x, y) {
  $.Item.call(this, x, y, $.PW.F);

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(28, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};

$.WaterItem = function(x, y) {
  $.Item.call(this, x, y, $.PW.W);

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(196, 90%, 76%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};

$.EarthItem = function(x, y) {
  $.Item.call(this, x, y, $.PW.E);

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(28, 65%, 42%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};

$.AirItem = function(x, y) {
  $.Item.call(this, x, y, $.PW.A);

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(78, 100%, 92%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};
