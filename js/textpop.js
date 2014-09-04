$.TextPop = function(text, x, y, color) {
  this.x = x;
  this.y = y;
  this.oy = y - 45;
  this.dy = 0.65;
  this.elapsed = 0;
  this.ctime = Date.now();
  this.text = text;
  this.bounds = {r:0, b:0};
  this.colors = {
    white: 'rgb(255,255,255)',
    yellow: 'rgb(255,255,0)',
    red: 'rgb(255,0,0)'
  };
  if (color === undefined)
    this.c = this.colors.white;
  else if (this.colors.hasOwnProperty(color))
    this.c = this.colors[color];
  else
    this.c = this.colors.white;

  this.update = function(i) {
    if (this.y > this.oy)
      this.y -= this.dy;
    this.elapsed = Date.now() - this.ctime;
    if (this.elapsed >= 800)
      this.die(i);
  };

  this.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = this.c;
    $.ctxfg.fillText(this.text, tx, ty);
    $.ctxfg.restore();
  };

  this.die = function(i) {
    $.textPops.splice(i, 1);
  };

};
