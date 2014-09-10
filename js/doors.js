$.Entrance = function(x, y) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 32;
  _.h = 32;
  _.t = $.u.ts();

  _.bounds = {
    b: _.y + (_.h / 2),
    t: _.y,
    l: _.x,
    r: _.x + _.w
  };

  _.render = function(tx, ty) {
    $.x.s();
    $.x.sc(2, 2);
    $.x.d(_.t, 0, 0, 16, 16, tx/2, ty/2, 16, 16);
    $.x.d(_.t, 0, 49, 10, 15, tx/2 + 3, ty/2 + 1, 10, 15);
    $.x.r();
  };
};

$.Exit = function(x, y) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 32;
  _.h = 32;
  _.t = $.u.ts();

  _.bounds = {
    b: _.y + (_.h / 4),
    t: _.y,
    l: _.x,
    r: _.x + _.w
  };

  _.render = function(tx, ty) {
    $.x.s();
    $.x.sc(2, 2);
    $.x.d(_.t, 0, 0, 16, 16, tx/2, ty/2, 16, 16);
    $.x.d(_.t, 11, 49, 10, 15, tx/2 + 3, ty/2 + 1, 10, 15);
    $.x.r();
  };
};
