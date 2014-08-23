$.Hero = function(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.w = 16;
  this.h = 32;
  this.bounds = {};
  this.d = '';
  this.speed = 0.13;
  this.dx = this.dy = 0;
  this.o = 'd'; /* Orientation*/
  this.casting = false;
  this.cooldown = 0;
  this.ctime = Date.now(); /* Current time */
  this.cpower = 1; /* 1=Fire 2=Earth 3=Water 4=Air */
  this.health = 70;
  this.mana = 98;
  this.shield = false;

  /* Max values */
  this.maxSpeed = 2.00;
  this.maxHealth = 100;
  this.maxMana = 100;

  this.r = Math.sqrt(Math.pow(this.w/2, 2) + Math.pow(this.h/2, 2));

  this.update = function() {
    var now = Date.now();
    var elapsed = now - this.ctime;
    this.ctime = now;

    if ($.input.isPressed(37)) {
      this.o = 'l';
      this.dx -= this.speed;
    } else if ($.input.isPressed(39)) {
      this.o = 'r';
      this.dx += this.speed;
    }

    if ($.input.isPressed(38)) {
      this.o = 'u';
      this.dy -= this.speed;
    } else if ($.input.isPressed(40)) {
      this.o = 'd';
      this.dy += this.speed;
    }

    if ($.input.isPressed(49)) {
      this.cpower = 1;
    } else if ($.input.isPressed(50)) {
      this.cpower = 2;
    } else if ($.input.isPressed(51)) {
      this.cpower = 3;
    } else if ($.input.isPressed(52)) {
      this.cpower = 4;
    }

    this.dx = $.util.checkRange(this.dx, -this.maxSpeed, this.maxSpeed);
    this.dy = $.util.checkRange(this.dy, -this.maxSpeed, this.maxSpeed);

    if ($.input.isReleased(37) && $.input.isReleased(39)) {
      this.dx = 0;
    }
    if ($.input.isReleased(38) && $.input.isReleased(40)) {
      this.dy = 0;
    }

    if (this.cooldown > 0) {
      this.cooldown -= elapsed;
      if (this.cooldown <= 0) {
        this.cooldown = 0;
      }
    }

    /* Regeneration */
    this.mana += elapsed * $.MANA_REGEN / 1000;
    this.mana = $.util.checkRange(this.mana, 0, this.maxMana);
    if (this.shield) {
      this.health += elapsed * $.HEALTH_REGEN / 1000;
      this.health = $.util.checkRange(this.health, 0, this.maxHealth);
    }

    /* Summon elements */
    if ($.input.isPressed(32) && this.cooldown === 0) {
      if (this.mana >= $.MANA_USAGE[this.cpower]) {
        if (this.cpower === 1) {
          $.powerGrp.push(new $.Fire(this.x, this.y, this.o));
        } else if (this.cpower === 2) {
          $.powerGrp.push(new $.Earth(this.x, this.y, this.w, this.h, this.o));
        } else if (this.cpower === 3) {
          $.powerGrp.push(new $.Water(this.x, this.y, this.w, this.h, 0));
          $.powerGrp.push(new $.Water(this.x, this.y, this.w, this.h, 120));
          $.powerGrp.push(new $.Water(this.x, this.y, this.w, this.h, 240));
          this.shield = true;
        } else if (this.cpower === 4) {
          $.powerGrp.push(new $.Air(this.x, this.y, this.o));
        }
        this.mana -= $.MANA_USAGE[this.cpower];
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

    $.ctxfg.save();
    $.ctxfg.fillStyle = 'rgb(255,0,0)';
    $.ctxfg.fillRect(tx, ty, 16, 32);
    $.ctxfg.restore();
  };
};
