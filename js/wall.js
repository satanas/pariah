$.Wall = function(x, y, hf) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 32;
  _.h = 32;
  _.half = hf;
  _.ts = $.u.ts();

  _.bounds = {
    b: (_.half === 0) ? _.y + _.h : _.y + (_.h / 2),
    t: _.y,
    l: _.x,
    r: _.x + _.w
  };

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.scale(2.0, 2.0);
    $.ctxfg.drawImage(_.ts, 0, 0, 16, 16, tx/2, ty/2, 16, 16);
    $.ctxfg.restore();
  };
};
