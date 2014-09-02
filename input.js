$.Input = (function() {
  var pressed = {};
  // Register the type of event (up: 1, down: -1)
  var ev = {};

  document.body.addEventListener('keydown', function(e) {
    if (e.keyCode in pressed) {
      e.preventDefault();
      ev[e.keyCode] = -1;
      pressed[e.keyCode] = 1;
    }
  });

  document.body.addEventListener('keyup', function(e) {
    if (e.keyCode in pressed) {
      e.preventDefault();
      ev[e.keyCode] = 1;
      pressed[e.keyCode] = 0;
    }
  });

  return {
    isPressed: function(c) {
      return !!pressed[c];
    },
    isReleased: function(c) {
      return ev[c] === 1;
    },
    isDown: function(c) {
      return ev[c] === -1;
    },
    update: function() {
      Object.keys(pressed).forEach(function(k){
        ev[k] = 0;
      });
    },
    bind: function(keys) {
      keys.forEach(function(k){
        pressed[k] = 0;
        ev[k] = 0;
      });
    },
  };
})();
