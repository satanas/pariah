$.Input = (function() {
  var pressed = {};

  document.body.addEventListener('keydown', function(e) {
    if (e.keyCode in pressed) {
      e.preventDefault();
      pressed[e.keyCode] = 1;
    }
  });

  document.body.addEventListener('keyup', function(e) {
    if (e.keyCode in pressed) {
      e.preventDefault();
      pressed[e.keyCode] = 0;
    }
  });

  return {
    isPressed: function(c) {
      return !!pressed[c];
    },
    isReleased: function(c) {
      return !pressed[c];
    },
    bind: function(keys) {
      keys.forEach(function(k){
        pressed[k] = 0;
      });
    },
  };
})();
