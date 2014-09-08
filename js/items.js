$.Item = function(x, y, t, c) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 16;
  _.h = 16;
  _.t = t; // Type
  _.c = c || false; // Consumible?
  _.bounds = {
    b: _.y + _.h,
    t: _.y,
    l: _.x,
    r: _.x + _.w
  };

  _.update = function(i) {
    if ($.collide.rect(_, $.hero)) {
      $.hero.gain(_);
      _.die(i);
    }
  };

  _.die = function(i) {
    $.items.splice(i, 1);
  };
};

$.FireItem = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, $.PW.F);

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(28, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.restore();
  };
};

$.WaterItem = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, $.PW.W);

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(196, 90%, 76%, 1)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.restore();
  };
};

$.EarthItem = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, $.PW.E);

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(28, 65%, 42%, 1)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.restore();
  };
};

$.AirItem = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, $.PW.A);

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(78, 100%, 92%, 1)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.restore();
  };
};

$.Key = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, 'k', true);
  _.anim = {x:0, y:17};
  _.ts = $.util.byId('tileset');
  _.w = 6;
  _.h = 20;

  _.render = function(tx, ty) {
    $.ctxfg.save();
    //$.ctxfg.fillStyle = 'rgb(255,255,0)';
    //$.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.scale(2.0, 2.0);
    $.ctxfg.drawImage(_.ts, _.anim.x, _.anim.y, 5, 10, tx/2, ty/2, 5, 10);
    $.ctxfg.restore();
  };
};

$.HealthPack = function(x, y) {
  $.Item.call(this, x, y, 'h', true);
  this.w = 10;

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.DrawBottle(tx, ty, $.HCOLOR);
    $.ctxfg.restore();
  };
};

$.ManaPack = function(x, y) {
  $.Item.call(this, x, y, 'm', true);
  this.w = 10;

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.DrawBottle(tx, ty, $.MCOLOR);
    $.ctxfg.restore();
  };
};

$.DrawBottle = function(tx, ty, color) {
    $.ctxfg.globalAlpha = 0.7;

    $.ctxfg.fillStyle = 'rgb(255,0,0)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);

    $.ctxfg.fillStyle = 'hsl(36, 43%, 59%)';
    $.ctxfg.fillRect(tx + 3, ty + 1, 3, 3);
    // Body of the bottle
    $.ctxfg.fillStyle = 'rgb(154,154,154)';
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
    $.ctxfg.fillStyle = color;
    $.ctxfg.fillRect(tx + 7, ty + 7, 2, 1);
    $.ctxfg.fillRect(tx + 3, ty + 8, 6, 1);
    $.ctxfg.fillRect(tx + 1, ty + 9, 8, 8);
    $.ctxfg.fillStyle = 'hsl(208, 50%, 48%)';
    $.ctxfg.fillRect(tx + 6, ty + 10, 2, 2);
    $.ctxfg.fillRect(tx + 3, ty + 14, 1, 1);
  };
