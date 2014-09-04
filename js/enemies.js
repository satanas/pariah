$.Zombie = function(x, y) {
  this.x = x;
  this.y = y;
  this.w = 32;
  this.h = 32;
  this.bounds = {};
  this.he = 30;
  this.maxH = 30;
  this.vulnerability = 0.45;
  this.missingChance = 0.05;
  this.hurt = false;
  this.ctime = 0;
  this.elapsed = 0;
  this.iTime = 1000; // Invincibility time
  this.blink = false;
  this.bCount = 0;
  this.attack = $.util.randInt(12, 16);

  this.damage = function(p) {
    if (this.hurt) return;
    if ($.util.canMiss(this.missingChance)) {
      $.textPops.push(new $.TextPop('miss', this.x, this.y - 5, 'white'));
      return;
    }
    var attack = p.attack;
    if (p.type == 'f')
      attack = Math.floor(p.attack + (p.attack * this.vulnerability));
    this.he -= attack;
    this.hurt = true;
    this.ctime = Date.now();
    this.elapsed = 0;
    $.textPops.push(new $.TextPop(attack, this.x + 6, this.y - 5, 'yellow'));
  };

  this.update = function(i) {
    this.bounds = {
      b: this.y + this.h,
      t: this.y,
      l: this.x,
      r: this.x + this.w
    };

    if (this.hurt) {
      this.elapsed = Date.now() - this.ctime;

      var c = Math.floor(this.elapsed / 100);
      if (c > this.bCount) {
        this.bCount = c;
        this.blink = !this.blink;
      }

      if (this.elapsed >= this.iTime) {
        this.hurt = false;
        this.bCount = 0;
        this.blink = false;
      }
    }

    if (this.he <= 0)
      this.die(i);
  };

  this.die = function(i) {
    $.enemies.splice(i, 1);
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    if (!this.blink)
      $.ctxfg.fillStyle = 'rgb(0,150,0)';
    else
      $.ctxfg.fillStyle = 'rgba(0,150,0,0.3)';
    $.ctxfg.fillRect(tx, ty, 32, 32);
    $.ctxfg.restore();

    // Render health bar
    $.ctxfg.save();
    $.ctxfg.fillStyle = 'rgb(0,0,0)';
    $.ctxfg.fillRect(tx, ty - 10, 32, 5);
    $.ctxfg.fillStyle = 'rgb(255,0,0)';
    $.ctxfg.fillRect(tx, ty - 10, (this.he * 32) / this.maxH, 5);
    $.ctxfg.restore();

  };
};
