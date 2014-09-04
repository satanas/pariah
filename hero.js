$.Hero = function(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.w = 16;
  this.h = 32;
  this.bounds = {};
  // Speed
  this.s = 0.13;
  this.dx = this.dy = 0;
  this.o = 'd'; /* Orientation*/
  this.cooldown = 0;
  this.ctime = Date.now(); /* Current time */
  // Current Power
  this.cp = 1; /* 1=Fire 2=Earth 3=Water 4=Air */
  // Health
  this.he = 100;
  this.ma = 98;
  this.shield = false;

  /* Max speed, max health and max mana */
  this.maxS = 2.00;
  this.maxH = 100;
  this.maxM = 100;
  this.t = $.util.byId('tileset');

  /* Animations */
  this.count = 0;
  this.frameDuration = 5;
  this.currFrame = 0;
  this.totalFrames = 2;
  this.anim = {
    'run': {
      'd': [{x:53, y:0},  {x:69, y:0} ],// {x:85, y:0}],
      'u': [{x:53, y:16}, {x:69, y:16}],// {x:85, y:16}],
      'r': [{x:53, y:32}, {x:69, y:32}],// {x:85, y:32}],
      'l': [{x:53, y:48}, {x:69, y:48}],// {x:85, y:48}],
    },
    'idle': {
      'd': {x:53, y:0},
      'u': {x:53, y:16},
      'r': {x:53, y:32},
      'l': {x:53, y:48}
    }
  };

  this.update = function() {
    var now = Date.now();
    var elapsed = now - this.ctime;
    this.ctime = now;

    if ($.input.p(37)) {
      this.o = 'l';
      this.dx -= this.s;
    } else if ($.input.p(39)) {
      this.o = 'r';
      this.dx += this.s;
    }

    if ($.input.p(38)) {
      this.o = 'u';
      this.dy -= this.s;
    } else if ($.input.p(40)) {
      this.o = 'd';
      this.dy += this.s;
    }

    if ($.input.p(49)) {
      this.cp = 1;
    } else if ($.input.p(50)) {
      this.cp = 2;
    } else if ($.input.p(51)) {
      this.cp = 3;
    } else if ($.input.p(52)) {
      this.cp = 4;
    }

    this.dx = $.util.range(this.dx, -this.maxS, this.maxS);
    this.dy = $.util.range(this.dy, -this.maxS, this.maxS);

    if (!$.input.p(37) && !$.input.p(39)) {
      this.dx = 0;
    }
    if (!$.input.p(38) && !$.input.p(40)) {
      this.dy = 0;
    }

    if (this.cooldown > 0) {
      this.cooldown -= elapsed;
      if (this.cooldown <= 0) {
        this.cooldown = 0;
      }
    }

    /* Regeneration */
    if (this.shield) {
      this.he += elapsed * $.HEALTH_REGEN / 1000;
      this.he = $.util.range(this.he, 0, this.maxH);
      this.ma -= elapsed * $.MANA_USAGE[3] / 1000;
    } else {
      this.ma += elapsed * $.MANA_REGEN / 1000;
    }
    this.ma = $.util.range(this.ma, 0, this.maxM);

    /* Summon elements */
    if ($.input.p(32) && this.cooldown === 0) {
      if (this.ma >= $.MANA_USAGE[this.cp]) {
        if (this.cp === 1) {
          $.powerGrp.push(new $.Fire(this.x, this.y, this.o));
        } else if (this.cp === 2) {
          $.powerGrp.push(new $.Earth(this.x, this.y, this.w, this.h, this.o));
        } else if (this.cp === 3) {
          var self = this;
          [0, 120, 240].forEach(function(a) {
            $.powerGrp.push(new $.Water(self.x, self.y, self.w, self.h, a));
          });
          this.shield = true;
        } else if (this.cp === 4) {
          $.powerGrp.push(new $.Air(this.x, this.y, this.o));
        }
        this.ma -= $.MANA_USAGE[this.cp];
        this.cooldown = $.POWER_COOLDOWN;
      }
    }

    this.x += this.dx;
    this.y += this.dy;

    if ((this.x + this.w) > $.ww)
      this.x = $.ww - this.w;
    if ((this.y + this.h) > $.wh)
      this.y = $.wh - this.h;
    if (this.x < 0)
      this.x = 0;
    if (this.y < 0)
      this.y = 0;

    this.bounds = {
      b: this.y + this.h,
      t: this.y,
      l: this.x,
      r: this.x + this.w
    };

    var self = this;
    /* Check for collisions */
    $.walls.forEach(function(w) {
      if ($.collide.rect(self, w)) {
        if ($.collide.isTop(self, w)){
          self.y = w.bounds.t - self.h;
        } else if ($.collide.isBottom(self, w)) {
          self.y = w.bounds.b;
        } else if ($.collide.isLeft(self, w)) {
          self.x = w.bounds.l - self.w;
        } else if ($.collide.isRight(self, w)) {
          self.x = w.bounds.r;
        } else {
          console.log('collision');
        }
      }
    });

    /* Calculate animation frame */
    this.count = (this.count + 1) % this.frameDuration;
    if (this.count === (this.frameDuration - 1)) {
      this.currFrame = (this.currFrame + 1) % this.totalFrames;
    }
  };

  this.render = function() {
    var tx, ty = 0;
    var mw = $.vw/2;
    var mh = $.vh/2;
    if (this.x <= (mw)) {
      tx = this.x;
    } else if ((this.x > mw) && (this.x + mw <= $.ww)) {
      tx = mw;
    } else if ((this.x > mw) && (this.x + mw > $.ww)) {
      tx = $.vw - ($.ww - this.x);
    }

    if (this.y <= (mh)) {
      ty = this.y;
    } else if ((this.y > mh) && (this.y + mh <= $.wh)) {
      ty = mh;
    } else if ((this.y > mh) && (this.y + mh > $.wh)) {
      ty = $.vh - ($.wh - this.y);
    }
    $.ofx = this.x - tx;
    $.ofy = this.y - ty;

    var anim = (this.dx === 0 && this.dy === 0) ? this.anim.idle[this.o] : this.anim.run[this.o][this.currFrame];

    $.ctxfg.save();
    //$.ctxfg.fillStyle = 'rgb(255,0,0)';
    //$.ctxfg.fillRect(tx, ty, 16, 32);
    $.ctxfg.scale(2.0, 2.0);
    $.ctxfg.drawImage(this.t, anim.x, anim.y, 8, 16, tx/2, ty/2, 8, 16);
    $.ctxfg.restore();
  };
};
