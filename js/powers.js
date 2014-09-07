$.Power = function(x, y, w, h, o, t) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.t = t;

  /* Determine direction */
  if (o === 'l') {
    this.dirX = -1;
    this.dirY = 0;
  } else if (o === 'r') {
    this.dirX = 1;
    this.dirY = 0;
  } else if (o === 'd') {
    this.dirX = 0;
    this.dirY = 1;
  } else if (o === 'u') {
    this.dirX = 0;
    this.dirY = -1;
  }

  this.getb = function() {
    return {
      b: this.y + this.h,
      t: this.y,
      l: this.x,
      r: this.x + this.w
    };
  };

  // Check wall collisions
  this.walls = function(i) {
    var self = this;
    $.walls.forEach(function(w) {
      if ($.collide.rect(self, w)) {
        self.die(i);
      }
    });
  };

  // Check world boundaries
  this.boundaries = function(i) {
    if ((this.x + this.w) > $.ww || this.x < 0)
      this.die(i);
    if ((this.y + this.h) > $.wh || this.y < 0)
      this.die(i);
  };

  this.die = function(i) {
    $.powers.splice(i, 1);
  };
};

$.Fire = function(x, y, o) {
  $.Power.call(this, x, y, 24, 24, o, $.PW.F.v);

  this.a = 0.55; /* Acceleration */
  this.maxS = 6.00; /* Max speed */
  this.dx = this.dy = 0;
  this.bounds = this.getb();
  this.anim = {x:70, y:21};
  this.ts = $.util.byId('tileset');
  this.angle = 0;
  this.attack = $.util.randInt(8, 12);

  this.update = function(i) {
    var self = this;
    this.angle = (this.angle + 15) % 360;
    this.dx += this.a * this.dirX;
    this.dy += this.a * this.dirY;
    this.dx = $.util.range(this.dx, -this.maxS, this.maxS);
    this.dy = $.util.range(this.dy, -this.maxS, this.maxS);

    this.x += this.dx;
    this.y += this.dy;
    this.bounds = this.getb();

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(self, e)) {
        e.damage(self);
        self.die(i);
      }
    });

    this.walls(i);
    this.boundaries(i);
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.translate(tx + (this.w/2), ty + (this.h/2));
    $.ctxfg.rotate(this.angle / 180 * Math.PI);
    $.ctxfg.scale(2.0, 2.0);
    //$.ctxfg.fillStyle = 'rgb(255,159,7)';
    //$.ctxfg.fillRect(tx/2 + 2, ty/2 + 1, 6, 6);
    //$.ctxfg.drawImage(this.ts, this.anim.x, this.anim.y, 10, 9, tx/2, ty/2, 10, 9);
    $.ctxfg.drawImage(this.ts, this.anim.x, this.anim.y, this.w/2, this.h/2, -this.w/4, -this.h/4, this.w/2, this.h/2);
    $.ctxfg.restore();
  };
};


$.Earth = function(x, y, w, h, o) {
  $.Power.call(this, x, y, 36, 36, o, $.PW.E.v);

  this.a = 0.7; /* Acceleration */
  this.maxS = 6.00; /* Max speed */
  this.dx = this.dy = 0;
  this.bounds = this.getb();
  this.angle = 0;
  this.attack = 0;

  this.update = function(i) {
    var self = this;
    this.angle = (this.angle + 15) % 360;
    this.dx += this.a * this.dirX;
    this.dy += this.a * this.dirY;
    this.dx = $.util.range(this.dx, -this.maxS, this.maxS);
    this.dy = $.util.range(this.dy, -this.maxS, this.maxS);

    this.x += this.dx;
    this.y += this.dy;
    this.bounds = this.getb();

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(self, e)) {
        e.damage(self);
        self.die(i);
      }
    });

    this.walls(i);
    this.boundaries(i);
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(28, 65%, 42%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};


$.Water = function(x ,y, w, h, a) {
  $.Power.call(this, x, y, 20, 20, null, $.PW.W.v);

  this.vw = 2 * Math.PI;
  this.a = a * Math.PI / 180;
  this.d = 35;
  this.r = 10; /* Radius */
  this.lifetime = 6000; /* Milliseconds */
  this.ctime = Date.now();
  this.bounds = this.getb();
  this.attack = $.util.randInt(3, 6);

  this.update = function(i) {
    var elapsed = Date.now() - this.ctime;
    this.ctime = Date.now();
    this.lifetime -= elapsed;

    if (this.lifetime <= 0) this.die(i);

    this.cx = $.hero.x + ($.hero.w / 2);
    this.cy = $.hero.y + ($.hero.h / 2);
    this.a += this.vw * elapsed / 1000;
    this.x = this.cx + (this.d * Math.cos(this.a));
    this.y = this.cy + (this.d * Math.sin(this.a));

    this.bounds = this.getb();

    // Check collision with enemies
    var self = this;
    $.enemies.forEach(function(e) {
      if ($.collide.rect(self, e)) {
        var a = e.damage(self);
        if (a !== null && a !== 0) $.hero.heal(a);
      }
    });
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    //$.ctxfg.fillStyle = 'rgba(0, 115, 255, 0.3)';
    //$.ctxfg.beginPath();
    //$.ctxfg.arc(tx, ty, this.r, 0, (2 * Math.PI), false);
    //$.ctxfg.fill();
    var x_ = tx - 11;
    var y_ = ty - 11;
    $.ctxfg.fillStyle = 'hsla(190, 90%, 76%, 0.59)';
    $.ctxfg.fillRect(x_ + 7, y_ + 7, 8, 8);
    $.ctxfg.fillStyle = 'hsl(190, 90%, 76%)';
    $.ctxfg.fillRect(x_ + 4, y_ + 10, 14, 2);
    $.ctxfg.fillRect(x_ + 10, y_ + 4, 2, 14);
    $.ctxfg.fillRect(x_ + 10, y_, 2, 2);
    $.ctxfg.fillRect(x_ + 3, y_ + 3, 2, 2);
    $.ctxfg.fillRect(x_ + 17, y_ + 3, 2, 2);
    $.ctxfg.fillRect(x_, y_ + 10, 2, 2);
    $.ctxfg.fillRect(x_ + 20, y_ + 10, 2, 2);
    $.ctxfg.fillRect(x_ + 3, y_ + 17, 2, 2);
    $.ctxfg.fillRect(x_ + 17, y_ + 17, 2, 2);
    $.ctxfg.fillRect(x_ + 10, y_ + 20, 2, 2);
    $.ctxfg.restore();
  };

  this.die = function(i) {
    $.powers.splice(i, 1);
    $.hero.shield = false;
  };
};

$.Air = function(x, y, o) {
  $.Power.call(this, x, y, 24, 24, o, $.PW.A.v);

  this.a = 0.65; /* Acceleration */
  this.maxS = 7.00; /* Max speed */
  this.dx = this.dy = 0;
  this.bounds = this.getb();
  this.attack = $.util.randInt(7, 10);

  this.update = function(i) {
    this.dx += this.a * this.dirX;
    this.dy += this.a * this.dirY;
    this.dx = $.util.range(this.dx, -this.maxS, this.maxS);
    this.dy = $.util.range(this.dy, -this.maxS, this.maxS);

    this.x += this.dx;
    this.y += this.dy;
    this.bounds = this.getb();

    // Check collision with enemies
    var self = this;
    $.enemies.forEach(function(e) {
      if ($.collide.rect(self, e)) {
        e.damage(self);
        self.die(i);
      }
    });

    this.walls(i);
    this.boundaries(i);
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(207, 100%, 83%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };
};
