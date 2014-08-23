$.Fire = function(x, y, o) {
  this.x = x;
  this.y = y;
  this.w = 24;
  this.h = 24;
  this.a = 0.55; /* Acceleration */
  this.mx_s = 6.00; /* Max speed */
  this.dx = this.dy = 0;
  this.bounds = {};

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

  this.update = function(i) {
    this.dx += this.a * this.dirX;
    this.dy += this.a * this.dirY;
    this.dx = $.util.checkRange(this.dx, -this.mx_s, this.mx_s);
    this.dy = $.util.checkRange(this.dy, -this.mx_s, this.mx_s);

    this.x += this.dx;
    this.y += this.dy;

    this.bounds = {
      b: this.y + this.h,
      t: this.y,
      l: this.x,
      r: this.x + this.w
    };

    /* Check world boundaries */
    if ((this.x + this.w) > $.ww || this.x < 0)
      this.die(i);
    if ((this.y + this.h) > $.wh || this.y < 0)
      this.die(i);

    var self = this;
    /* Check for collisions */
    $.walls.forEach(function(w) {
      if ($.collide.rect(self, w)) {
        self.die(i);
      }
    });
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(37, 100%, 50%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };

  this.die = function(i) {
    $.powerGrp.splice(i, 1);
  };
};


$.Earth = function(x, y, w, h, o) {
  this.w = 36;
  this.h = 36;
  this.a = 0.7; /* Acceleration */
  this.mx_s = 6.00; /* Max speed */
  this.dy = 0;
  this.bounds = {};
  this.dirX = 0;
  this.dirY = 1;
  this.x1 = this.x2 = 0; /* Action range for the block */
  this.ctime = Date.now();

  /* Determine direction */
  if (o === 'l') {
    this.y = y - (h * 3.5);
    this.x = x - (w * 2) - this.w;
    this.y1 = y;
  } else if (o === 'r') {
    this.y = y - (h * 3.5);
    this.x = x + (3 * w);
    this.y1 = y;
  } else if (o === 'd') {
    this.y = y - (h * 3);
    this.x = x + (w / 2) - (this.w / 2);
    this.y1 = y + h + (h / 2);
  } else if (o === 'u') {
    this.y = y - (h * 5);
    this.x = x + (w / 2) - (this.w / 2);
    this.y1 = y - (h / 2) - this.h;
  }
  this.y2 = this.y1 + h + (h / 4);

  /* Calculate shadow coordinates and control points*/
  this.sx1 = this.x;
  this.sx2 = this.x + this.w;
  this.sy1 = this.y2 - (this.h / 4);
  this.sy2 = this.sy1;
  this.cpx1 = this.sx1 + 8;
  this.cpx2 = this.sx2 - 8;
  this.cpy1 = this.sy2 - 8;
  this.cpy2 = this.sy2 + 8;

  this.update = function(i) {
    var elapsed = Date.now() - this.ctime;
    this.ctime = Date.now();
    //this.dy += this.a * this.dirY;
    this.dy += (this.a * (elapsed * elapsed)) / 2;
    this.dy = $.util.checkRange(this.dy, -this.mx_s, this.mx_s);

    this.y += this.dy;

    this.bounds = {
      b: this.y + this.h,
      t: this.y,
      l: this.x,
      r: this.x + this.w
    };

    /* Check action range */
    if ((this.y + this.h) > this.y2)
      this.die(i);
  };

  this.render = function(tx, ty) {
    var s1 = $.cam.transCoord({x: this.sx1, y: this.sy1});
    var s2 = $.cam.transCoord({x: this.sx2, y: this.sy2});
    var cp1 = $.cam.transCoord({x: this.cpx1, y: this.cpy1});
    var cp2 = $.cam.transCoord({x: this.cpx2, y: this.cpy2});

    /* Render shadow */
    $.ctxfg.save();
    $.ctxfg.beginPath();
    $.ctxfg.fillStyle = 'rgba(18, 18, 18, 0.35)';
    $.ctxfg.moveTo(s1.x, s1.y);
    $.ctxfg.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp1.y, s2.x, s2.y);
    $.ctxfg.bezierCurveTo(cp2.x, cp2.y, cp1.x, cp2.y, s1.x, s1.y);
    $.ctxfg.fill();
    $.ctxfg.restore();

    /* Render stone */
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(28, 65%, 42%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };

  this.die = function(i) {
    $.powerGrp.splice(i, 1);
  };
};


$.Water = function(x ,y, w, h, a) {
  this.w = 20;
  this.h = 20;
  this.vw = 2 * Math.PI;
  this.a = a * Math.PI / 180;
  this.d = 32;
  this.r = 10; /* Radius */
  this.x = x;
  this.y = y;
  this.lifetime = 4000; /* Milliseconds */
  this.ctime = Date.now();

  this.update = function(i) {
    var elapsed = Date.now() - this.ctime;
    this.ctime = Date.now();
    this.lifetime -= elapsed;

    if (this.lifetime <= 0)
      this.die(i);

    this.cx = $.hero.x + ($.hero.w / 2);
    this.cy = $.hero.y + ($.hero.h / 2);
    this.a += this.vw * elapsed / 1000;
    this.x = this.cx + (this.d * Math.cos(this.a));
    this.y = this.cy + (this.d * Math.sin(this.a));
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'rgba(0, 115, 255, 1)';
    $.ctxfg.beginPath();
    $.ctxfg.arc(tx, ty, this.r, 0, (2 * Math.PI), false);
    $.ctxfg.fill();
    $.ctxfg.restore();
  };

  this.die = function(i) {
    $.powerGrp.splice(i, 1);
    $.hero.shield = false;
  };
};

$.Air = function(x, y, o) {
  this.x = x;
  this.y = y;
  this.w = 24;
  this.h = 24;
  this.a = 0.55; /* Acceleration */
  this.mx_s = 6.00; /* Max speed */
  this.dx = this.dy = 0;
  this.bounds = {};

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

  this.update = function(i) {
    this.dx += this.a * this.dirX;
    this.dy += this.a * this.dirY;
    this.dx = $.util.checkRange(this.dx, -this.mx_s, this.mx_s);
    this.dy = $.util.checkRange(this.dy, -this.mx_s, this.mx_s);

    this.x += this.dx;
    this.y += this.dy;

    this.bounds = {
      b: this.y + this.h,
      t: this.y,
      l: this.x,
      r: this.x + this.w
    };

    /* Check world boundaries */
    if ((this.x + this.w) > $.ww || this.x < 0)
      this.die(i);
    if ((this.y + this.h) > $.wh || this.y < 0)
      this.die(i);

    var self = this;
    /* Check for collisions */
    $.walls.forEach(function(w) {
      if ($.collide.rect(self, w)) {
        self.die(i);
      }
    });
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'hsla(207, 100%, 83%, 1)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };

  this.die = function(i) {
    $.powerGrp.splice(i, 1);
  };
};
