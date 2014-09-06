$.init = function() {
  $.input = $.Input;
  $.input.bind([13, 65, 37, 38, 39, 40, 49, 50, 51, 52]);
  $.cfg = $.util.byId('fg');
  $.cv1 = document.createElement("canvas");
  $.cv2 = document.createElement("canvas");
  // Game over messages
  $.goMsg = ['Oh, the humanity!', 'That\'s all folks', 'We\'re doomed!', 'And there goes the humanity'];
  $.scene = new $.Scene();
  $.lv = 5;
  $.showWelcome();
};

$.showWelcome = function() {
  $.input.u();
  $.quitScenes();
  $.util.visible('s', true);
  $.scene = new $.Scene();
  $.welcomeLoop();
};

$.showIntro = function() {
  $.input.u();
  $.quitScenes();
  $.util.visible('i', true);
  $.scene = new $.Scene();
  $.util.show('i0');
  $.introLoop();
};

$.showGameOver = function() {
  $.input.u();
  $.quitScenes();
  $.util.byId('g1').innerHTML = $.goMsg[$.util.randInt(0, $.goMsg.length)];
  $.util.visible('g', true);
  $.gameOverLoop();
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
  $.ofx = 0;
  $.ofy = 0;

  // Load level
  var lf = 15,
      en = 0;
  if ($.lv === 1) {
    $.ww = $.util.randInt(800, 1001);
    $.wh = $.util.randInt(800, 1001);
    lf = 10;
    $.util.showInstructions('Use the arrow keys to move');
  } else {
    $.ww = $.util.randInt(250 * $.lv, 250 * $.lv);
    $.wh = $.util.randInt(250 * $.lv, 250 * $.lv);
    lf = 10 * $.lv;
    en = $.lv * 3;
  }
  $.lvl = new $.Level($.lv, $.ww / 32, $.wh / 32, en, null, lf);

  $.fow = new $.FoW(3);
  $.cam = new $.Camera(640, 480);
  $.collide = new $.Collide();
  $.hud = new $.Hud();

  // Trick to test
  $.fow.radius = 6;

  // Load the walls
  for (var v=0; v<$.lvl.h; v++) {
    for (i=0; i<$.lvl.w; i++) {
      if ($.lvl.isWall(i, v))
        $.walls.push(new $.Wall(i*32, v*32));
    }
  }

  console.log('walls', $.walls.length);

  $.loop();
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
  //$.cam.setTarget($.hero);
  $.cam.ofx = $.ofx;
  $.cam.ofy = $.ofy;

  /* Render */
  $.cam.render($.walls);
  $.cam.render($.exit);
  $.cam.render($.enemies);
  $.cam.render($.items);
  $.hero.render();
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
