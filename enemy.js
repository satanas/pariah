$.Enemy = function(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.w = 24;
  this.h = 24;
  this.o = 'd'; /* Orientation */
  this.offset = {x: 0, y: 0};
  this.bounds = {};
  this.weakness = 1; /* Matches with cpower for 'check against': 1=Fire 2=Earth 3=Water 4=Air */
  this.collides = false; /* Defaults as false to be able to create fake enemies for first levels */
  this.level = 1; /* Level of enemy spawned. Multiply health and other indicators */ 
  this.health = 10;
  this.speed = 0.07;
  this.maxSpeed = 1.5;

  this.update = function() {
    var self = this;
    
    /* Do the chase baby! */
    if(($.hero.x < self.x) && ($.hero.y < self.y)) {
      self.x--;
      self.y--;
    } else if (($.hero.x < self.x) && ($.hero.y > self.y)){
      self.x--;
      self.y++;
    } else if (($.hero.x > self.x) && ($.hero.y < self.y)) {
      self.x++;
      self.y--;
    } else if (($.hero.x > self.x) && ($.hero.y > self.y)) {
      self.x++;
      self.y++;
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

    $.ctxfg.save();
    $.ctxfg.fillStyle = 'rgb(0,0,0)';
    $.ctxfg.fillRect(tx, ty, this.w, this.h);
    $.ctxfg.restore();
  };

};
