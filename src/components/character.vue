<template>
  <div class="game-container">
    <div ref="gameArea" class="game-area" :style="{ backgroundImage: `url(${backgroundImg})` }">
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
        :style="{
          left: scaledX + 'px',
          bottom: scaledY + 'px',
          transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
        }"
      />

      <!-- Coins -->
      <img
        v-for="(coin, index) in coins"
        :key="index"
        :src="coinImg"
        class="coin"
        :style="{ left: scalePosX(coin.x) + 'px', bottom: scalePosY(coin.y) + 'px' }"
      />
    </div>
  </div>
</template>

<script>
import MarioSprite from '../assets/Mario-Sprite.png';
import CoinImg from '../assets/coin.png';

let floatingId = 0;
const DESIGN_WIDTH = 1800;
const DESIGN_HEIGHT = 500;

export default {
  data() {
    return {
      x: 100,
      y: 0,
      velocityY: 0,
      gravity: 1,
      isJumping: false,
      gameAreaWidth: 0,
      gameAreaHeight: 0,
      characterWidth: 100,
      characterHeight: 100,
      characterImg: MarioSprite,
      keysPressed: {},
      facing: 'right',

      coins: [],
      coinImg: CoinImg,
      score: 0,
      floatingScores: [],
      allCoinsCollected: true,
      backgroundImg: ''
    };
  },

  computed: {
    scaleX() { return this.gameAreaWidth / DESIGN_WIDTH; },
    scaleY() { return this.gameAreaHeight / DESIGN_HEIGHT; },
    scaledX() { return this.x * this.scaleX; },
    scaledY() { return this.y * this.scaleY; }
  },

  mounted() {
    this.updateGameAreaSize();
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("resize", this.updateGameAreaSize);
    this.gameLoop();
    window.characterComponent = this;
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("resize", this.updateGameAreaSize);
  },

  methods: {
    updateGameAreaSize() {
      const rect = this.$refs.gameArea.getBoundingClientRect();
      this.gameAreaWidth = rect.width;
      this.gameAreaHeight = rect.height;
    },

    scalePosX(x) { return x * this.scaleX; },
    scalePosY(y) { return y * this.scaleY; },

    handleKeyDown(e) {
      this.keysPressed[e.key] = true;
      if (e.key === "w" && !this.isJumping) {
        this.isJumping = true;
        this.velocityY = 18;
      }
    },

    handleKeyUp(e) { this.keysPressed[e.key] = false; },

    gameLoop() {
      setInterval(() => {
        const moveAmount = 10 * this.scaleX;
        if (this.keysPressed["a"]) { this.x -= moveAmount; this.facing = 'left'; }
        if (this.keysPressed["d"]) { this.x += moveAmount; this.facing = 'right'; }

        this.x = Math.max(0, Math.min(this.x, DESIGN_WIDTH - this.characterWidth));

        if (this.isJumping) {
          this.y += this.velocityY;
          this.velocityY -= this.gravity;
          if (this.y <= 0) { this.y = 0; this.isJumping = false; this.velocityY = 0; }
        }

        this.checkCoinCollision();
        this.updateFloatingScores();
      }, 16);
    },

    resetCharacter(coins = []) {
      this.x = 100;
      this.y = 0;
      this.velocityY = 0;
      this.isJumping = false;
      this.facing = 'right';
      this.coins = coins;
      this.allCoinsCollected = coins.length === 0;
    },

    checkCoinCollision() {
      if (!this.coins.length) {
        this.allCoinsCollected = true;
        return;
      }
      this.coins = this.coins.filter(coin => {
        const charLeft = this.x;
        const charRight = this.x + this.characterWidth;
        const charBottom = this.y;
        const charTop = this.y + this.characterHeight;

        const coinLeft = coin.x;
        const coinRight = coin.x + 30;
        const coinBottom = coin.y;
        const coinTop = coin.y + 30;

        const overlap = !(charRight < coinLeft || charLeft > coinRight || charTop < coinBottom || charBottom > coinTop);

        if (overlap) {
          this.score += 1;
          this.addFloatingScore(coin.x, coin.y);
          return false;
        }
        return true;
      });

      if (this.coins.length === 0) this.allCoinsCollected = true;
    },

    setCoins(coinArray) {
      this.coins = coinArray;
      this.allCoinsCollected = coinArray.length === 0;
    },

    addFloatingScore(x, y) {
      const id = floatingId++;
      this.floatingScores.push({ id, x, y, opacity: 1, frame: 0 });
    },

    updateFloatingScores() {
      this.floatingScores = this.floatingScores.map(fs => {
        fs.y += 1;
        fs.opacity -= 0.02;
        return fs;
      }).filter(fs => fs.opacity > 0);
    },

    setBackground(url) {
      this.backgroundImg = url;
    }
  }
};
</script>

<style scoped>
.game-container {
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.game-area {
  position: relative;
  top: -60px;
  width: 100%;
  max-width: 1800px;
  height: 50vw;
  max-height: 500px;
  min-width: 300px;
  min-height: 200px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.character { position: absolute; width: 100px; transition: transform 0.1s; }
.coin { position: absolute; width: 30px; transition: transform 0.1s; }
.score { position: absolute; top: 10px; right: 20px; font-size: 2vw; font-weight: bold; color: black; z-index: 1000; }
.floating-score { position: absolute; font-size: 1.5vw; font-weight: bold; color: white; text-shadow: 1px 1px 2px gray; pointer-events: none; }
</style>
