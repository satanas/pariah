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
  this.itime = 300; // Invincibility time

  this.hurt = false;
  this.planted = false;
  this.blink = false;
  this.ctimeH = 0; // Current time for hurt
  this.ctimeP = 0; // Current time for planted
  this.etimeH = 0; // Elapsed time for hurt
  this.etimeP = 0; // Elapsed time for planted
  this.bcount = 0;
  this.minD = 300; // Min distance to start chasing hero
  this.hasRoute = false; // Has a valid route returned by AI
  this.route = []; // Points of route
  this.nextPoint = [];
  this.speed = 0.7;

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

    if (p.t === this.vul.t) {
      attack = Math.floor(p.attack + (p.attack * this.vul.v));
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
    // If this is the last enemy, drop the key, otherwise drop
    // something according probability
    if ($.enemies.length === 0) {
      $.items.push(new $.Key(this.x + (this.w)/2, this.y + 4));
    } else {
      if ($.util.rand(0, 10) > 4) {
        var items = [$.HealthPack, $.ManaPack];
        var k = $.util.rand(0, 2);
        $.items.push(new items[k](this.x + (this.w)/2, this.y + 4));
      }
    }
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
  this.attack = $.util.rand(12, 16);

  this.update = function(i) {
    this.bounds = this.getb();

    this.blinking();
    this.planting();
    if (this.planted)
      console.log('planted');

    if (this.he <= 0)
      this.die(i);

    if(!this.hasRoute) {
       var distance = $.ai.getDistance({x:this.x, y:this.y}, {x:$.hero.x, y:$.hero.y});
       if((distance <= this.minD) && (Math.round(distance) > 0)) {
          console.log('Get route');
          this.route = $.ai.calculatePath([Math.round(this.x / 32), Math.round(this.y / 32)], [Math.round($.hero.x / 32), Math.round($.hero.y / 32)]);
          this.hasRoute = true;
          this.nextPoint = this.route.shift();
       }
    } else {
      if((Math.round(this.x / 32) == this.nextPoint[0]) && (Math.round(this.y / 32) == this.nextPoint[1])) {
        if(this.route.length > 0) {
          this.nextPoint = this.route.shift();
        } else {
          this.hasRoute = false;
          this.route = [];
        }
      } else {
        if(Math.round(this.x / 32) < this.nextPoint[0]) {
          this.x += this.speed;
        } else if(Math.round(this.x / 32) > this.nextPoint[0]) {
          this.x -= this.speed;
        }
        if(Math.round(this.y / 32) < this.nextPoint[1]) {
          this.y += this.speed;
        } else if(Math.round(this.y / 32) > this.nextPoint[1]) {
          this.y -= this.speed;
        }
      }
    }

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
