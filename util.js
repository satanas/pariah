$.util = {
  'fading': [],
};
$.util.checkRange = function(v, ll, lu) {
  if (v < ll) return ll;
  if (v > lu) return lu;
  return v;
};

$.util.fadeOut = function(i, cb) {
  $.util.fading[i] = setInterval($.util._fadeOutStep, 50, i, cb);
};

$.util._fadeOutStep = function(i, cb) {
  var e = document.getElementById(i);
  e.style.opacity -= 0.03;
  if (e.style.opacity <= 0) {
    clearInterval($.util.fading[i]);
    $.util.fading.splice($.util.fading.indexOf(i), 1);
    cb();
  }
};

$.util.show = function(i) {
  document.getElementById(i).style.opacity = 1.0;
};

/* Generate random integer in a (min, max) range */
$.util.randInt = function(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
};

// Enable the passage of the 'this' object through the JavaScript timers

var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;

window.setTimeout = function (vCb, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCb instanceof Function ? function () {
    vCb.apply(oThis, aArgs);
  } : vCb, nDelay);
};

window.setInterval = function (vCb, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeSI__(vCb instanceof Function ? function () {
    vCb.apply(oThis, aArgs);
  } : vCb, nDelay);
};
