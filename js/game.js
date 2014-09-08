$.init = function() {
  $.input = $.Input;
  $.input.bind([13, 65, 37, 38, 39, 40, 49, 50, 51, 52]);
  $.cfg = $.util.byId('fg');
  $.cv1 = document.createElement("canvas");
  $.cv2 = document.createElement("canvas");
  $.ctxfg = $.cfg.getContext('2d');
  $.ctx1 = $.cv1.getContext('2d');
  $.ctx2 = $.cv2.getContext('2d');
  $.vw = $.cfg.width = $.cv1.width = $.cv2.width = 640;
  $.vh = $.cfg.height = $.cv1.height = $.cv2.height = 480;
  // Game over messages
  $.goMsg = ['Oh, the humanity!', 'That\'s all folks', 'We\'re doomed!', 'And there goes the humanity'];
  $.scene = new $.Scene();
  $.animId = 0;
  $.lv =1;
  $.ended = false;
  $.epow = []; // Earned powers
  $.fadeIn = new $.FadeIn();
  $.fadeOut = new $.FadeOut();
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
  $.quitScenes();
  $.util.visible('s', true);
  $.scene = new $.Scene();
  $.input.u();

  $.animId = requestAnimationFrame($.welcomeLoop);
};

$.showIntro = function() {
  cancelAnimationFrame($.animId);
  $.quitScenes();
  $.util.visible('i', true);
  $.scene = new $.Scene();
  $.util.show('i0');
  $.input.u();

  $.animId = requestAnimationFrame($.introLoop);
};

$.showGameOver = function() {
  cancelAnimationFrame($.animId);
  $.lv = 1;
  $.epow = [];
  $.quitScenes();
  $.util.byId('g1').innerHTML = $.goMsg[$.util.randInt(0, $.goMsg.length)];
  $.util.visible('g', true);
  $.input.u();

  $.animId = requestAnimationFrame($.gameOverLoop);
};

$.showEnd = function() {
  $.lv = 1;
  $.ended = false;
  $.epow = [];
  cancelAnimationFrame($.animId);
  $.fadeOut.quit = true;
  $.quitScenes();
  $.scene = new $.Scene();
  $.util.show('e0');
  $.util.visible('e', true);
  $.input.u();

  $.animId = requestAnimationFrame($.endLoop);
};

$.showCredits = function() {
  cancelAnimationFrame($.animId);
  $.quitScenes();
  $.scene = new $.Scene();
  $.util.visible('c', true);
  $.util.hide('e2');
  $.input.u();

  $.animId = requestAnimationFrame($.creditsLoop);
};

$.welcomeLoop = function() {
  $.clearFg();
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
  $.clearFg();
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
  $.clearFg();
  if ($.input.r(13)) return $.startGame();
  $.input.u();
  requestAnimationFrame($.gameOverLoop);
};

$.endLoop = function() {
  $.clearFg();

  $.scene.e = Date.now() - $.scene.t;
  if ($.scene.e >= 2000 && !$.scene.f && $.scene.s < 2) {
    $.scene.f = 1;
    $.util.fadeOut('e' + $.scene.s, function() {
      $.scene.s += 1;
      $.scene.t = Date.now();
      $.scene.e = 0;
      $.scene.f = 0;
      $.util.show('e' + $.scene.s);
    });
  } else if ($.scene.s === 2) {
    setTimeout($.showCredits, 6000);
  }

  $.input.u();
  requestAnimationFrame($.endLoop);
};

$.creditsLoop = function() {
  $.clearFg();
  if ($.input.r(13) && $.scene.f === 1) return $.showWelcome();

  $.scene.e = Date.now() - $.scene.t;
  if ($.scene.e >= 5000 && !$.scene.f) {
    $.scene.f = 1;
    $.util.show('ci');
  }

  $.input.u();
  requestAnimationFrame($.creditsLoop);
};

$.quitScenes = function() {
  ['s', 's1', 'i', 'g', 'e', 'c'].forEach(function(e) {
      $.util.visible(e, false);
  });
  $.util.hide('m1');
};


