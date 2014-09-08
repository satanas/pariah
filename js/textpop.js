$.TextPop = function(text, x, y, color) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.oy = y - 45;
  _.dy = 0.65;
  _.elapsed = 0;
  _.ctime = Date.now();
  _.text = text;
  _.bounds = {r:0, b:0};
  _.colors = {
    white: 'rgb(255,255,255)',
    yellow: 'rgb(255,255,0)',
    red: 'rgb(255,0,0)',
    green: $.HCOLOR,
    blue: $.MCOLOR
  };
  if (color === undefined)
    _.c = _.colors.white;
  else if (_.colors.hasOwnProperty(color))
    _.c = _.colors[color];
  else
    _.c = _.colors.white;

  _.update = function(i) {
    if (_.y > _.oy)
      _.y -= _.dy;
    _.elapsed = Date.now() - _.ctime;
    if (_.elapsed >= 800)
      _.die(i);
  };

  _.render = function(tx, ty) {
    $.ctxfg.save();
    $.ctxfg.fillStyle = _.c;
    $.ctxfg.fillText(_.text, tx, ty);
    $.ctxfg.restore();
  };

  _.die = function(i) {
    $.textPops.splice(i, 1);
  };

};
