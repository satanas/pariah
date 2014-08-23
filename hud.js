$.Hud = function() {
  this.healthBar = {
    x: 10,
    y: 10,
    w: 80,
    h: 10,
  };
  this.manaBar = {
    x: 10,
    y: 22,
    w: 80,
    h: 10,
  };

  this.render = function() {
    $.ctxfg.save();
    /* Health bar */
    var v = $.hero.health * this.healthBar.w / $.hero.maxHealth;
    $.ctxfg.fillStyle = 'hsla(0, 0%, 30%, 1)';
    $.ctxfg.fillRect(this.healthBar.x, this.healthBar.y, this.healthBar.w, this.healthBar.h);
    $.ctxfg.fillStyle = 'hsla(141, 100%, 48%, 1)';
    $.ctxfg.fillRect(this.healthBar.x, this.healthBar.y, v, this.healthBar.h);

    /* Mana bar */
    v = $.hero.mana * this.manaBar.w / $.hero.maxMana;
    $.ctxfg.fillStyle = 'hsla(0, 0%, 30%, 1)';
    $.ctxfg.fillRect(this.manaBar.x, this.manaBar.y, this.manaBar.w, this.manaBar.h);
    $.ctxfg.fillStyle = 'hsla(208, 100%, 48%, 1)';
    $.ctxfg.fillRect(this.manaBar.x, this.manaBar.y, v, this.manaBar.h);
    $.ctxfg.restore();
  };
};
