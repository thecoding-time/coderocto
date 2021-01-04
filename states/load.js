'use strict';

var loadState = {
  preload: function() {
    bitmapTextCentered(240, 'rollback', 'Loading...', 20);

    var progressBar = game.add.sprite(100, 300, 'progressbar');
    progressBar.anchor.setTo(0, 0.5);
    game.load.setPreloadSprite(progressBar);

    // Fonts
    game.load.bitmapFont('super', 'assets/fonts/press-start-super.png', 'assets/fonts/press-start-super.fnt');
    game.load.bitmapFont('ultra', 'assets/fonts/press-start-ultra.png', 'assets/fonts/press-start-ultra.fnt');
    game.load.bitmapFont('title', 'assets/fonts/press-start-title.png', 'assets/fonts/press-start-title.fnt');
    game.load.bitmapFont('instructions', 'assets/fonts/press-start-instructions.png', 'assets/fonts/press-start-instructions.fnt');

    // Sprites
    game.load.image('title', 'assets/images/title.png');
    game.load.image('floor', 'assets/images/floor.png');
    game.load.image('particle', 'assets/images/particle.png');
    game.load.image('background', 'assets/images/background.png');
    game.load.image('poster', 'assets/images/poster.png');

    // Spritesheets
    game.load.spritesheet('octocat', 'assets/images/octocat.png', 80, 80);
    game.load.spritesheet('blocks', 'assets/images/blocks.png', 40, 40);
    game.load.spritesheet('speaker', 'assets/images/speaker.png', 48, 48);

    // Sounds
    game.load.audio('regular', 'assets/sounds/regular.wav');
    game.load.audio('super', 'assets/sounds/super.wav');
    game.load.audio('ultra', 'assets/sounds/ultra.wav');
    game.load.audio('rollback', 'assets/sounds/rollback.wav');
    game.load.audio('block', 'assets/sounds/block.wav');
    game.load.audio('bug', 'assets/sounds/bug.wav');
    game.load.audio('dead', 'assets/sounds/dead.wav');

    // BGMs
    game.load.audio('normal-bgm', 'assets/sounds/korobeiniki-normal.mp3', 0.75, true);
    game.load.audio('fast-bgm', 'assets/sounds/korobeiniki-fast.mp3', 0.75, true);
  },

  create: function() {
    game.state.start('menu');
  }
};
