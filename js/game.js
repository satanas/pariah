$.init = function() {
  $.input = $.Input;
  $.input.bind([13, 65, 37, 38, 39, 40, 49, 50, 51, 52]);
  $.cfg = $.u.byId('fg');
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
  caf($.animId);
  $.quitScenes();
  $.u.v('s', true);
  $.scene = new $.Scene();
  $.input.u();

  $.animId = raf($.welcomeLoop);
};

$.showIntro = function() {
  caf($.animId);
  $.quitScenes();
  $.u.v('i', true);
  $.scene = new $.Scene();
  $.u.show('i0');
  $.input.u();

  $.animId = raf($.introLoop);
};

$.showGameOver = function() {
  caf($.animId);
  $.lv = 1;
  $.epow = [];
  $.quitScenes();
  $.u.byId('g1').innerHTML = $.goMsg[$.u.rand(0, $.goMsg.length)];
  $.u.v('g', true);
  $.input.u();

  $.animId = raf($.gameOverLoop);
};

$.showEnd = function() {
  caf($.animId);
  $.lv = 1;
  $.ended = false;
  $.epow = [];
  $.fadeOut.quit = true;
  $.quitScenes();
  $.scene = new $.Scene();
  $.u.show('e0');
  $.u.v('e', true);
  $.input.u();

  $.animId = raf($.endLoop);
};

$.showCredits = function() {
  caf($.animId);
  $.quitScenes();
  $.scene = new $.Scene();
  $.u.v('c', true);
  $.u.hide('e2');
  $.input.u();

  $.animId = raf($.creditsLoop);
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
      $.u.v('s1', false);
    } else {
      $.scene.s = 0;
      $.u.v('s1', true);
    }
  }
  $.input.u();
  raf($.welcomeLoop);
};

$.introLoop = function() {
  $.clearFg();
  if ($.input.r(13)) return $.startGame();
  if ($.scene.s > 6) return $.startGame();

  $.scene.e = Date.now() - $.scene.t;
  if ($.scene.e >= 1800 && !$.scene.f) {
    $.scene.f = 1;
    $.u.fadeOut('i' + $.scene.s, function() {
      $.scene.s += 1;
      $.scene.t = Date.now();
      $.scene.e = 0;
      $.scene.f = 0;
      $.u.show('i' + $.scene.s);
    });
  }

  $.input.u();
  raf($.introLoop);
};

$.gameOverLoop = function() {
  $.clearFg();
  if ($.input.r(13)) return $.startGame();
  $.input.u();
  raf($.gameOverLoop);
};

$.endLoop = function() {
  $.clearFg();

  $.scene.e = Date.now() - $.scene.t;
  if ($.scene.e >= 2000 && !$.scene.f && $.scene.s < 2) {
    $.scene.f = 1;
    $.u.fadeOut('e' + $.scene.s, function() {
      $.scene.s += 1;
      $.scene.t = Date.now();
      $.scene.e = 0;
      $.scene.f = 0;
      $.u.show('e' + $.scene.s);
    });
  } else if ($.scene.s === 2) {
    setTimeout($.showCredits, 6000);
  }

  $.input.u();
  raf($.endLoop);
};

$.creditsLoop = function() {
  $.clearFg();
  if ($.input.r(13) && $.scene.f === 1) return $.showWelcome();

  $.scene.e = Date.now() - $.scene.t;
  if ($.scene.e >= 5000 && !$.scene.f) {
    $.scene.f = 1;
    $.u.show('ci');
  }

  $.input.u();
  raf($.creditsLoop);
};

$.quitScenes = function() {
  ['s', 's1', 'i', 'g', 'e', 'c'].forEach(function(e) {
      $.u.v(e, false);
  });
  $.u.hide('m1');
};


$.startGame = function() {
  $.quitScenes();

  $.walls = [];
  $.enemies = [];
  $.items = [];
  $.exit = [];
  $.textPops = [];
  $.powers = [];
  $.ai = new $.Ai();
  $.switches = [];

  // Load level
  var lf = 20,
      en = 0,
      a = 0,
      b = 0;
    a = $.u.rand(15 + (6 * $.lv), 20 + (6 * $.lv));
    b = $.u.rand(15 + (6 * $.lv), 20 + (6 * $.lv));
    //lf = 10 + (7 * $.lv);
  if ($.lv === 1) {
    $.u.instruction('Use the arrow keys to move and escape the dungeon', 4500);
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
  $.animId = raf($.loop);
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
  $.u.instruction('Offer each element on its altar to start the ritual', 4500);
  $.animId = raf($.loop);
};

$.nextLevel = function() {
  caf($.animId);
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
        $.u.instruction($.msg[k].t);
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

  raf($.loop);
};

/* Start game on load */
window.addEventListener('load', function() {
  $.init();
});
