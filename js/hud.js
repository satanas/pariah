$.Hud = function() {
  this.hBar = {
    x: 10,
    y: 10,
    w: 80,
    h: 10,
  };
  this.mBar = {
    x: 10,
    y: 22,
    w: 80,
    h: 10,
  };

  this.render = function() {
    $.ctxfg.save();
    /* Health bar */
    var v = $.hero.he * this.hBar.w / $.hero.maxH;
    $.ctxfg.fillStyle = 'hsla(0, 0%, 30%, 1)';
    $.ctxfg.fillRect(this.hBar.x, this.hBar.y, this.hBar.w, this.hBar.h);
    $.ctxfg.fillStyle = 'hsla(141, 100%, 48%, 1)';
    $.ctxfg.fillRect(this.hBar.x, this.hBar.y, v, this.hBar.h);

    /* Mana bar */
    v = $.hero.ma * this.mBar.w / $.hero.maxM;
    $.ctxfg.fillStyle = 'hsla(0, 0%, 30%, 1)';
    $.ctxfg.fillRect(this.mBar.x, this.mBar.y, this.mBar.w, this.mBar.h);
    $.ctxfg.fillStyle = 'hsla(208, 100%, 48%, 1)';
    $.ctxfg.fillRect(this.mBar.x, this.mBar.y, v, this.mBar.h);
    $.ctxfg.restore();
  };
};
