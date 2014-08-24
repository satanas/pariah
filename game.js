$.init = function() {
  $.input = $.Input;
  $.input.bind([32, 65, 37, 38, 39, 40, 49, 50, 51, 52]);

  //$.cbg = document.getElementById('bg');
  $.cfg = document.getElementById('fg');
  $.wrap = document.getElementById('wrapper');
  //$.ctxbg = $.cbg.getContext('2d');
  $.ctxfg = $.cfg.getContext('2d');
  //$.vw = $.cfg.width = $.cbg.width = 720;
  //$.vh = $.cfg.height = $.cbg.height = 540;
  $.vw = $.cfg.width = 400;
  $.vh = $.cfg.height = 400;
  $.ww = 800;
  $.wh = 800;
  $.ofx = 0;
  $.ofy = 0;
  //$.wrap.style.width = '300px';
  //$.wrap.style.height = '300px';
  $.cam = new $.Camera(400, 400);
  $.collide = new $.Collide();
  $.hud = new $.Hud();

  $.hero = new $.Hero(0, 0);
  $.enemy = new $.Enemy(150, 150);
  $.walls = [new $.Wall(100, 100), new $.Wall(300, 300), new $.Wall(100, 400)];
  $.powerGrp = [];
  //$.walls = [new $.Wall(100, 100)];

  $.loop();
};

$.clearFg = function() {
  $.ctxfg.clearRect(0, 0, $.vw, $.vh);
  $.ctxfg.fillStyle = 'rgb(190,190,190)';
  $.ctxfg.fillRect(0, 0, $.vw, $.vh);
};

$.loop = function() {
  $.clearFg();

  /* Update */
  $.hero.update();
  $.enemy.update();
  $.powerGrp.forEach(function(p, i) {
    p.update(i);
  });
  //$.cam.setTarget($.hero);
  $.cam.ofx = $.ofx;
  $.cam.ofy = $.ofy;

  /* Render */
  $.cam.render($.walls);
  $.hero.render();
  $.enemy.render();
  $.cam.render($.powerGrp);
  $.hud.render();

  requestAnimationFrame($.loop);
};

/* Start game on load */
window.addEventListener('load', function() {
  $.init();
});
