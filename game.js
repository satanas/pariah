$.init = function() {
  $.input = $.Input;
  $.input.bind([13, 32, 65, 37, 38, 39, 40, 49, 50, 51, 52]);
  $.cfg = document.getElementById('fg');
  // Game over messages
  $.goMsg = ['Oh, the humanity!', 'That\'s all folks', 'We\'re doomed!', 'And there goes the humanity'];
  $.scene = new $.Scene();

  $.showWelcome();
};

$.showWelcome = function() {
  $.input.update();
  $.quitScenes();
  document.getElementById('s').style.visibility = 'visible';
  $.scene = new $.Scene();
  $.welcomeLoop();
};

$.showIntro = function() {
  $.input.update();
  $.quitScenes();
  document.getElementById('i').style.visibility = 'visible';
  $.scene = new $.Scene();
  $.util.show('i0');
  $.introLoop();
};

$.showGameOver = function() {
  $.input.update();
  $.quitScenes();
  document.getElementById('g1').innerHTML = $.goMsg[$.util.randInt(0, $.goMsg.length)];
  document.getElementById('g').style.visibility = 'visible';
  $.gameOverLoop();
};

$.welcomeLoop = function() {
  if ($.input.isReleased(13)) return $.showIntro();

  $.scene.elapsed = Date.now() - $.scene.ctime;
  if ($.scene.elapsed > 400) {
    $.scene.ctime = Date.now();
    $.scene.elapsed = 0;
    if ($.scene.step === 0) {
      $.scene.step = 1;
      document.getElementById('s1').style.visibility = 'hidden';
    } else {
      $.scene.step = 0;
      document.getElementById('s1').style.visibility = 'visible';
    }
  }
  $.input.update();
  requestAnimationFrame($.welcomeLoop);
};

$.introLoop = function() {
  if ($.input.isReleased(13) && $.scene.step > 0) return $.startGame();
  if ($.scene.step > 7) return $.startGame();

  $.scene.elapsed = Date.now() - $.scene.ctime;
  if ($.scene.elapsed >= 1500 && !$.scene.fading) {
    $.scene.fading = 1;
    $.util.fadeOut('i' + $.scene.step, function() {
      $.scene.step += 1;
      $.scene.ctime = Date.now();
      $.scene.elapsed = 0;
      $.scene.fading = 0;
      $.util.show('i' + $.scene.step);
    });
  }

  $.input.update();
  requestAnimationFrame($.introLoop);
};

$.gameOverLoop = function() {
  if ($.input.isReleased(13)) return $.startGame();
  $.input.update();
  requestAnimationFrame($.gameOverLoop);
};

$.quitScenes = function() {
  document.getElementById('s').style.visibility = 'hidden';
  document.getElementById('s1').style.visibility = 'hidden';
  document.getElementById('i').style.visibility = 'hidden';
  document.getElementById('g').style.visibility = 'hidden';
};

$.startGame = function() {
  $.quitScenes();
  $.ctxfg = $.cfg.getContext('2d');
  $.vw = $.cfg.width = 640;
  $.vh = $.cfg.height = 480;
  $.ww = 800;
  $.wh = 800;
  $.ofx = 0;
  $.ofy = 0;
  $.cam = new $.Camera(400, 400);
  $.collide = new $.Collide();
  $.hud = new $.Hud();

  $.hero = new $.Hero(40, 50);
  $.walls = [new $.Wall(96, 96), new $.Wall(384, 384), new $.Wall(160, 416)];
  for (var i = 0; i < 5; i++) {
    $.walls.push(new $.Wall(96 + (32 * i), 96, 0));
    $.walls.push(new $.Wall(256, 96 + (32 * i), 0));
  }

  for (i = 0; i < $.ww; i++) {
    $.walls.push(new $.Wall(i * 32, 0, 1));
    $.walls.push(new $.Wall(i * 32, 800 - 32, 1));
    $.walls.push(new $.Wall(0, i * 32, 1));
    $.walls.push(new $.Wall(800 - 32, i * 32, 1));
  }

  $.powerGrp = [];

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
  $.powerGrp.forEach(function(p, i) {
    p.update(i);
  });
  //$.cam.setTarget($.hero);
  $.cam.ofx = $.ofx;
  $.cam.ofy = $.ofy;

  /* Render */
  $.cam.render($.walls);
  $.hero.render();
  $.cam.render($.powerGrp);
  $.hud.render();

  requestAnimationFrame($.loop);
};

/* Start game on load */
window.addEventListener('load', function() {
  $.init();
});
