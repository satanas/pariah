$.Power = function(x, y, w, h, o, t) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = w;
  _.h = h;
  _.t = t;

  /* Determine direction */
  if (o === 'l') {
    _.dirX = -1;
    _.dirY = 0;
  } else if (o === 'r') {
    _.dirX = 1;
    _.dirY = 0;
  } else if (o === 'd') {
    _.dirX = 0;
    _.dirY = 1;
  } else if (o === 'u') {
    _.dirX = 0;
    _.dirY = -1;
  }

  this.getb = function() {
    return {
      b: _.y + _.h,
      t: _.y,
      l: _.x,
      r: _.x + _.w
    };
  };

  // Check wall collisions
  this.walls = function(i) {
    $.walls.forEach(function(w) {
      if ($.collide.rect(_, w)) {
        _.die(i);
      }
    });
  };

  // Check world boundaries
  this.boundaries = function(i) {
    if ((_.x + _.w) > $.ww || _.x < 0)
      _.die(i);
    if ((_.y + _.h) > $.wh || _.y < 0)
      _.die(i);
  };

  this.die = function(i) {
    $.powers.splice(i, 1);
  };
};

$.Fire = function(x, y, o) {
  $.Power.call(this, x, y, 24, 24, o, $.PW.F.v);
  var _ = this;

  _.a = 0.55; /* Acceleration */
  _.maxS = 6.00; /* Max speed */
  _.dx = _.dy = 0;
  _.bounds = _.getb();
  _.anim = {x:18, y:17};
  _.ts = $.u.ts();
  _.angle = 0;
  _.attack = $.u.rand(8, 12);

  this.update = function(i) {
    _.angle = (_.angle + 15) % 360;
    _.dx += _.a * _.dirX;
    _.dy += _.a * _.dirY;
    _.dx = $.u.range(_.dx, -_.maxS, _.maxS);
    _.dy = $.u.range(_.dy, -_.maxS, _.maxS);

    _.x += _.dx;
    _.y += _.dy;
    _.bounds = _.getb();

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(_, e)) {
        e.damage(_);
        _.die(i);
      }
    });

    _.walls(i);
    _.boundaries(i);
  };

  this.render = function(tx, ty) {
    $.x.s();
    //$.x.translate(tx + (_.w/2), ty + (_.h/2));
    //$.x.rotate(_.angle / 180 * Math.PI);
    $.x.sc(2.0, 2.0);
    //$.x.fillStyle = 'rgb(255,159,7)';
    //$.x.fr(tx/2 + 2, ty/2 + 1, 6, 6);
    $.x.d(_.ts, _.anim.x, _.anim.y, 10, 9, tx/2, ty/2, 10, 9);
    //$.x.d(_.ts, _.anim.x, _.anim.y, _.w/2, _.h/2, -_.w/4, -_.h/4, _.w/2, _.h/2);
    $.x.r();
  };
};


$.Earth = function(x, y, o, n) {
  $.Power.call(this, x, y, 15, 25, o, $.PW.E.v);
  var _ = this,
      d = 30;
  if (o === 'u') {
    _.y -= d;
    if (n === 1) _.x += 2;
  } else if (o === 'r') {
    _.x += d;
    if (n === 1) _.y += 6;
  } else if (o === 'd') {
    _.y += d;
    if (n === 1) _.x += 2;
  } else if (o === 'l') {
    _.x -= d;
    if (n === 1) _.y += 6;
  }
  _.n = n;
  _.o = o;
  _.bounds = _.getb();
  _.lifetime = 400; // Lifetime
  _.summontime = 350;
  _.ctime = Date.now(); // Creation time
  _.attack = 0;
  _.anim = {x:5, y:17};
  _.ts = $.u.ts();
  _.summon = false;

  this.update = function(i) {
    var elapsed = Date.now() - _.ctime;

    if (elapsed > _.lifetime) _.die(i);
    if (elapsed > _.summontime && !_.summon && _.n < 3) {
      _.summon = true;
      $.powers.push(new $.Earth(_.x, _.y, _.o, _.n + 1));
    }

    _.bounds = _.getb();

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(_, e)) {
        e.damage(_);
        //_.die(i);
      }
    });

    _.walls(i);
    _.boundaries(i);
  };

  this.render = function(tx, ty) {
    $.x.s();
    // Test rect
    //$.x.fillStyle = 'hsla(28, 65%, 42%, 1)';
    //$.x.fr(tx, ty, _.w, _.h);
    $.x.sc(3.0, 3.0);
    $.x.d(_.ts, _.anim.x, _.anim.y, 5, 10, tx/3, ty/3, 5, 10);
    $.x.r();
  };
};


