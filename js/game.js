$.init = function() {
  $.input = $.Input;
  $.input.bind([13, 65, 37, 38, 39, 40, 49, 50, 51, 52]);
  $.cfg = $.util.byId('fg');
  $.cv1 = document.createElement("canvas");
  $.cv2 = document.createElement("canvas");
  // Game over messages
  $.goMsg = ['Oh, the humanity!', 'That\'s all folks', 'We\'re doomed!', 'And there goes the humanity'];
  $.scene = new $.Scene();
  $.animId = 0;
  $.lv = 1;
  $.epow = []; // Earned powers
  // Array of items to be placed on each level
  $.aItems = [null, [$.Key, $.FireItem], [$.EarthItem], [$.WaterItem], [$.AirItem], []];
  // Array of in-game messages
  // t: Text of message, s: showed
  $.msg = {
    'nokey': {
      t: 'You need the key to exit the dungeon',
      s: false,
    },
    'noelem': {
      t: 'You need to find the element before leaving',
      s: false
    }
  };
  $.showWelcome();
};

$.showWelcome = function() {
  cancelAnimationFrame($.animId);
  $.input.u();
  $.quitScenes();
  $.util.visible('s', true);
  $.scene = new $.Scene();

  $.animId = requestAnimationFrame($.welcomeLoop);
};

$.showIntro = function() {
  cancelAnimationFrame($.animId);
  $.input.u();
  $.quitScenes();
  $.util.visible('i', true);
  $.scene = new $.Scene();
  $.util.show('i0');

  $.animId = requestAnimationFrame($.introLoop);
};

$.showGameOver = function() {
  cancelAnimationFrame($.animId);
  $.lv = 1;
  $.epow = [];
  $.input.u();
  $.quitScenes();
  $.util.byId('g1').innerHTML = $.goMsg[$.util.randInt(0, $.goMsg.length)];
  $.util.visible('g', true);

  $.animId = requestAnimationFrame($.gameOverLoop);
};

$.welcomeLoop = function() {
  if ($.input.r(13)) return $.showIntro();

  $.scene.e = Date.now() - $.scene.t;
  if ($.scene.e > 400) {
    $.scene.t = Date.now();
    $.scene.e = 0;
    if ($.scene.s === 0) {
      $.scene.s = 1;
      $.util.visible('s1', false);
    } else {
      $.scene.s = 0;
      $.util.visible('s1', true);
    }
  }
  $.input.u();
  requestAnimationFrame($.welcomeLoop);
};

$.introLoop = function() {
  if ($.input.r(13)) return $.startGame();
  if ($.scene.s > 6) return $.startGame();

  $.scene.e = Date.now() - $.scene.t;
  if ($.scene.e >= 1800 && !$.scene.f) {
    $.scene.f = 1;
    $.util.fadeOut('i' + $.scene.s, function() {
      $.scene.s += 1;
      $.scene.t = Date.now();
      $.scene.e = 0;
      $.scene.f = 0;
      $.util.show('i' + $.scene.s);
    });
  }

  $.input.u();
  requestAnimationFrame($.introLoop);
};

$.gameOverLoop = function() {
  if ($.input.r(13)) return $.startGame();
  $.input.u();
  requestAnimationFrame($.gameOverLoop);
};

$.quitScenes = function() {
  ['s', 's1', 'i', 'g'].forEach(function(e) {
      $.util.visible(e, false);
  });
};


$.startGame = function() {
  $.quitScenes();
  $.ctxfg = $.cfg.getContext('2d');
  $.ctx1 = $.cv1.getContext('2d');
  $.ctx2 = $.cv2.getContext('2d');
  $.vw = $.cfg.width = $.cv1.width = $.cv2.width = 640;
  $.vh = $.cfg.height = $.cv1.height = $.cv2.height = 480;

  $.walls = [];
  $.enemies = [];
  $.items = [];
  $.exit = [];
  $.textPops = [];
  $.powers = [];
  $.ai = new $.Ai();

  // Load level
  var lf = 10,
      en = 0,
      a = 0,
      b = 0;
    a = $.util.randInt(15 + (6 * $.lv), 20 + (6 * $.lv));
    b = $.util.randInt(15 + (6 * $.lv), 20 + (6 * $.lv));
    lf = 10 + (7 * $.lv);
  if ($.lv === 1) {
    $.util.showInstructions('Use the arrow keys to move');
  } else {
    en = $.lv * 3;
  }
  $.ww = a * 32;
  $.wh = b * 32;
  $.lvl = new $.Level($.lv, $.ww / 32, $.wh / 32, en, $.aItems[$.lv], lf);

  $.fow = new $.FoW(3);
  $.cam = new $.Camera(640, 480, $.ww, $.wh);
  $.cam.setTarget($.hero);
  $.collide = new $.Collide();
  $.hud = new $.Hud();

  if ($.lv > 1)
    $.fow.radius = 6;
  $.hero.pows = $.epow;

  // Load the walls
  for (var v=0; v<$.lvl.h; v++) {
    for (i=0; i<$.lvl.w; i++) {
      if ($.lvl.isWall(i, v))
        $.walls.push(new $.Wall(i*32, v*32));
    }
  }

  $.animId = requestAnimationFrame($.loop);
  console.log('walls', $.walls.length);
};

$.nextLevel = function() {
  cancelAnimationFrame($.animId);
  $.lv += 1;
  console.log('next level');
  if ($.lv < 6) {
    $.startGame();
  } else {
    $.lv = 1;
    // Mostrar la pantalla de final
    $.showGameOver();
  }
};

$.cleanMsg = function() {
  $.msg.nokey.s = false;
  $.msg.noelem.s = false;
};

$.clearFg = function() {
  $.ctxfg.clearRect(0, 0, $.vw, $.vh);
  $.ctxfg.fillStyle = 'hsl(326, 18%, 25%)';
  $.ctxfg.fillRect(0, 0, $.vw, $.vh);
};

$.loop = function() {
  $.clearFg();

  /* Update */
  $.hero.update();
  $.powers.forEach(function(p, i) {
    p.update(i);
  });
  $.enemies.forEach(function(e, i) {
    e.update(i);
  });
  $.textPops.forEach(function(t, i) {
    t.update(i);
  });
  $.items.forEach(function(t, i) {
    t.update(i);
  });
  var fow = $.fow.update();
  $.cam.update(); // Always the last to be updated


  // Check is conditions are ready for the next level
  if ($.hero.exit) {
    if ($.hero.key && $.hero.pows.indexOf($.lv) >= 0) {
      $.nextLevel();
      return;
    } else {
      var k = 0;
      if (!$.hero.key) {
        k = 'nokey';
      } else if ($.hero.pows.indexOf($.lv) < 0) {
        k = 'noelem';
      }
      if (!$.msg[k].s) {
        $.msg[k].s = true;
        $.util.showInstructions($.msg[k].t);
      }
    }
  }

  // Check if hero is dead
  if ($.hero.dead) {
    $.showGameOver();
    return;
  }

  /* Render */
  $.cam.render($.walls);
  $.cam.render($.exit);
  $.cam.render($.enemies);
  $.cam.render($.items);
  $.cam.render([$.hero]);
  $.cam.render($.powers);
  $.fow.render();
  $.cam.render($.textPops);
  $.hud.render();

  requestAnimationFrame($.loop);
};

/* Start game on load */
window.addEventListener('load', function() {
  $.init();
});
