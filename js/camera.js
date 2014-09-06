$.Camera = function(vw, vh, ww, wh) {
  this.w = vw; // Viewport width
  this.h = vh; // Viewport height
  this.ww = ww; // World width
  this.wh = wh; // World height
  this.ofx = 0;
  this.ofy = 0;
  this.tg = null;

  this.setTarget = function(t) {
    this.tg = t;
  };

  this.transCoord = function(o) {
    return {
      x: o.x - this.ofx,
      y: o.y - this.ofy,
      r: o.bounds.r - this.ofx,
      b: o.bounds.b - this.ofy
    };
  };

  this.inView = function(o) {
    var t = this.transCoord(o);
    return ((t.r >= 0 && t.r <= this.w) || (t.x >= 0 && t.x <= this.w)) &&
           ((t.b >= 0 && t.b <= this.h) || (t.y >= 0 && t.y <= this.h));
  };

  this.update = function() {
    // Update offset according the target
    var tx, ty = 0;
    var mw = this.w / 2;
    var mh = this.h / 2;
    if (this.ww <= this.w) {
      tx = this.tg.x;
    } else if (this.tg.x <= (mw)) {
      tx = this.tg.x;
    } else if ((this.tg.x > mw) && (this.tg.x + mw <= this.ww)) {
      tx = mw;
    } else if ((this.tg.x > mw) && (this.tg.x + mw > this.ww)) {
      tx = this.w - (this.ww - this.tg.x);
    }

    if (this.wh <= this.h) {
      tx = this.tg.y;
    } else if (this.tg.y <= (mh)) {
      ty = this.tg.y;
    } else if ((this.tg.y > mh) && (this.tg.y + mh <= this.wh)) {
      ty = mh;
    } else if ((this.tg.y > mh) && (this.tg.y + mh > this.wh)) {
      ty = this.h - (this.wh - this.tg.y);
    }
    this.ofx = this.tg.x - tx;
    this.ofy = this.tg.y - ty;
  };

  this.render = function(objs) {
    var self = this;
    objs.forEach(function(o) {
      if (self.inView(o)) {
        var t = self.transCoord(o);
        o.render(t.x, t.y);
      }
    });
  };
};
