<template>
  <div ref="gameArea" class="game-area">
    <!-- Score -->
    <div class="score">Score: {{ score }}</div>

    <!-- Floating coin animations -->
    <div
      v-for="(anim, index) in floatingScores"
      :key="anim.id"
      class="floating-score"
      :style="{ left: anim.x + 'px', bottom: anim.y + 'px', opacity: anim.opacity }"
    >
      +1
    </div>

    <!-- Character -->
    <img
      :src="characterImg"
      ref="character"
      class="character"
      :style="{ left: x + 'px', bottom: y + 'px', transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }"
    />

    <!-- Coins -->
    <img
      v-for="(coin, index) in coins"
      :key="index"
      :src="coinImg"
      class="coin"
      :style="{ left: coin.x + 'px', bottom: coin.y + 'px' }"
    />
  </div>
</template>

<script>
import MarioSprite from '../assets/Mario-Sprite.png';
import CoinImg from '../assets/coin.png';

let floatingId = 0;

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
      facing: 'right',

      coins: [],
      coinImg: CoinImg,
      score: 0,

      floatingScores: [] // array for floating +1 animations
    };
  },

  mounted() {
    this.updateGameAreaWidth();
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("resize", this.updateGameAreaWidth);
    this.gameLoop();
    window.characterComponent = this;
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

        if (this.keysPressed["a"]) { this.x -= moveAmount; this.facing = 'left'; }
        if (this.keysPressed["d"]) { this.x += moveAmount; this.facing = 'right'; }

        this.x = Math.max(0, Math.min(this.x, this.gameAreaWidth - this.characterWidth));

        if (this.isJumping) {
          this.y += this.velocityY;
          this.velocityY -= this.gravity;
          if (this.y <= 0) { this.y = 0; this.isJumping = false; this.velocityY = 0; }
        }

        this.checkCoinCollision();
        this.updateFloatingScores();
      }, 16);
    },

    resetCharacter() {
      this.x = 100;
      this.y = 0;
      this.velocityY = 0;
      this.isJumping = false;
      this.facing = 'right';
      this.coins = [];
    },

    checkCoinCollision() {
      this.coins = this.coins.filter(coin => {
        const charLeft = this.x;
        const charRight = this.x + this.characterWidth;
        const charBottom = this.y;
        const charTop = this.y + 100;

        const coinLeft = coin.x;
        const coinRight = coin.x + 30;
        const coinBottom = coin.y;
        const coinTop = coin.y + 30;

        const overlap = !(charRight < coinLeft || charLeft > coinRight || charTop < coinBottom || charBottom > coinTop);

        if (overlap) {
          this.score += 1;
          this.addFloatingScore(coin.x, coin.y);
          return false; // remove coin
        }
        return true;
      });
    },

    setCoins(coinArray) {
      this.coins = coinArray;
    },

    addFloatingScore(x, y) {
      const id = floatingId++;
      this.floatingScores.push({ id, x, y, opacity: 1, frame: 0 });
    },

    updateFloatingScores() {
      // Animate floating +1
      this.floatingScores = this.floatingScores.map(fs => {
        fs.y += 1;        // move up
        fs.opacity -= 0.02; // fade out
        fs.frame++;
        return fs;
      }).filter(fs => fs.opacity > 0); // remove after fade out
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
  background: lightblue;
}

.character {
  position: absolute;
  width: 100px;
  transition: transform 0.1s;
}

.coin {
  position: absolute;
  width: 30px;
  transition: transform 0.1s;
}

.score {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  font-weight: bold;
  color: black;
  z-index: 1000;
}

.floating-score {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px gray;
  pointer-events: none;
}
</style>
