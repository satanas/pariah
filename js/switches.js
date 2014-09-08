$.Switch= function(x, y, t) {
  this.x = x;
  this.y = y;
  this.w = 32;
  this.h = 32;
  this.t = t; // Type
  this.filled = false;
  this.merged = false;
  this.bounds = {
    b: this.y + this.h,
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.update = function(i) {
    if (!this.filled) {
      if ($.collide.rect(this, $.hero)) {
        $.hero.lose(this.t);
        this.fill();
        var s = $.switches;
        if (s[0].filled && s[1].filled && s[2].filled && s[3].filled && s.length === 4) {
          $.switches.push(new $.LifeSwitch(304,100));
          $.util.showInstructions('You can only create life from life, now go and make the ultimate offer', 7000);
        }
      }
    }
  };

  this.fill = function() {
    this.filled = true;
  };
};

$.FireSwitch = function(x, y) {
  $.Switch.call(this, x, y, $.PW.F);

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(28, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};

$.EarthSwitch = function(x, y) {
  $.Switch.call(this, x, y, $.PW.E);

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(65, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};

$.WaterSwitch = function(x, y) {
  $.Switch.call(this, x, y, $.PW.W);

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(44, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};

$.AirSwitch = function(x, y) {
  $.Switch.call(this, x, y, $.PW.A);

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(32, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};

$.LifeSwitch = function(x, y) {
  $.Switch.call(this, x, y);
  this.bounds = {
    b: this.y + 8,
    t: this.y,
    l: this.x + 12,
    r: this.x  + this.w - 12
  };

  this.update = function(i) {
    if (!this.filled) {
      if ($.collide.rect(this, $.hero)) {
        console.log('ended');
        this.filled = true;
        $.ended = true;
        $.fadeOut.start(4000, '255,255,255');
      }
    }
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(20, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.fillStyle = 'rgb(255,255,255)';
    $.ctxfg.fillRect(tx + 12 , ty, 8, 8);
    $.ctxfg.restore();
  };
};
