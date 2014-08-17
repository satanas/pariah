$.init = function() {
  $.input = $.Input;
  $.input.bind([32, 65, 37, 38, 39, 40]);

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

  $.hero = new $.Hero(0, 0);
  //$.walls = [new $.Wall(100, 100), new $.Wall(300, 300), new $.Wall(100, 400)];
  $.walls = [new $.Wall(100, 100)];

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
  //$.cam.setTarget($.hero);
  $.cam.ofx = $.ofx;
  $.cam.ofy = $.ofy;

  //$.walls.forEach(function(w) {
  //  var dx = Math.abs((w.x/2) - ($.hero.get().x/2));
  //  var dy = Math.abs((w.y/2) - ($.hero.get().y/2));
  //  var d = Math.sqrt((dx * dx) + (dy * dy));
  //  var r2 = w.r + $.hero.r;
  //  console.log(r2, d);
  //  if (r2 > d) {
  //    console.log('collision');
  //  }
  //});

  /* Render */
  //$.walls.forEach(function(w) {
  //  w.render();
  //});
  $.cam.render($.walls);
  $.hero.render();

  requestAnimationFrame($.loop);
};

/* Start game on load */
window.addEventListener('load', function() {
  $.init();
});
