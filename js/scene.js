$.Scene= function() {
  // Step
  this.s = 0;
  // Elapsed
  this.e = 0;
  // Current time
  this.t = Date.now();
  // Fading
  this.f = 0;
};

$.FadeIn = function() {
  this.done = true;

  this.start = function(d) {
    this.done = false;
    this.d = d; // Fade duration
    this.e = 0; // Elapsed time
    this.c = Date.now(); // Activation time
  };

  this.render = function() {
    if (this.done) return;

    this.e = Date.now() - this.c;
    if (this.e > this.d) {
      this.e = this.d;
      this.done = true;
    }
    var a = (1 - this.e / this.d).toString().substr(0, 3);
    $.ctxfg.fillStyle = "rgba(0,0,0," + a +")";
    $.ctxfg.fillRect(0, 0, $.cam.w, $.cam.h);
  };
};

$.FadeOut = function() {
  this.done = true;
  this.quit = true;

  this.start = function(d, c) {
    this.color = c || '0,0,0';
    this.done = false;
    this.quit = false;
    this.d = d; // Fade duration
    this.e = 0; // Elapsed time
    this.c = Date.now(); // Activation time
  };

  this.render = function() {
    if (this.quit) return;

    this.e = Date.now() - this.c;
    if (this.e > this.d) {
      this.e = this.d;
      this.done = true;
    }
    var a = (this.e / this.d).toString().substr(0, 3);
    $.ctxfg.fillStyle = "rgba(" + this.color + "," + a +")";
    $.ctxfg.fillRect(0, 0, $.cam.w, $.cam.h);
  };
};
