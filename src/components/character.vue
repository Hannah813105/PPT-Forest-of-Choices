<template>
  <div class="game-container">
    <div
      ref="gameArea"
      class="game-area"
      :style="{ backgroundImage: `url(${backgroundImg})` }"
    >
      <!-- Score -->
      <div class="score">Score: {{ score }}</div>

      <!-- Floating +1 -->
      <div
        v-for="fs in floatingScores"
        :key="fs.id"
        class="floating-score"
        :style="{ left: scalePosX(fs.x)+'px', bottom: scalePosY(fs.y)+'px', opacity: fs.opacity }"
      >
        +1
      </div>

      <!-- Obstacles -->
      <img
        v-for="(obs, i) in obstacles"
        :key="i"
        class="obstacle"
        :src="obs.image"
        :style="{
          left: scalePosX(obs.x) + 'px',
          bottom: scalePosY(obs.y) + 'px',
          width: scalePosX(obs.width) + 'px',
          height: scalePosY(obs.height) + 'px'
        }"
      />

      <!-- Coins -->
      <img
        v-for="(coin, i) in coins"
        :key="i"
        class="coin"
        :src="coinImg"
        :style="{ left: scalePosX(coin.x)+'px', bottom: scalePosY(coin.y)+'px' }"
      />

      <!-- Character -->
      <img
        ref="character"
        :src="characterImg"
        class="character"
        :style="{
          left: scaledX + 'px',
          bottom: scaledY + 'px',
          transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
        }"
      />

      <!-- Final Score Display -->
      <div v-if="finalScore !== null" class="final-score">
        Final Score: {{ finalScore }}
      </div>
    </div>
  </div>
</template>

<script>
import IdleSprite from "../assets/SpriteIdle.png";
import RunSprite from "../assets/SpriteRun.png";
import CoinImg from "../assets/coin.png";

const DESIGN_WIDTH = 1800;
const DESIGN_HEIGHT = 550;
let floatingId = 0;

export default {
  data() {
    return {
      x: 800,
      y: 40,
      keysPressed: {},
      facing: "right",
      isMoving: false,

      gameAreaWidth: 0,
      gameAreaHeight: 0,

      characterWidth: 100,
      characterHeight: 120,

      idleSprite: IdleSprite,
      runSprite: RunSprite,

      coinImg: CoinImg,
      backgroundImg: "",

      coins: [],
      obstacles: [],
      score: 0,
      floatingScores: [],
      allCoinsCollected: true,

      finalScore: null, // new property for final score
    };
  },

  computed: {
    scaleX() { return this.gameAreaWidth / DESIGN_WIDTH; },
    scaleY() { return this.gameAreaHeight / DESIGN_HEIGHT; },
    scaledX() { return this.x * this.scaleX; },
    scaledY() { return this.y * this.scaleY; },

    // Sprite switching logic
    characterImg() {
      return this.isMoving ? this.runSprite : this.idleSprite;
    }
  },

  mounted() {
    this.updateGameAreaSize();

    window.addEventListener("keydown", e => this.keysPressed[e.key] = true);
    window.addEventListener("keyup", e => this.keysPressed[e.key] = false);
    window.addEventListener("resize", this.updateGameAreaSize);

    this.gameLoop();
    window.characterComponent = this;
  },

  methods: {
    updateGameAreaSize() {
      const rect = this.$refs.gameArea.getBoundingClientRect();
      this.gameAreaWidth = rect.width;
      this.gameAreaHeight = rect.height;
    },

    scalePosX(v) { return v * this.scaleX; },
    scalePosY(v) { return v * this.scaleY; },

    gameLoop() {
      setInterval(() => {
        const speed = 8;

        let nextX = this.x;
        let nextY = this.y;
        let moved = false;

        if (this.keysPressed["a"]) { nextX -= speed; this.facing = "left"; moved = true; }
        if (this.keysPressed["d"]) { nextX += speed; this.facing = "right"; moved = true; }
        if (this.keysPressed["w"]) { nextY += speed; moved = true; }
        if (this.keysPressed["s"]) { nextY -= speed; moved = true; }

        this.isMoving = moved;

        nextX = Math.max(0, Math.min(nextX, DESIGN_WIDTH - this.characterWidth));
        nextY = Math.max(0, Math.min(nextY, DESIGN_HEIGHT - this.characterHeight));

        if (!this.collides(nextX, this.y)) this.x = nextX;
        if (!this.collides(this.x, nextY)) this.y = nextY;

        this.checkCoinCollision();
        this.updateFloatingScores();
      }, 16);
    },

    collides(nx, ny) {
      return this.obstacles.some(o =>
        !(nx + this.characterWidth < o.x ||
          nx > o.x + o.width ||
          ny + this.characterHeight < o.y ||
          ny > o.y + o.height)
      );
    },

    checkCoinCollision() {
      this.coins = this.coins.filter(c => {
        const hit = !(
          this.x + this.characterWidth < c.x ||
          this.x > c.x + 30 ||
          this.y + this.characterHeight < c.y ||
          this.y > c.y + 30
        );

        if (hit) {
          this.score++;
          this.floatingScores.push({ id: floatingId++, x: c.x, y: c.y, opacity: 1 });
        }
        return !hit;
      });
      this.allCoinsCollected = this.coins.length === 0;
    },

    updateFloatingScores() {
      this.floatingScores = this.floatingScores
        .map(f => ({ ...f, y: f.y + 1, opacity: f.opacity - 0.02 }))
        .filter(f => f.opacity > 0);
    },

    resetCharacter(coins = []) {
      this.x = 800;
      this.y = 40;
      this.coins = coins;
      this.allCoinsCollected = coins.length === 0;
      this.isMoving = false;
    },

    setObstacles(obs = []) { this.obstacles = obs; },
    setBackground(url) { this.backgroundImg = url; },
    resetScore() { this.score = 0; },
    showFinalScore() { this.finalScore = this.score; },
    hideFinalScore() { this.finalScore = null; }
  }
};
</script>

<style scoped>
.game-container {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-area {
  width: 100%;
  max-width: 1800px;
  height: 50vw;
  max-height: 550px;
  position: relative;
  top: -50px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.character { position: absolute; width: 100px; }
.coin { position: absolute; width: 30px; }
.obstacle { position: absolute; pointer-events: none; }
.score { position: absolute; top: 10px; right: 20px; font-weight: bold; font-size: 18px; }
.floating-score { position: absolute; font-weight: bold; color: white; }


.final-score {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  font-size: 3vw;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px black;
}
</style>
