$.Zombie = function(x, y) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 32;
  _.h = 32;
  _.he = 35;
  _.maxH = 35;
  _.miss = 0.05;
  _.ptime = 4000; // Planted time
  _.itime = 300; // Invincibility time

  _.hurt = false;
  _.planted = 0;
  _.blink = 0;
  _.ctimeH = 0; // Current time for hurt
  _.ctimeP = 0; // Current time for planted
  _.etimeH = 0; // Elapsed time for hurt
  _.etimeP = 0; // Elapsed time for planted
  _.bcount = 0;
  _.minD = 300; // Min distance to start chasing hero
  _.hasRoute = 0; // Has a valid route returned by AI
  _.route = []; // Points of route
  _.nextPt = [];
  _.lastPt = [];
  _.speed = 0.7;
  _.attack = $.u.rand(40, 50);

  _.getb = function() {
    return {
      b: _.y + _.h,
      t: _.y,
      l: _.x,
      r: _.x + _.w
    };
  };

  _.bounds = _.getb();

  _.damage = function(p) {
    if (_.hurt) return null;

    if ($.u.canMiss(_.miss)) {
      $.textPops.push(new $.TextPop('miss', _.x, _.y - 5, $.C.wh));
      return 0;
    }

    var atk = p.attack;

    if (p.t === $.PW.E.v) {
      if (!_.planted) {
        _.planted = true;
        _.ctimeP = $.n();
        _.etimeP = 0;
        $.textPops.push(new $.TextPop('bounded', _.x + 2, _.y - 5, $.C.wh));
      }
      return;
    }

    _.he -= atk;
    _.hurt = true;
    _.ctimeH = $.n();
    _.etimeH = 0;
    $.textPops.push(new $.TextPop('-' + atk, _.x + 7, _.y - 5, $.C.rd));
    return atk;
  };


  _.die = function(i) {
    $.enemies.splice(i, 1);
    // If _ is the last enemy, drop the key, otherwise drop
    // something according probability
    if ($.enemies.length === 0) {
      $.items.push(new $.Key(_.x + (_.w)/2, _.y + 4));
    } else {
      if ($.u.rand(0, 10) > 6) {
        var items = [$.HealthPack, $.ManaPack],
            k = $.u.rand(0, 2);
        $.items.push(new items[k](_.x + (_.w)/2, _.y + 4));
      }
    }
    $.sco += _.attack * 10;
  };

  _.update = function(i) {
    _.bounds = _.getb();
    console.log(_.bounds);

    // Planting
    if (_.planted) {
      _.etimeP = $.n() - _.ctimeP;

      if (_.etimeP >= _.ptime)
        _.planted = 0;
    }

    // Blinking
    if (_.hurt) {
      _.etimeH = $.n() - _.ctimeH;

      var c = floor(_.etimeH / 100);
      if (c > _.bcount) {
        _.bcount = c;
        _.blink = !_.blink;
      }

      if (_.etimeH >= _.itime) {
        _.hurt = false;
        _.bcount = 0;
        _.blink = 0;
      }
    }

    if (_.he <= 0)
      _.die(i);

    if(!_.hasRoute) {
       var d = $.ai.getd({x:_.x, y:_.y}, {x:$.hero.x, y:$.hero.y});
       if((d <= _.minD) && (round(d) > 0)) {
          _.route = $.ai.cPath([round(_.x / 32), round(_.y / 32)], [round($.hero.x / 32), round($.hero.y / 32)]);
          if(_.route.length > 0) {
            _.hasRoute = 1;
            _.lastPt = _.route[_.route.length - 1];
            _.nextPt = _.route.shift();
          } else {
            _.route = $.ai.cPath([round(_.x / 32), round(_.y / 32)], [round($.hero.x / 32) - round($.hero.bounds.r / 32), round($.hero.y / 32)]);
            if(_.route.length > 0) {
              _.hasRoute = 1;
              _.lastPt = _.route[_.route.length - 1];
              _.nextPt = _.route.shift();
            } else {
              _.route = $.ai.cPath([round(_.x / 32), round(_.y / 32)], [round($.hero.x / 32), round($.hero.y / 32) - round($.hero.bounds.b / 32)]);
              if(_.route.length > 0) {
                _.hasRoute = 1;
                _.lastPt = _.route[_.route.length - 1];
                _.nextPt = _.route.shift();
              }
            }
          }
       }
    } else {
      if((round(_.x / 32) == _.nextPt[0]) && (round(_.y / 32) == _.nextPt[1])) {
        if(_.route.length > 0) {
          _.nextPt = _.route.shift();
        } else {
          _.hasRoute = 0;
          _.route = [];
          _.nextPt = [];
          _.lastPt = [];
        }
      } else {
        if ((round(_.x / 32) < _.nextPt[0]) && !_.planted)
          _.x += _.speed;
        else if((round(_.x / 32) > _.nextPt[0]) && !_.planted)
          _.x -= _.speed;
        if((round(_.y / 32) < _.nextPt[1]) && !_.planted)
          _.y += _.speed;
        else if((round(_.y / 32) > _.nextPt[1]) && !_.planted)
          _.y -= _.speed;
        if((round($.hero.x / 32) != _.lastPt[0]) || (round($.hero.y / 32) != _.lastPt[1])) {
          _.hasRoute = 0;
          _.route = [];
          _.nextPt = [];
          _.lastPt = [];
        }
      }
    }

  };

  _.render = function(tx, ty) {
    $.x.s();
    if (!_.blink)
      $.x.fillStyle = 'rgb(0,150,0)';
    else
      $.x.fillStyle = 'rgba(0,150,0,0.3)';
    $.x.fr(tx, ty, 32, 32);
    $.x.r();

    // Render health bar
    $.x.s();
    $.x.fillStyle = 'rgb(0,0,0)';
    $.x.fr(tx, ty - 10, 32, 5);
    $.x.fillStyle = 'rgb(255,0,0)';
    $.x.fr(tx, ty - 10, (_.he * 32) / _.maxH, 5);
    $.x.r();
  };
};
