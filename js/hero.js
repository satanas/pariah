$.Hero = function(_x, _y) {
  var _ = this;
  _.x = _x;
  _.y = _y;
  _.w = 16;
  _.h = 32;
  _.bounds = {};

  /* Max speed, max health, max mana, max cooldown, mana regen rate */
  _.maxS = 2.00;
  _.maxH = 100;
  _.maxM = 100;
  _.maxCD = 380;
  _.mRegen = 1.75; /* Per millisecond */
  _.ts = $.util.byId('tileset');

  _.s = 0.13; // Speed
  _.dx = this.dy = 0;
  _.o = 'd'; // Orientation
  _.pows = []; // Available powers
  _.hurt = false;
  _.he = this.maxH; // Health
  _.ma = this.maxM; // Mana
  _.shield = false;
  _.ctime = Date.now(); // Current time (for update)
  _.htime = Date.now(); // Hurt time
  _.etimeH = 0; // Elapsed time for hurt
  _.itime = 1000; // Invincibility time (ms)
  _.blink = false;
  _.bcount = 0; // Blinking count (to know if apply alpha during invincibility)
  _.cd = 0; // Cooldown
  _.rs = 0.15; // Resistance to attacks
  _.key = false;
  _.exit = false;
  _.dead = false;

  /* Animations */
  _.count = 0;
  _.frameDuration = 5;
  _.currFrame = 0;
  _.totalFrames = 2;
  _.anim = {
    'run': {
      'd': [{x:32, y:0},  {x:42, y:0} ],
      'u': [{x:32, y:16}, {x:42, y:16}],
      'r': [{x:32, y:32}, {x:42, y:32}],
      'l': [{x:32, y:48}, {x:42, y:48}],
    },
    'idle': {
      'd': {x:32, y:0},
      'u': {x:32, y:16},
      'r': {x:32, y:32},
      'l': {x:32, y:48}
    }
  };

  this.damage = function(e) {
    if (this.hurt || this.dead) return;
    var attack = Math.floor(e.attack - (e.attack * $.util.randInt(this.rs * 100, 0) / 100));
    this.he -= attack;
    this.hurt = true;
    this.htime = Date.now();
    this.etimeH = 0;
    $.textPops.push(new $.TextPop('-' + attack, this.x + 7, this.y - 5, 'red'));
    if (this.he <= 0) {
      this.he = 0;
      this.dead = true;
    }
  };

  this.heal = function(v) {
    this.he += v;
    this.he = $.util.range(this.he, 0, this.maxH);
    $.textPops.push(new $.TextPop('+' + v, this.x + 7, this.y - 5, 'green'));
  };

  this.charge = function(v) {
    this.ma += v;
    this.ma = $.util.range(this.ma, 0, this.maxM);
    $.textPops.push(new $.TextPop('+' + v, this.x + 7, this.y - 5, 'blue'));
  };

  this.gain = function(t) {
    console.log(t);
    if (t.c === false) {
      if (this.pows.indexOf(t.t.v) >= 0) return;
      if (t.t.v === $.PW.F.v) $.fow.radius = 6;
      this.pows.push(t.t.v);
      $.epow.push(t.t.v);
      $.util.showInstructions(['You now control the', t.t.n, 'element. Press', t.t.v, 'to use it'].join(' '));
    } else {
      if (t.t === 'k') {
        this.key = true;
        $.util.showInstructions('You got the key of this dungeon');
      } else if (t.t === 'h') {
        this.heal(10);
      } else if (t.t === 'm') {
        this.charge(10);
      }
    }
  };

  this.update = function() {
    var self = this;
    _.exit = false;
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
      this.ma -= elapsed * $.PW.W.m / 1000;
    } else {
      this.ma += elapsed * this.mRegen / 1000;
    }
    this.ma = $.util.range(this.ma, 0, this.maxM);
    this.he = $.util.range(this.he, 0, this.maxH);

    /* Summon elements */
    var cp = null;
    if ($.input.p(49) && this.pows.indexOf($.PW.F.v) >= 0) {
      cp = $.PW.F;
    } else if ($.input.p(50) && this.pows.indexOf($.PW.E.v) >= 0) {
      cp = $.PW.E;
    } else if ($.input.p(51) && this.pows.indexOf($.PW.W.v) >= 0) {
      cp = $.PW.W;
    } else if ($.input.p(52) && this.pows.indexOf($.PW.A.v) >= 0) {
      cp = $.PW.A;
    }
    if (this.cd === 0 && cp !== null) {
      if (this.ma >= cp.m && !(cp.v === $.PW.W.v && this.shield)) {
        this.ma -= cp.m;
        this.cd = this.maxCD;
        if (cp.v === $.PW.F.v) {
          $.powers.push(new $.Fire(this.x, this.y, this.o));
        } else if (cp.v === $.PW.E.v) {
          $.powers.push(new $.Earth(this.x, this.y, this.w, this.h, this.o));
        } else if (cp.v === $.PW.W.v) {
          [0, 120, 240].forEach(function(a) {
            $.powers.push(new $.Water(self.x, self.y, self.w, self.h, a));
          });
          this.shield = true;
        } else if (cp.v === $.PW.A.v) {
          $.powers.push(new $.Air(this.x, this.y, this.o));
        }
      }
    }

    // Check for collisions with walls
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
        }
      }
    });

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(self, e)) {
        self.damage(e);
      }
    });

    // Exit the level
    if ($.collide.rect(this, $.exit[0])) {
      _.exit = true;
    }

    /* Calculate animation frame */
    this.count = (this.count + 1) % this.frameDuration;
    if (this.count === (this.frameDuration - 1)) {
      this.currFrame = (this.currFrame + 1) % this.totalFrames;
    }
  };

  this.render = function(tx, ty) {
    var anim = (this.dx === 0 && this.dy === 0) ? this.anim.idle[this.o] : this.anim.run[this.o][this.currFrame];

    $.ctxfg.save();
    $.ctxfg.scale(2.0, 2.0);
    if (this.blink)
      $.ctxfg.globalAlpha = 0.3;
    $.ctxfg.drawImage(this.ts, anim.x, anim.y, 8, 16, tx/2, ty/2, 8, 16);
    $.ctxfg.restore();
  };
};
