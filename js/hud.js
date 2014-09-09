$.Hud = function() {
  var _ = this;
  _.ts = $.u.ts();

  _.render = function() {
    $.x.s();
    $.x.fillStyle = 'hsla(0,0%,30%,1)';
    $.x.fr(55, 5, 80, 10);
    $.x.fr(55, 20, 80, 10);
    $.x.fillStyle = $.C.w;
    $.x.fillText('HEALTH', 10, 15);
    $.x.fillText('MANA', 10, 30);

    /* Health bar */
    var v = $.hero.he * 80 / $.hero.maxH;
    $.x.fillStyle = $.HCOLOR;
    $.x.fr(55, 5, v, 10);

    /* Mana bar */
    v = $.hero.ma * 80 / $.hero.maxM;
    $.x.fillStyle = $.MCOLOR;
    $.x.fr(55, 20, v, 10);

    $.x.sc(2, 2);
    if ($.hero.key)
      $.x.d(_.ts, 0, 17, 5, 10, 72, 2.5, 5, 10);

    //$.x.d(_.ts, 18, 17, 10, 9, 100, 10, 10, 9);
    $.x.r();
  };
};
