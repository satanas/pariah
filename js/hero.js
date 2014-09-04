$.Hero = function(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.w = 16;
  this.h = 32;
  this.bounds = {};
  this.s = 0.13; // Speed
  this.dx = this.dy = 0;
  this.o = 'd'; // Orientation
  this.pows = []; // Available powers
  this.hurt = false;
  this.he = 100; // Health
  this.ma = 98; // Mana
  this.shield = false;
  this.ctime = Date.now(); // Current time (for update)
  this.htime = Date.now(); // Hurt time
  this.etimeH = 0; // Elapsed time for hurt
  this.itime = 1000; // Invincibility time (ms)
  this.blink = false;
  this.bcount = 0; // Blinking count (to know if apply alpha during invincibility)
  this.cd = 0; // Cooldown
  this.rs = 0.15; // Resistance to attacks

  /* Max speed, max health and max mana */
  this.maxS = 2.00;
  this.maxH = 100;
  this.maxM = 100;
  this.ts = $.util.byId('tileset');

  /* Animations */
  this.count = 0;
  this.frameDuration = 5;
  this.currFrame = 0;
  this.totalFrames = 2;
  this.anim = {
    'run': {
      'd': [{x:53, y:0},  {x:69, y:0} ],
      'u': [{x:53, y:16}, {x:69, y:16}],
      'r': [{x:53, y:32}, {x:69, y:32}],
      'l': [{x:53, y:48}, {x:69, y:48}],
    },
    'idle': {
      'd': {x:53, y:0},
      'u': {x:53, y:16},
      'r': {x:53, y:32},
      'l': {x:53, y:48}
    }
  };

  this.damage = function(e) {
    if (this.hurt) return;
    //if ($.util.canMiss(this.missingChance)) {
    //  $.textPops.push(new $.TextPop('miss', this.x, this.y - 5, 'white'));
    //  return;
    //}
    var attack = Math.floor(e.attack - (e.attack * $.util.randInt(this.rs * 100, 0) / 100));
    this.he -= attack;
    this.hurt = true;
    this.htime = Date.now();
    this.etimeH = 0;
    $.textPops.push(new $.TextPop('-' + attack, this.x + 7, this.y - 5, 'red'));
  };

  this.heal = function(v) {
    this.he += v;
    $.textPops.push(new $.TextPop('+' + v, this.x + 7, this.y - 5, 'white'));
  };

  this.gain = function(t) {
    if (t in this.pows) return;
    this.pows.push(t);
    console.log('gained', t, this.pows);
  };

  this.update = function() {
    var self = this;
    var now = Date.now();
    var elapsed = now - this.ctime;
    this.ctime = now;

    if (this.hurt) {
      this.etimeH = Date.now() - this.htime;

      var c = Math.floor(this.etimeH / 100);
      if (c > this.bcount) {
        this.bcount = c;
        this.blink = !this.blink;
      }

      if (this.etimeH >= this.itime) {
        this.hurt = false;
        this.bcount = 0;
        this.blink = false;
      }
    }

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

    this.dx = $.util.range(this.dx, -this.maxS, this.maxS);
    this.dy = $.util.range(this.dy, -this.maxS, this.maxS);

    if (!$.input.p(37) && !$.input.p(39)) {
      this.dx = 0;
    }
    if (!$.input.p(38) && !$.input.p(40)) {
      this.dy = 0;
    }

    if (this.cd > 0) {
      this.cd -= elapsed;
      if (this.cd <= 0) {
        this.cd = 0;
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

    /* Regeneration */
    if (this.shield) {
      //this.he += elapsed * $.HEALTH_REGEN / 1000;
      this.ma -= elapsed * $.MANA_USAGE[3] / 1000;
    } else {
      this.ma += elapsed * $.MANA_REGEN / 1000;
    }
    this.ma = $.util.range(this.ma, 0, this.maxM);
    this.he = $.util.range(this.he, 0, this.maxH);

    /* Summon elements */
    var cp = null;
    if ($.input.p(49) && this.pows.indexOf($.PW.F) >= 0) {
      cp = $.PW.F;
    } else if ($.input.p(50) && this.pows.indexOf($.PW.E) >= 0) {
      cp = $.PW.E;
    } else if ($.input.p(51) && this.pows.indexOf($.PW.W) >= 0) {
      cp = $.PW.W;
    } else if ($.input.p(52) && this.pows.indexOf($.PW.A) >= 0) {
      cp = $.PW.A;
    }
    if (this.cd === 0 && cp !== null) {
      if (this.ma >= $.MANA_USAGE[cp] && !(cp === $.PW.W && this.shield)) {
        this.ma -= $.MANA_USAGE[cp];
        this.cd = $.POWER_COOLDOWN;
        if (cp === $.PW.F) {
          $.powerGrp.push(new $.Fire(this.x, this.y, this.o));
        } else if (cp === $.PW.E) {
          $.powerGrp.push(new $.Earth(this.x, this.y, this.w, this.h, this.o));
        } else if (cp === $.PW.W) {
          [0, 120, 240].forEach(function(a) {
            $.powerGrp.push(new $.Water(self.x, self.y, self.w, self.h, a));
          });
          this.shield = true;
        } else if (cp === $.PW.A) {
          $.powerGrp.push(new $.Air(this.x, this.y, this.o));
        }
      }
    }

    // Check for collisions
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

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(self, e)) {
        self.damage(e);
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
    if (this.blink)
      $.ctxfg.globalAlpha = 0.3;
    $.ctxfg.drawImage(this.ts, anim.x, anim.y, 8, 16, tx/2, ty/2, 8, 16);
    $.ctxfg.restore();
  };
};
