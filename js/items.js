$.Item = function(x, y, t, c) {
  this.x = x;
  this.y = y;
  this.w = 16;
  this.h = 16;
  this.t = t; // Type
  this.c = c || false; // Consumible?
  this.bounds = {
    b: this.y + this.h,
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.update = function(i) {
    if ($.collide.rect(this, $.hero)) {
      $.hero.gain(this);
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

$.Key = function(x, y) {
  $.Item.call(this, x, y, 'k', true);
  this.anim = {x:71, y:10};
  this.ts = $.util.byId('tileset');
  this.w = 6;
  this.h = 20;

  this.render = function(tx, ty) {
    $.ctxfg.save();
    //$.ctxfg.fillStyle = 'rgb(255,255,0)';
    //$.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.scale(2.0, 2.0);
    $.ctxfg.drawImage(this.ts, this.anim.x, this.anim.y, 3, 10, tx/2, ty/2, 3, 10);
    $.ctxfg.restore();
  };
};

$.HealthPack = function(x, y) {
  $.Item.call(this, x, y, 'h', true);
  this.anim = {x:71, y:0};
  this.ts = $.util.byId('tileset');

  this.render = function(tx, ty) {
    $.ctxfg.save();

    $.ctxfg.globalAlpha = 0.7;

    $.ctxfg.scale(2.0, 2.0);
    $.ctxfg.drawImage(this.ts, this.anim.x, this.anim.y, 6, 9, tx/2, ty/2, 6, 9);
    $.ctxfg.fillStyle = $.HCOLOR;
    $.ctxfg.fillRect(tx/2 + 0.5, ty/2 + 4 , 5, 5);

    //$.ctxfg.fillStyle = 'hsl(36, 43%, 59%)';
    //$.ctxfg.fillRect(tx + 3, ty + 1, 3, 3);
    //// Body of the bottle
    //$.ctxfg.fillStyle = 'rgb(54,54,54)';
    //var p = [[2,7], [3,6], [3,6], [2,7], [1,8]];
    //for (var i=2; i<=6; i++) {
    //  $.ctxfg.fillRect(tx + p[i - 2][0], ty + i, 1, 1);
    //  $.ctxfg.fillRect(tx + p[i - 2][1], ty + i, 1, 1);
    //}
    //$.ctxfg.fillRect(tx, ty + 7, 1, 11);
    //$.ctxfg.fillRect(tx + 9, ty + 7, 1, 11);
    //$.ctxfg.fillRect(tx, ty + 17, 10, 1);

    //// Glow
    //$.ctxfg.fillStyle = 'rgb(255,255,255)';
    //$.ctxfg.fillRect(tx + 3, ty + 6, 1, 1);
    //$.ctxfg.fillRect(tx + 2, ty + 7, 1, 1);

    //// Liquid
    //$.ctxfg.fillStyle = $.HCOLOR;
    //$.ctxfg.fillRect(tx + 7, ty + 7, 2, 1);
    //$.ctxfg.fillRect(tx + 3, ty + 8, 6, 1);
    //$.ctxfg.fillRect(tx + 1, ty + 9, 8, 7);
    //$.ctxfg.fillStyle = 'hsl(208, 50%, 48%)';
    //$.ctxfg.fillRect(tx + 6, ty + 10, 2, 2);
    //$.ctxfg.fillRect(tx + 3, ty + 14, 1, 1);
    $.ctxfg.restore();
  };
};

$.ManaPack = function(x, y) {
  $.Item.call(this, x, y, 'm', true);
  this.anim = {x:71, y:0};
  this.ts = $.util.byId('tileset');

  this.render = function(tx, ty) {
    $.ctxfg.save();

    $.ctxfg.globalAlpha = 0.7;

    //$.ctxfg.scale(2.0, 2.0);
    //$.ctxfg.drawImage(this.ts, this.anim.x, this.anim.y, 6, 9, tx/2, ty/2, 6, 9);
    //$.ctxfg.fillStyle = $.MCOLOR;
    //$.ctxfg.fillRect(tx/2 + 0.5, ty/2 + 4 , 5, 5);

    $.ctxfg.fillStyle = 'hsl(36, 43%, 59%)';
    $.ctxfg.fillRect(tx + 3, ty + 1, 3, 3);
    // Body of the bottle
    $.ctxfg.fillStyle = 'rgb(54,54,54)';
    var p = [[2,7], [3,6], [3,6], [2,7], [1,8]];
    for (var i=2; i<=6; i++) {
      $.ctxfg.fillRect(tx + p[i - 2][0], ty + i, 1, 1);
      $.ctxfg.fillRect(tx + p[i - 2][1], ty + i, 1, 1);
    }
    $.ctxfg.fillRect(tx, ty + 7, 1, 11);
    $.ctxfg.fillRect(tx + 9, ty + 7, 1, 11);
    $.ctxfg.fillRect(tx, ty + 17, 10, 1);

    // Glow
    $.ctxfg.fillStyle = 'rgb(255,255,255)';
    $.ctxfg.fillRect(tx + 3, ty + 6, 1, 1);
    $.ctxfg.fillRect(tx + 2, ty + 7, 1, 1);

    // Liquid
    $.ctxfg.fillStyle = $.MCOLOR;
    $.ctxfg.fillRect(tx + 7, ty + 7, 2, 1);
    $.ctxfg.fillRect(tx + 3, ty + 8, 6, 1);
    $.ctxfg.fillRect(tx + 1, ty + 9, 8, 7);
    $.ctxfg.fillStyle = 'hsl(208, 50%, 48%)';
    $.ctxfg.fillRect(tx + 6, ty + 10, 2, 2);
    $.ctxfg.fillRect(tx + 3, ty + 14, 1, 1);
    $.ctxfg.restore();
  };
};
