$.Scene= function() {
  var _ = this;
  // Step
  _.s = 0;
  // Elapsed
  _.e = 0;
  // Current time
  _.t = Date.now();
  // Fading
  _.f = 0;
};

$.FadeIn = function() {
  var _ = this;
  _.done = true;

  _.start = function(d) {
    _.done = false;
    _.d = d; // Fade duration
    _.e = 0; // Elapsed time
    _.c = Date.now(); // Activation time
  };

  _.render = function() {
    if (_.done) return;

    _.e = Date.now() - _.c;
    if (_.e > _.d) {
      _.e = _.d;
      _.done = true;
    }
    var a = (1 - _.e / _.d).toString().substr(0, 3);
    $.ctxfg.fillStyle = "rgba(0,0,0," + a +")";
    $.ctxfg.fillRect(0, 0, $.cam.w, $.cam.h);
  };
};

$.FadeOut = function() {
  var _ = this;
  _.done = true;
  _.quit = true;

  _.start = function(d, c) {
    _.color = c || '0,0,0';
    _.done = false;
    _.quit = false;
    _.d = d; // Fade duration
    _.e = 0; // Elapsed time
    _.c = Date.now(); // Activation time
  };

  _.render = function() {
    if (_.quit) return;

    _.e = Date.now() - _.c;
    if (_.e > _.d) {
      _.e = _.d;
      _.done = true;
    }
    var a = (_.e / _.d).toString().substr(0, 3);
    $.ctxfg.fillStyle = "rgba(" + _.color + "," + a +")";
    $.ctxfg.fillRect(0, 0, $.cam.w, $.cam.h);
  };
};
