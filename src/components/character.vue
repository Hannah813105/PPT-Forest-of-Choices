<template>
  <div ref="gameArea" class="game-area">
    <img
      :src="characterImg"
      ref="character"
      class="character"
      :style="{
        left: x + 'px',
        bottom: y + 'px',
        transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
      }"
    />
  </div>
</template>

<script>
import MarioSprite from '../assets/Mario-Sprite.png';

export default {
  data() {
    return {
      x: 100,
      y: 0,
      velocityY: 0,
      gravity: 1,
      isJumping: false,
      gameAreaWidth: 0,
      characterWidth: 0,
      characterImg: MarioSprite,
      keysPressed: {},
      facing: 'right'
    };
  },

  mounted() {
    this.updateGameAreaWidth();

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("resize", this.updateGameAreaWidth);

    this.gameLoop();

    // Expose reset function globally so choices.js can call it
    window.characterComponent = this;
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("resize", this.updateGameAreaWidth);
  },

  methods: {
    updateGameAreaWidth() {
      this.gameAreaWidth = this.$refs.gameArea.getBoundingClientRect().width;
      this.characterWidth = this.$refs.character.getBoundingClientRect().width;
    },

    handleKeyDown(e) {
      this.keysPressed[e.key] = true;

      if (e.key === "w" && !this.isJumping) {
        this.isJumping = true;
        this.velocityY = 18;
      }
    },

    handleKeyUp(e) {
      this.keysPressed[e.key] = false;
    },

    gameLoop() {
      setInterval(() => {
        const moveAmount = 5;

        if (this.keysPressed["a"]) {
          this.x -= moveAmount;
          this.facing = 'left';
        }
        if (this.keysPressed["d"]) {
          this.x += moveAmount;
          this.facing = 'right';
        }

        this.x = Math.max(0, Math.min(this.x, this.gameAreaWidth - this.characterWidth));

        if (this.isJumping) {
          this.y += this.velocityY;
          this.velocityY -= this.gravity;

          if (this.y <= 0) {
            this.y = 0;
            this.isJumping = false;
            this.velocityY = 0;
          }
        }
      }, 16);
    },

    resetCharacter() {
      this.x = 100;
      this.y = 0;
      this.velocityY = 0;
      this.isJumping = false;
      this.facing = 'right';
    }
  }
};
</script>

<style>
.game-area {
  position: relative;
  width: 100%;
  max-width: 1800px;
  height: 500px;
  overflow: hidden;
  margin: 0 auto;
}

.character {
  position: absolute;
  width: 100px;
  transition: transform 0.1s;
}
</style>
