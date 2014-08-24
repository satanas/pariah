$.Enemy = function(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.w = 16;
  this.h = 16;
  this.o = 'd'; /* Orientation */
  this.offset = {x: 0, y: 0};
  this.weakness = 1; /* Matches with cpower for 'check against': 1=Fire 2=Earth 3=Water 4=Air */
  this.collides = false; /* Defaults as false to be able to create fake enemies for first levels */
  this.level = 1; /* Level of enemy spawned. Multiply health and other indicators */ 
  this.health = 10;
  this.speed = 0.07;
  this.maxSpeed = 1.5;
  this.d = '';
  this.dx = this.dy = 0;
};
