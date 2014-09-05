$.Enemy = function(x, y, w, h, he, mi, vu, pt) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.he = he;
  this.maxH = he;
  this.miss = mi;
  this.vul = vu;
  this.ptime = pt || 4000; // Planted time
  this.itime = 700; // Invincibility time

  this.hurt = false;
  this.planted = false;
  this.blink = false;
  this.ctimeH = 0; // Current time for hurt
  this.ctimeP = 0; // Current time for planted
  this.etimeH = 0; // Elapsed time for hurt
  this.etimeP = 0; // Elapsed time for planted
  this.bcount = 0;
  console.log('planted time', this.ptime);

  this.getb = function() {
    return {
      b: this.y + this.h,
      t: this.y,
      l: this.x,
      r: this.x + this.w
    };
  };

  this.damage = function(p) {
    if (this.hurt) return null;

    if ($.util.canMiss(this.miss)) {
      $.textPops.push(new $.TextPop('miss', this.x, this.y - 5, 'white'));
      return 0;
    }

    var attack = p.attack;
    var color = 'yellow';

    if (p.t === $.PW.E.v) {
      if (!this.planted) {
        this.planted = true;
        this.ctimeP = Date.now();
        this.etimeP = 0;
        $.textPops.push(new $.TextPop('planted', this.x + 2, this.y - 5, color));
      }
      return;
    }

    if (p.t === this.vulnerability.t) {
      attack = Math.floor(p.attack + (p.attack * this.vulnerability.v));
      color = 'red';
    }
    this.he -= attack;
    this.hurt = true;
    this.ctimeH = Date.now();
    this.etimeH = 0;
    $.textPops.push(new $.TextPop('-' + attack, this.x + 7, this.y - 5, color));
    return attack;
  };

  this.planting = function() {
    if (this.planted) {
      this.etimeP = Date.now() - this.ctimeP;

      if (this.etimeP >= this.ptime) {
        this.planted = false;
      }
    }
  };

  this.blinking = function() {
    if (this.hurt) {
      this.etimeH = Date.now() - this.ctimeH;

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
  };

  this.die = function(i) {
    $.enemies.splice(i, 1);
  };

  // Render health bar
  this.renderBar = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'rgb(0,0,0)';
    $.ctxfg.fillRect(tx, ty - 10, 32, 5);
    $.ctxfg.fillStyle = 'rgb(255,0,0)';
    $.ctxfg.fillRect(tx, ty - 10, (this.he * 32) / this.maxH, 5);
    $.ctxfg.restore();
  };
};

$.Zombie = function(x, y) {
  $.Enemy.call(this, x, y, 32, 32, 30, 0.05, {t: $.PW.F.v, v:0.45});

  this.bounds = this.getb();
  this.attack = $.util.randInt(12, 16);

  this.update = function(i) {
    this.bounds = this.getb();

    this.blinking();
    this.planting();
    if (this.planted)
      console.log('planted');

    if (this.he <= 0)
      this.die(i);
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    if (!this.blink)
      $.ctxfg.fillStyle = 'rgb(0,150,0)';
    else
      $.ctxfg.fillStyle = 'rgba(0,150,0,0.3)';
    $.ctxfg.fillRect(tx, ty, 32, 32);
    $.ctxfg.restore();

    this.renderBar(tx, ty);
  };
};
