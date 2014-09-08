$.util = {
  'fading': [],
  'instID': null,
};

// Check that v is between ll and lu
$.util.range = function(v, ll, lu) {
  if (v < ll) return ll;
  if (v > lu) return lu;
  return v;
};

$.util.fadeOut = function(i, cb) {
  $.util.fading[i] = setInterval($.util._fade, 50, i, cb);
};

// Fade out step
$.util._fade = function(i, cb) {
  var e = $.util.byId(i);
  e.style.opacity -= 0.03;
  if (e.style.opacity <= 0) {
    clearInterval($.util.fading[i]);
    $.util.fading.splice($.util.fading.indexOf(i), 1);
    if (cb !== undefined) cb();
  }
};

// Shows a DOM object putting its opacity in one
$.util.show = function(i) {
  $.util.byId(i).style.opacity = 1.0;
};

// Hides a DOM object putting its opacity in zero
$.util.hide = function(i) {
  $.util.byId(i).style.opacity = 0.0;
};

// Makes a DOM object visible or invisible
$.util.v = function(i, v) {
  $.util.byId(i).style.visibility = (v) ? 'visible' : 'hidden';
};

/* Generate random integer in a (min, max) range */
$.util.rand = function(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
};

// Returns true if there is chance to miss one attack
// Receives p (number between 0 and 1) representing the probability of success
$.util.canMiss = function(p) {
  var x = $.util.rand(1, 100);
  return (x <= Math.floor(p * 100));
};

$.util.byId = function(i) {
  return document.getElementById(i);
};

$.util.instruction = function(t, d) {
  var dx = d || 3000;
  if ($.util.instID) {
    clearTimeout($.util.instID);
    clearInterval($.util.fading.m1);
  }
  $.util.byId('m1').innerHTML = t;
  $.util.show('m1');
  $.util.instID = setTimeout(function() { $.util.fadeOut('m1', $.cleanMsg); }, dx);
};

$.util.ts = function() {
  return $.util.byId('ts');
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

window.raf = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(a){ window.setTimeout(a,1E3/60); };

window.caf = window.cancelAnimationFrame ||
  window.mozCancelAnimationFrame;
