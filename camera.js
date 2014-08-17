$.Camera = function(_w, _h) {
  this.w = _w;
  this.h = _h;
  this.ofx = 0;
  this.ofy = 0;

  this.setTarget = function(t) {
  };

  this.transCoord = function(o) {
    return {
      x: o.x - this.ofx,
      y: o.y - this.ofy
    };
  };

  this.inView = function(o) {
    var t = this.transCoord(o);
    return ((t.x >= -o.w && t.x < this.w) && (t.y >= -o.y && t.y < this.h));
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
