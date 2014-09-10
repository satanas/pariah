$.init = function() {
  $.input = $.Input;
  $.input.bind([13, 65, 37, 38, 39, 40, 49, 50, 51, 52]);
  $.cfg = $.u.byId('fg');
  $.cv1 = document.createElement("canvas");
  $.cv2 = document.createElement("canvas");
  $.x = $.cfg.getContext('2d');
  $.x.s = $.x.save;
  $.x.r = $.x.restore;
  $.x.fr = $.x.fillRect;
  $.x.ft = $.x.fillText;
  $.x.d = $.x.drawImage;
  $.x.sc = $.x.scale;
  $.ctx1 = $.cv1.getContext('2d');
  $.ctx2 = $.cv2.getContext('2d');
  $.vw = $.cfg.width = $.cv1.width = $.cv2.width = 640;
  $.vh = $.cfg.height = $.cv1.height = $.cv2.height = 480;
  $.scene = new $.Scene();
  $.animId = 0;
  $.pet = 'Press Enter to ';
  $.lv = 1;
  $.he = 0;
  $.ma = 0;
  $.sco = 0; // Score
  $.ended = 0;
  $.epow = [1,2,3,4]; // Earned powers
  $.fadeIn = new $.FadeIn();
  $.fadeOut = new $.FadeOut();
  // Array of items to be placed on each level
  $.aItems = [0, [$.Key, $.FireItem], [$.EarthItem], [$.WaterItem], [$.AirItem], []];
  // Array of in-game messages
  // t: Text of message, s: showed
  $.msg = {
    'nokey': {
      t: 'You need the key to exit the dungeon',
      s: 0,
    },
    'noelem': {
      t: 'Find the element before leaving',
      s: 0
    }
  };
  $.scene.load($.welcome, $.welcomeLoop);
};

$.welcome = function() {
  $.u.v('s', true);
};

$.intro = function() {
  $.u.v('i', true);
  $.u.show('i0');
};

$.gameover = function() {
  //caf($.animId);
  $.lv = 1;
  $.epow = [];
  //$.quitScenes();
  $.u.v('g', true);
  //$.input.u();

  //$.animId = raf($.gameOverLoop);
};

$.end = function() {
  caf($.animId);
  $.lv = 1;
  $.ended = 0;
  $.epow = [];
  $.fadeOut.quit = true;
  $.quitScenes();
  $.scene = new $.Scene();
  $.u.show('e0');
  $.u.v('e', true);
  $.input.u();

  $.animId = raf($.endLoop);
};

$.welcomeLoop = function() {
  $.clearFg();
  if ($.input.r(13)) return $.scene.load($.intro, $.introLoop);

  $.scene.e = $.n() - $.scene.t;
  if ($.scene.e > 400) {
    $.scene.t = $.n();
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

  console.log($.scene);
  $.scene.e = $.n() - $.scene.t;
  if ($.scene.e >= 1800 && !$.scene.f && $.scene.s < 5) {
    $.scene.f = 1;
    $.u.fadeOut('i' + $.scene.s, function() {
      $.scene.s += 1;
      $.scene.t = $.n();
      $.scene.e = 0;
      $.scene.f = 0;
      $.u.show('i' + $.scene.s);
    });
  } else if ($.scene.e >= 5000 && $.scene.s === 5) {
    return $.startGame();
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
  if ($.input.r(13) && $.scene.e > 5000) return $.welcome();

  $.scene.e = $.n() - $.scene.t;
  if ($.scene.e >= 2000 && !$.scene.f && $.scene.s < 2) {
    $.scene.f = 1;
    $.u.fadeOut('e' + $.scene.s, function() {
      $.scene.s += 1;
      $.scene.t = $.n();
      $.scene.e = 0;
      $.scene.f = 0;
      $.u.show('e' + $.scene.s);
    });
  } else if ($.scene.e >= 5000 && !$.scene.f) {
    $.scene.f = 1;
    $.u.show('ci');
  }

  $.input.u();
  raf($.endLoop);
};

$.quitScenes = function() {
  ['s', 's1', 'i', 'g', 'e'].forEach(function(e) {
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

  if ($.lv > 1) {
    $.fow.radius = 6;
    $.hero.he = $.he;
    $.hero.ma = $.ma;
  }
  for (var i in $.epow) $.hero.pows[i] = $.epow[i];

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
      return this.map[x][y] === '#';
    };
  };
  $.lvl = new lvl();

  $.hero = new $.Hero(310, 360, 'u');
  $.exit = 0;
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
  $.u.instruction('Step on the altars and offer each element to start the ritual', 4500);
  $.animId = raf($.loop);
};

$.nextLevel = function() {
  caf($.animId);
  $.lv += 1;
  if ($.lv < 5) {
    $.he = $.hero.he;
    $.ma = $.hero.ma;
    $.startGame();
  } else {
    $.finalRoom();
  }
};

$.cleanMsg = function() {
  $.msg.nokey.s = 0;
  $.msg.noelem.s = 0;
};

$.clearFg = function(c) {
  c = c || $.C.b;
  $.x.clearRect(0, 0, $.vw, $.vh);
  $.x.fillStyle = c;
  $.x.fr(0, 0, $.vw, $.vh);
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
        $.msg[k].s = 1;
        $.u.instruction($.msg[k].t);
      }
    }
  }

  // Check conditions to win the game
  if ($.ended && $.fadeOut.done) {
    $.end();
    return;
  }

  // Check if hero is dead
  if ($.hero.dead) {
    $.scene.load($.gameover, $.gameOverLoop);
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