$.startGame = function() {
  $.quitScenes();

  $.walls = [];
  $.enemies = [];
  $.items = [];
  $.exit = [];
  $.textPops = [];
  $.powers = [];
  $.switches = [];

  // Load level
  var lf = 20,
      en = 0,
      a = 0,
      b = 0;
    a = $.util.randInt(15 + (6 * $.lv), 20 + (6 * $.lv));
    b = $.util.randInt(15 + (6 * $.lv), 20 + (6 * $.lv));
    //lf = 10 + (7 * $.lv);
  if ($.lv === 1) {
    $.util.showInstructions('Use the arrow keys to move and escape the dungeon', 4500);
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
      if ($.lvl.isWall(i, v)) {
        var hf = ($.lvl.isWall(i, v + 1)) ? 0 : 1;
        $.walls.push(new $.Wall(i*32, v*32, hf));
      }
    }
  }

  $.fadeIn.start(1000);
  $.animId = requestAnimationFrame($.loop);
};

$.finalRoom = function() {
  $.quitScenes();

  $.walls = [];
  $.enemies = [];
  $.items = [];
  $.exit = [];
  $.textPops = [];
  $.powers = [];
  $.switches = [];

  // Load custom level
  $.ww = 640;
  $.wh = 480;
  // Make map
  var map = [];
  for (var i=0; i<$.ww/32; i++) {
    map[i] = [];
    for (var j=0; j<$.wh/32; j++){
      if (j === 0 || i === 0 || j === ($.wh / 32 - 1) || i === ($.ww / 32 - 1))
        map[i][j] = '#';
      else
        map[i][j] = '.';
    }
  }
  lvl = function(){
    this.w = $.ww / 32;
    this.h = $.wh / 32;
    this.map = map;
    this.isWall = function(x, y) {
      return (this.map[x][y] === '#') ? true : false;
    };
  };
  $.lvl = new lvl();

  $.hero = new $.Hero(310, 360, 'u');
  $.exit = null;
  $.fow = new $.FoW(8);
  $.cam = new $.Camera(640, 480, $.ww, $.wh);
  $.collide = new $.Collide();
  $.hud = new $.Hud();

  $.hero.pows = $.epow;

  // Load the walls
  for (var v=0; v<$.lvl.h; v++) {
    for (i=0; i<$.lvl.w; i++) {
      if ($.lvl.isWall(i, v)) {
        var hf = ($.lvl.isWall(i, v + 1)) ? 0 : 1;
        $.walls.push(new $.Wall(i*32, v*32, hf));
      }
    }
  }
  $.switches.push(new $.FireSwitch(112, 256));
  $.switches.push(new $.EarthSwitch(240, 256));
  $.switches.push(new $.WaterSwitch(368, 256));
  $.switches.push(new $.AirSwitch(496, 256));

  $.fadeIn.start(1000);
  $.util.showInstructions('Offer each element on its altar to start the ritual', 4500);
  $.animId = requestAnimationFrame($.loop);
};

$.nextLevel = function() {
  cancelAnimationFrame($.animId);
  $.lv += 1;
  if ($.lv < 5) {
    $.startGame();
  } else {
    $.finalRoom();
  }
};

$.cleanMsg = function() {
  $.msg.nokey.s = false;
  $.msg.noelem.s = false;
};

$.clearFg = function(c) {
  c = c || $.C.b;
  $.ctxfg.clearRect(0, 0, $.vw, $.vh);
  $.ctxfg.fillStyle = c;
  $.ctxfg.fillRect(0, 0, $.vw, $.vh);
};

$.loop = function() {
  $.clearFg($.C.f);

  // Update only when not fading
  if ($.fadeIn.done && $.fadeOut.done && !$.ended) {
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
    $.switches.forEach(function(t, i) {
      t.update(i);
    });
  }

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

  // Check conditions to win the game
  if ($.ended && $.fadeOut.done) {
    $.showEnd();
    return;
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
  $.cam.render($.switches);
  $.cam.render([$.hero]);
  $.cam.render($.powers);
  //if ($.lv < 5)
  //  $.fow.render();
  $.cam.render($.textPops);
  $.hud.render();

  $.fadeIn.render();
  $.fadeOut.render();

  requestAnimationFrame($.loop);
};

/* Start game on load */
window.addEventListener('load', function() {
  $.init();
});
