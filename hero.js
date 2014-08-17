$.Hero = function() {
  var x = 0;
  var y = 0;
  var w = 16;
  var h = 32;

  return {
    update: function() {
      if ($.input.isPressed(37)) {
        x -= 2;
      }
      if ($.input.isPressed(38)) {
        y -= 2;
      }
      if ($.input.isPressed(39)) {
        x += 2;
      }
      if ($.input.isPressed(40)) {
        y += 2;
      }
      if ((x + w) > $.ww)
        x = $.ww - w;
      if ((y + h) > $.wh)
        y = $.wh - h;
      if (x < 0)
        x = 0;
      if (y < 0)
        y = 0;
    },
    render: function() {
      var tx, ty = 0;
      var mw = $.vw/2;
      var mh = $.vh/2;
      if (x <= (mw)) {
        tx = x;
      } else if ((x > mw) && (x + mw <= $.ww)) {
        tx = mw;
      } else if ((x > mw) && (x + mw > $.ww)) {
        tx = $.vw - ($.ww - x);
      }

      if (y <= (mh)) {
        ty = y;
      } else if ((y > mh) && (y + mh <= $.wh)) {
        ty = mh;
      } else if ((y > mh) && (y + mh > $.wh)) {
        ty = $.vh - ($.wh - y);
      }
      $.ofx = x - tx;
      $.ofy = y - ty;

      $.ctxfg.save();
      $.ctxfg.fillStyle = 'rgb(255,0,0)';
      $.ctxfg.fillRect(tx, ty, 16, 32);
      $.ctxfg.restore();
    }
  };
};
