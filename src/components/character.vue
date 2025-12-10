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
        :style="{ left: scalePosX(coin.x) + 'px', bottom: scalePosY(coin.y) + 'px' }"
      />

      <!-- Final Score Overlay -->
      <div v-if="showFinalScore" class="final-score-overlay">
        Final Score: {{ score }}
      </div>
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
      allCoinsCollected: true,
      showFinalScore: false
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

    handleKeyDown(e) { this.keysPressed[e.key] = true; },
    handleKeyUp(e) { this.keysPressed[e.key] = false; },

    gameLoop() {
      setInterval(() => {
        const moveAmount = 10;

        // Horizontal
        if (this.keysPressed["a"]) this.x -= moveAmount, this.facing = "left";
        if (this.keysPressed["d"]) this.x += moveAmount, this.facing = "right";

        // Vertical
        if (this.keysPressed["w"]) this.y += moveAmount;
        if (this.keysPressed["s"]) this.y -= moveAmount;

        // Boundaries
        this.x = Math.max(0, Math.min(this.x, DESIGN_WIDTH - this.characterWidth));
        this.y = Math.max(0, Math.min(this.y, DESIGN_HEIGHT - this.characterHeight));

        this.checkCoinCollision();
        this.updateFloatingScores();
      }, 16);
    },

resetCharacter(coins = [], resetScore = false) {
  this.x = 800;
  this.y = 20;
  this.setCoins(coins);
  this.showFinalScore = false;

  if (resetScore) this.score = 0;
},

    checkCoinCollision() {
      if (!this.coins.length) {
        this.allCoinsCollected = true;
        return;
      }

      this.coins = this.coins.filter((coin) => {
        const charL = this.x;
        const charR = this.x + this.characterWidth;
        const charB = this.y;
        const charT = this.y + this.characterHeight;

        const coinL = coin.x;
        const coinR = coin.x + 30;
        const coinB = coin.y;
        const coinT = coin.y + 30;

        const overlap = !(charR < coinL || charL > coinR || charT < coinB || charB > coinT);

        if (overlap) {
          this.score++;
          this.addFloatingScore(coin.x, coin.y);
          return false;
        }
        return true;
      });

      this.allCoinsCollected = this.coins.length === 0;
    },

    setCoins(coinArray) {
      this.coins = coinArray;
      this.allCoinsCollected = coinArray.length === 0;
    },

    addFloatingScore(x, y) {
      this.floatingScores.push({ id: floatingId++, x, y, opacity: 1 });
    },

    updateFloatingScores() {
      this.floatingScores = this.floatingScores.map(fs => {
        fs.y += 1; fs.opacity -= 0.02; return fs;
      }).filter(fs => fs.opacity > 0);
    },

    setBackground(url) { this.backgroundImg = url; },

    displayFinalScore() { this.showFinalScore = true; },
    hideFinalScore() { this.showFinalScore = false; }
  }
};
</script>

<style scoped>
.game-container { 
  display: flex; 
  position: absolute; 
  left:0; 
  top:0; 
  justify-content:center; 
  align-items:center; 
  width:100vw; 
  height:100vh; 
}

.game-area { 
  position: relative; 
  top: -60px; 
  width: 100%; 
  max-width: 1800px; 
  height:50vw; 
  max-height:500px; 
  min-width:300px; 
  min-height:200px; 
  overflow:hidden; 
  background-size: cover; 
  background-position:center; 
}

.character { 
  position:absolute; 
  width:100px; 
}

.coin { 
  position:absolute; 
  width:30px; 
}

.score { 
  position:absolute; 
  top:10px; 
  right:20px; 
  font-size:2vw; 
  font-weight:600; 
  color:black; 
}

.floating-score { 
  position: absolute; 
  font-size: 1.5vw; 
  color:white; 
}

.final-score-overlay {
  position: absolute; 
  top:20%; 
  left:50%; 
  transform:translate(-50%,-50%);
  font-size:2vw; 
  font-weight:bold; 
  color:white; 
  text-shadow:2px 2px 5px black;
  background-color: rgba(0,0,0,0.5); 
  padding:10px 20px; 
  border-radius:15px; 
  text-align:center; 
  z-index:2000;
}
</style>
