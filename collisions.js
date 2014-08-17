$.Collide = function() {
  this.rect = function(o1, o2) {
    return !((o1.bounds.b < o2.bounds.t) ||
        (o1.bounds.t > o2.bounds.b) ||
        (o1.bounds.l > o2.bounds.r) ||
        (o1.bounds.r < o2.bounds.l));
  };

  this.faces = function(o1, o2) {
    return {
      top: Math.abs(o1.bounds.b - o2.bounds.t),
      bottom: Math.abs(o1.bounds.t - o2.bounds.b),
      left: Math.abs(o1.bounds.r - o2.bounds.l),
      right: Math.abs(o1.bounds.l - o2.bounds.r)
    };
  };

  this.isTop = function(o1, o2) {
    var f = this.faces(o1, o2);
    return (f.top < f.bottom && f.top < f.left && f.top < f.right);
  };

  this.isBottom = function(o1, o2) {
    var f = this.faces(o1, o2);
    return (f.bottom < f.top && f.bottom < f.left && f.bottom < f.right);
  };

  this.isLeft = function(o1, o2) {
    var f = this.faces(o1, o2);
    return (f.left < f.bottom && f.left < f.top && f.left < f.right);
  };

  this.isRight = function(o1, o2) {
    var f = this.faces(o1, o2);
    return (f.right < f.bottom && f.right < f.left && f.right < f.top);
  };
};