$.Water = function(x ,y, a) {
  $.Power.call(this, x, y, 20, 20, null, $.PW.W.v);
  var _ = this;

  _.vw = 2 * Math.PI;
  _.a = a * Math.PI / 180;
  _.d = 35;
  _.r = 10; /* Radius */
  _.lifetime = 6000; /* Milliseconds */
  _.ctime = Date.now();
  _.bounds = _.getb();
  _.attack = $.u.rand(3, 6);

  this.update = function(i) {
    var elapsed = Date.now() - _.ctime;
    _.ctime = Date.now();
    _.lifetime -= elapsed;

    if (_.lifetime <= 0) _.die(i);

    _.cx = $.hero.x + ($.hero.w / 2);
    _.cy = $.hero.y + ($.hero.h / 2);
    _.a += _.vw * elapsed / 1000;
    _.x = _.cx + (_.d * cos(_.a));
    _.y = _.cy + (_.d * sin(_.a));

    _.bounds = _.getb();

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(_, e)) {
        var a = e.damage(_);
        if (a !== null && a !== 0) $.hero.heal(a);
      }
    });
  };

  this.render = function(tx, ty) {
    $.x.s();
    // Test arc
    //$.x.fillStyle = 'rgba(0, 115, 255, 0.3)';
    //$.x.beginPath();
    //$.x.arc(tx, ty, _.r, 0, (2 * Math.PI), false);
    //$.x.fill();
    var x_ = tx - 11,
        y_ = ty - 11;
    $.x.fillStyle = 'hsla(190, 90%, 76%, 0.59)';
    $.x.fr(x_ + 7, y_ + 7, 8, 8);
    $.x.fillStyle = 'hsl(190, 90%, 76%)';
    $.x.fr(x_ + 4, y_ + 10, 14, 2);
    $.x.fr(x_ + 10, y_ + 4, 2, 14);
    $.x.fr(x_ + 10, y_, 2, 2);
    $.x.fr(x_ + 3, y_ + 3, 2, 2);
    $.x.fr(x_ + 17, y_ + 3, 2, 2);
    $.x.fr(x_, y_ + 10, 2, 2);
    $.x.fr(x_ + 20, y_ + 10, 2, 2);
    $.x.fr(x_ + 3, y_ + 17, 2, 2);
    $.x.fr(x_ + 17, y_ + 17, 2, 2);
    $.x.fr(x_ + 10, y_ + 20, 2, 2);
    $.x.r();
  };

  this.die = function(i) {
    $.powers.splice(i, 1);
    $.hero.shield = false;
  };
};

$.Air = function(x, y, o) {
  $.Power.call(this, x, y, 12, 24, o, $.PW.A.v);
  var _ = this;

  if (o === 'u' || o === 'd')
    _.x += 6;

  _.a = 0.65; /* Acceleration */
  _.maxS = 7.00; /* Max speed */
  _.dx = _.dy = 0;
  _.bounds = _.getb();
  _.attack = $.u.rand(7, 10);
  _.anim = {x:11, y:17};
  _.ts = $.u.ts();
  _.blink = false;
  _.bcount = 0;
  _.ctime = Date.now();

  this.update = function(i) {
    _.dx += _.a * _.dirX;
    _.dy += _.a * _.dirY;
    _.dx = $.u.range(_.dx, -_.maxS, _.maxS);
    _.dy = $.u.range(_.dy, -_.maxS, _.maxS);

    _.x += _.dx;
    _.y += _.dy;
    _.bounds = _.getb();

    var elapsed = Date.now() - _.ctime,
        c = floor(elapsed / 100);
    if (c > _.bcount) {
      _.bcount = c;
      _.blink = !_.blink;
    }

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(_, e)) {
        e.damage(_);
        _.die(i);
      }
    });

    _.walls(i);
    _.boundaries(i);
  };

  this.render = function(tx, ty) {
    $.x.s();
    $.x.fillStyle = 'hsla(207, 100%, 83%, 0.1)';
    $.x.fr(tx, ty, _.w, _.h);
    $.x.globalAlpha = 0.7;
    if (_.blink) {
      $.x.translate(tx + (_.w/2) - 6, ty + _.h/2);
      $.x.sc(-2.0, 2.0);
    } else {
      $.x.translate(tx + (_.w/2) + 6, ty + _.h/2);
      $.x.sc(2.0, 2.0);
    }
    $.x.d(_.ts, _.anim.x, _.anim.y, _.w/2, _.h/2, -_.w/4, -_.h/4, 6, 12);
    $.x.r();
  };
};
