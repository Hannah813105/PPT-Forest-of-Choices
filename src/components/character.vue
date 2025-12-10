<template>
  <div class="game-container">
    <div
      ref="gameArea"
      class="game-area"
      :style="{ backgroundImage: `url(${backgroundImg})` }"
    >
      <!-- Score -->
      <div class="score">Score: {{ score }}</div>

      <!-- Floating +1 animations -->
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
        :style="{
          left: scalePosX(coin.x) + 'px',
          bottom: scalePosY(coin.y) + 'px'
        }"
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
      keysPressed: {},
      facing: "right",

      // Scaling
      gameAreaWidth: 0,
      gameAreaHeight: 0,
      characterWidth: 100,
      characterHeight: 100,

      // Assets
      characterImg: MarioSprite,
      coinImg: CoinImg,
      backgroundImg: "",

      // Coins
      coins: [],
      score: 0,
      floatingScores: [],
      allCoinsCollected: true
    };
  },

  computed: {
    scaleX() {
      return this.gameAreaWidth / DESIGN_WIDTH;
    },
    scaleY() {
      return this.gameAreaHeight / DESIGN_HEIGHT;
    },
    scaledX() {
      return this.x * this.scaleX;
    },
    scaledY() {
      return this.y * this.scaleY;
    }
  },

  mounted() {
    this.updateGameAreaSize();

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("resize", this.updateGameAreaSize);

    this.gameLoop();

    // Allow choices.js to talk to this component
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

    scalePosX(x) {
      return x * this.scaleX;
    },
    scalePosY(y) {
      return y * this.scaleY;
    },

handleKeyDown(e) {
  this.keysPressed[e.key] = true;
},

handleKeyUp(e) {
  this.keysPressed[e.key] = false;
},

gameLoop() {
  setInterval(() => {
    const moveAmount = 10;

    // Horizontal movement
    if (this.keysPressed["a"]) { this.x -= moveAmount; this.facing = "left"; }
    if (this.keysPressed["d"]) { this.x += moveAmount; this.facing = "right"; }

    // Vertical movement
    if (this.keysPressed["w"]) { this.y += moveAmount; }
    if (this.keysPressed["s"]) { this.y -= moveAmount; }

    // Keep character within game area
    this.x = Math.max(0, Math.min(this.x, DESIGN_WIDTH - this.characterWidth));
    this.y = Math.max(0, Math.min(this.y, DESIGN_HEIGHT - this.characterHeight));

    this.checkCoinCollision();
    this.updateFloatingScores();
  }, 16);
},

    // RESET for new scenes
    resetCharacter(coins = []) {
      this.x = 100;
      this.y = 0;
      this.velocityY = 0;
      this.isJumping = false;
      this.facing = "right";

      this.setCoins(coins);
    },

    // REQUIRED FIX — updates allCoinsCollected correctly
    checkCoinCollision() {
      if (!this.coins.length) {
        this.allCoinsCollected = true;
        return;
      }

      let collectedAny = false;

      this.coins = this.coins.filter((coin) => {
        const charL = this.x;
        const charR = this.x + this.characterWidth;
        const charB = this.y;
        const charT = this.y + this.characterHeight;

        const coinL = coin.x;
        const coinR = coin.x + 30;
        const coinB = coin.y;
        const coinT = coin.y + 30;

        const overlap = !(
          charR < coinL ||
          charL > coinR ||
          charT < coinB ||
          charB > coinT
        );

        if (overlap) {
          collectedAny = true;
          this.score++;
          this.addFloatingScore(coin.x, coin.y);
          return false;
        }
        return true;
      });

      // IMPORTANT FIX:
      this.allCoinsCollected = this.coins.length === 0;
    },

    setCoins(coinArray) {
      this.coins = coinArray;
      this.allCoinsCollected = coinArray.length === 0;
    },

    addFloatingScore(x, y) {
      const id = floatingId++;
      this.floatingScores.push({
        id,
        x,
        y,
        opacity: 1,
        frame: 0
      });
    },

    updateFloatingScores() {
      this.floatingScores = this.floatingScores
        .map((fs) => {
          fs.y += 1;
          fs.opacity -= 0.02;
          return fs;
        })
        .filter((fs) => fs.opacity > 0);
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
  overflow: hidden;
}

.character { 
  position: absolute; 
  width: 100px; 
}

.coin { 
  position: absolute; 
  width: 30px; 
}

.score { 
  position: absolute; 
  top: 10px; 
  right: 20px; 
  font-size: 2vw; 
  color: black; 
}

.floating-score { 
  position: absolute; 
  font-size: 1.5vw; 
  color: white; 
}
</style>
