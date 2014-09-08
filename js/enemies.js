$.Enemy = function(x, y, w, h, he, mi, vu, pt) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = w;
  _.h = h;
  _.he = he;
  _.maxH = he;
  _.miss = mi;
  _.vul = vu;
  _.ptime = pt || 4000; // Planted time
  _.itime = 300; // Invincibility time

  _.hurt = false;
  _.planted = false;
  _.blink = false;
  _.ctimeH = 0; // Current time for hurt
  _.ctimeP = 0; // Current time for planted
  _.etimeH = 0; // Elapsed time for hurt
  _.etimeP = 0; // Elapsed time for planted
  _.bcount = 0;
  _.minD = 300; // Min distance to start chasing hero
  _.hasRoute = false; // Has a valid route returned by AI
  _.route = []; // Points of route
  _.nextPoint = [];
  _.speed = 0.7;

  _.getb = function() {
    return {
      b: _.y + _.h,
      t: _.y,
      l: _.x,
      r: _.x + _.w
    };
  };

  _.damage = function(p) {
    if (_.hurt) return null;

    if ($.u.canMiss(_.miss)) {
      $.textPops.push(new $.TextPop('miss', _.x, _.y - 5, 'white'));
      return 0;
    }

    var attack = p.attack;
    var color = 'yellow';

    if (p.t === $.PW.E.v) {
      if (!_.planted) {
        _.planted = true;
        _.ctimeP = Date.now();
        _.etimeP = 0;
        $.textPops.push(new $.TextPop('planted', _.x + 2, _.y - 5, color));
      }
      return;
    }

    if (p.t === _.vul.t) {
      attack = Math.floor(p.attack + (p.attack * _.vul.v));
      color = 'red';
    }
    _.he -= attack;
    _.hurt = true;
    _.ctimeH = Date.now();
    _.etimeH = 0;
    $.textPops.push(new $.TextPop('-' + attack, _.x + 7, _.y - 5, color));
    return attack;
  };

  _.planting = function() {
    if (_.planted) {
      _.etimeP = Date.now() - _.ctimeP;

      if (_.etimeP >= _.ptime) {
        _.planted = false;
      }
    }
  };

  _.blinking = function() {
    if (_.hurt) {
      _.etimeH = Date.now() - _.ctimeH;

      var c = Math.floor(_.etimeH / 100);
      if (c > _.bcount) {
        _.bcount = c;
        _.blink = !_.blink;
      }

      if (_.etimeH >= _.itime) {
        _.hurt = false;
        _.bcount = 0;
        _.blink = false;
      }
    }
  };

  _.die = function(i) {
    $.enemies.splice(i, 1);
    // If _ is the last enemy, drop the key, otherwise drop
    // something according probability
    if ($.enemies.length === 0) {
      $.items.push(new $.Key(_.x + (_.w)/2, _.y + 4));
    } else {
      if ($.u.rand(0, 10) > 4) {
        var items = [$.HealthPack, $.ManaPack];
        var k = $.u.rand(0, 2);
        $.items.push(new items[k](_.x + (_.w)/2, _.y + 4));
      }
    }
  };

  // Render health bar
  _.renderBar = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'rgb(0,0,0)';
    $.ctxfg.fillRect(tx, ty - 10, 32, 5);
    $.ctxfg.fillStyle = 'rgb(255,0,0)';
    $.ctxfg.fillRect(tx, ty - 10, (_.he * 32) / _.maxH, 5);
    $.ctxfg.restore();
  };
};

$.Zombie = function(x, y) {
  var _ = this;
  $.Enemy.call(_, x, y, 32, 32, 30, 0.05, {t: $.PW.F.v, v:0.45});

  _.bounds = _.getb();
  _.attack = $.u.rand(12, 16);

  _.update = function(i) {
    _.bounds = _.getb();

    _.blinking();
    _.planting();
    if (_.planted)
      console.log('planted');

    if (_.he <= 0)
      _.die(i);

    if(!_.hasRoute) {
       var distance = $.ai.getDistance({x:_.x, y:_.y}, {x:$.hero.x, y:$.hero.y});
       if((distance <= _.minD) && (Math.round(distance) > 0)) {
          console.log('Get route');
          _.route = $.ai.calculatePath([Math.round(_.x / 32), Math.round(_.y / 32)], [Math.round($.hero.x / 32), Math.round($.hero.y / 32)]);
          _.hasRoute = true;
          _.nextPoint = _.route.shift();
       }
    } else {
      if((Math.round(_.x / 32) == _.nextPoint[0]) && (Math.round(_.y / 32) == _.nextPoint[1])) {
        if(_.route.length > 0) {
          _.nextPoint = _.route.shift();
        } else {
          _.hasRoute = false;
          _.route = [];
        }
      } else {
        if(Math.round(_.x / 32) < _.nextPoint[0]) {
          _.x += _.speed;
        } else if(Math.round(_.x / 32) > _.nextPoint[0]) {
          _.x -= _.speed;
        }
        if(Math.round(_.y / 32) < _.nextPoint[1]) {
          _.y += _.speed;
        } else if(Math.round(_.y / 32) > _.nextPoint[1]) {
          _.y -= _.speed;
        }
      }
    }

  };

  _.render = function(tx, ty) {
    $.ctxfg.save();
    if (!_.blink)
      $.ctxfg.fillStyle = 'rgb(0,150,0)';
    else
      $.ctxfg.fillStyle = 'rgba(0,150,0,0.3)';
    $.ctxfg.fillRect(tx, ty, 32, 32);
    $.ctxfg.restore();

    _.renderBar(tx, ty);
  };
};
