'use strict';

var Floor = function() {
  this.h = 40;
  this.lines = [
    [null, null, null, null, null, null, null, null, null, null]
  ];

  this.sprite = game.add.sprite(0, 580, 'floor');
  game.physics.arcade.enable(this.sprite);
  this.sprite.body.immovable = true;

  this.bugSound = game.add.audio('bug');
  this.blockSound = game.add.audio('block');
  this.regularSound = game.add.audio('regular');
  this.superSound = game.add.audio('super');
  this.ultraSound = game.add.audio('ultra');
  this.rollbackSound = game.add.audio('rollback');

  groups.floor.add(this.sprite);
};

Floor.prototype.constructor = Floor;

Floor.prototype.getHeight = function() {
  var height = 640 - ((this.h * this.lines.length) + 20);
  if (height > 580) height = 580;
  return height;
};

Floor.prototype.getLineHeight = function(line) {
  return 640 - (this.h * (line + 1));
};

Floor.prototype.addBlock = function(block, player) {
  var index = null,
      position = Math.floor(block.x / 40);

  for (var i = 0; i < this.lines.length; i++) {
    if (this.lines[i][position] === null) {
      index = i;
      break;
    }
  }

  if (index === null) {
    this.lines.push([null, null, null, null, null, null, null, null, null, null]);
    index = this.lines.length - 1;
    this.sprite.y = this.getHeight();
    player.updateHeight(this);
  }

  block.settle(block.x, 640 - (40 * (index + 1)));
  if (block.isBug()) {
    this.bugSound.play();
  } else {
    this.blockSound.play();
  }
  this.lines[index][position] = block;
  return this.checkDeploy(index, player);
};

Floor.prototype.checkDeploy = function(line, player) {
  var tryDeploy = true,
      deploy = null,
      self = this;

  for (var i = 0; i < 10; i++) {
    if (this.lines[line][i] === null) {
      tryDeploy = false;
      break;
    }
  }

  if (tryDeploy) {
    // perform deploy and score
    deploy = 0;
    var bugs = 0,
        score = 0,
        app = new Application();

    for (var i = 0; i < 10; i++) {
      var block = this.lines[line][i];
      score += block.language.points;
      app.addCode(block);
    }
    app.build();
    score += app.bonus;

    var font = 'title',
        sizePoints = 32,
        sizeText = 20,
        sound = this.regularSound;
    if (app.bonus < 0) {
      font = 'rollback';
      sizePoints = 28;
      score = 'No deploy';
      sound = this.rollbackSound;
    } else {
      if (app.bonus === game.global.bonus.super) {
        font = 'super';
        sound = this.superSound;
        sizePoints = 52;
      } else if (app.bonus === game.global.bonus.ultra) {
        font = 'ultra';
        sound = this.ultraSound;
        sizePoints = 72;
      }

      game.global.score += score;
      deploy = score;

      // remove last line
      for (var i = 0; i < 10; i++) {
        var block = this.lines[line][i];
        this.emitParticles(block.x, block.y);
        block.kill();
      }

      // displace blocks
      for (var j = line; j < this.lines.length - 1; j++) {
        for (var i = 0; i < 10; i++) {
          this.lines[j][i] = this.lines[j + 1][i];
          if (this.lines[j][i] !== null) {
            this.lines[j][i].displace();
          }
        }
      }

      this.lines.pop();
      this.sprite.y = this.getHeight();
      player.updateHeight(this);
    }
    sound.play();
    var appText = bitmapTextCentered(320, font, app.name, sizeText);
    var appTween = game.add.tween(appText);
    appTween.to({y: 230, alpha: 0}, 250, Phaser.Easing.Linear.None, true, 1500);

    var scoreText = bitmapTextCentered(250, font, String(score), sizePoints);
    var scoreTween = game.add.tween(scoreText);
    scoreTween.to({y: 160, alpha: 0}, 250, Phaser.Easing.Linear.None, true, 1500);
  }
  return deploy;
};

Floor.prototype.emitParticles = function(x, y) {
  var emitter = game.add.emitter(x, y, 15);
  emitter.makeParticles('particle', 0, 25);
  emitter.minParticleSpeed.setTo(-100, -200);
  emitter.maxParticleSpeed.setTo(50, 100);
  //emitter.angularDrag = 10;
  emitter.start(true, 1000, null, 5);
};
