$.Switch= function(x, y, t) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 32;
  _.h = 32;
  _.t = t; // Type
  _.filled = false;
  _.merged = false;
  _.bounds = {
    b: _.y + _.h,
    t: _.y,
    l: _.x,
    r: _.x + _.w
  };

  _.update = function(i) {
    if (!_.filled) {
      if ($.collide.rect(_, $.hero)) {
        $.hero.lose(_.t);
        _.fill();
        var s = $.switches;
        if (s[0].filled && s[1].filled && s[2].filled && s[3].filled && s.length === 4) {
          $.switches.push(new $.LifeSwitch(304,100));
          $.u.instruction('You can only create life from life, now go and make the ultimate offer', 7000);
        }
      }
    }
  };

  _.fill = function() {
    _.filled = true;
  };
};

$.FireSwitch = function(x, y) {
  var _ = this;
  $.Switch.call(_, x, y, $.PW.F);

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(28, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.restore();
  };
};

$.EarthSwitch = function(x, y) {
  var _ = this;
  $.Switch.call(_, x, y, $.PW.E);

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(65, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.restore();
  };
};

$.WaterSwitch = function(x, y) {
  var _ = this;
  $.Switch.call(_, x, y, $.PW.W);

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(44, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.restore();
  };
};

$.AirSwitch = function(x, y) {
  var _ = this;
  $.Switch.call(_, x, y, $.PW.A);

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(32, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.restore();
  };
};

$.LifeSwitch = function(x, y) {
  var _ = this;
  $.Switch.call(_, x, y);
  _.bounds = {
    b: _.y + 8,
    t: _.y,
    l: _.x + 12,
    r: _.x  + _.w - 12
  };

  _.update = function(i) {
    if (!_.filled) {
      if ($.collide.rect(_, $.hero)) {
        console.log('ended');
        _.filled = true;
        $.ended = true;
        $.fadeOut.start(4000, '255,255,255');
      }
    }
  };

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(20, 100%, 51%, 1)';
    $.ctxfg.fillRect(tx, ty, _.w, _.h);
    $.ctxfg.fillStyle = 'rgb(255,255,255)';
    $.ctxfg.fillRect(tx + 12 , ty, 8, 8);
    $.ctxfg.restore();
  };
};
