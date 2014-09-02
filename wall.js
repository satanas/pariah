$.Wall = function(x, y, hf) {
  this.x = x;
  this.y = y;
  this.w = 32;
  this.h = 32;
  this.half = hf;
  this.t = document.getElementById('tileset');
  this.r = Math.sqrt(Math.pow(this.w/2, 2) + Math.pow(this.h/2, 2));
  var inView = 0;

  this.bounds = {
    b: (this.half === 0) ? this.y + this.h : this.y + (this.h / 2),
    t: this.y,
    l: this.x,
    r: this.x + this.w
  };

  this.render = function(tx, ty) {
    //var tx = x - $.ofx;
    //var ty = y - $.ofy;

    //if ((tx >= -w && tx < $.vw) && (ty >= -y && ty < $.vh)) {
      $.ctxfg.save();
      //$.ctxfg.fillStyle = 'rgb(131, 73, 11)';
      //$.ctxfg.fillRect(tx, ty, 32, 32);
      $.ctxfg.scale(2.0, 2.0);
      if (this.half) {
        $.ctxfg.drawImage(this.t, 0, 17, 16, 16, tx/2, ty/2, 16, 16);
      } else {
        $.ctxfg.drawImage(this.t, 0, 0, 16, 16, tx/2, ty/2, 16, 16);
      }
      $.ctxfg.restore();
    //}
  };
};
