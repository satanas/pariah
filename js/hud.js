$.Hud = function() {
  var _ = this;
  _.hBar = {
    x: 10,
    y: 10,
    w: 80,
    h: 10,
  };
  _.mBar = {
    x: 10,
    y: 22,
    w: 80,
    h: 10,
  };

  _.render = function() {
    $.ctxfg.save();
    /* Health bar */
    var v = $.hero.he * _.hBar.w / $.hero.maxH;
    $.ctxfg.fillStyle = 'hsla(0, 0%, 30%, 1)';
    $.ctxfg.fillRect(_.hBar.x, _.hBar.y, _.hBar.w, _.hBar.h);
    $.ctxfg.fillStyle = $.HCOLOR;
    $.ctxfg.fillRect(_.hBar.x, _.hBar.y, v, _.hBar.h);

    /* Mana bar */
    v = $.hero.ma * _.mBar.w / $.hero.maxM;
    $.ctxfg.fillStyle = 'hsla(0, 0%, 30%, 1)';
    $.ctxfg.fillRect(_.mBar.x, _.mBar.y, _.mBar.w, _.mBar.h);
    $.ctxfg.fillStyle = $.MCOLOR;
    $.ctxfg.fillRect(_.mBar.x, _.mBar.y, v, _.mBar.h);
    $.ctxfg.restore();
  };
};
