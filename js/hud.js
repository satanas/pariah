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
    $.x.s();
    /* Health bar */
    var v = $.hero.he * _.hBar.w / $.hero.maxH;
    $.x.fillStyle = 'hsla(0, 0%, 30%, 1)';
    $.x.fr(_.hBar.x, _.hBar.y, _.hBar.w, _.hBar.h);
    $.x.fillStyle = $.HCOLOR;
    $.x.fr(_.hBar.x, _.hBar.y, v, _.hBar.h);

    /* Mana bar */
    v = $.hero.ma * _.mBar.w / $.hero.maxM;
    $.x.fillStyle = 'hsla(0, 0%, 30%, 1)';
    $.x.fr(_.mBar.x, _.mBar.y, _.mBar.w, _.mBar.h);
    $.x.fillStyle = $.MCOLOR;
    $.x.fr(_.mBar.x, _.mBar.y, v, _.mBar.h);
    $.x.r();
  };
};
