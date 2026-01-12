<template>
  <div class="game-container">
    <!-- Score outside game -->
    <div class="score">Score: {{ score }}</div>

    <div
      ref="gameArea"
      class="game-area"
      :style="{ backgroundImage: `url(${backgroundImg})` }"
    >
      <!-- Floating scores -->
      <div
        v-for="fs in floatingScores"
        :key="fs.id"
        class="floating-score"
        :style="{
          left: scalePosX(fs.x) + 'px',
          bottom: scalePosY(fs.y) + 'px',
          opacity: fs.opacity
        }"
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
          height: scalePosY(obs.height) + 'px',
          opacity: isCharacterBehindObstacle(obs) ? 0.4 : 1,
          zIndex: isCharacterBehindObstacle(obs) ? 200 : 600,
          transition: 'opacity 0.2s ease, z-index 0.1s ease'
        }"
      />

      <!-- Coins -->
      <img
        v-for="(coin, i) in coins"
        :key="i"
        class="coin"
        :src="coinImg"
        :style="{
          left: scalePosX(coin.x) + 'px',
          bottom: scalePosY(coin.y) + 'px'
        }"
      />

      <!-- Character -->
      <img
        ref="character"
        :src="characterImg"
        class="character"
        :style="{
          left: scaledX + 'px',
          bottom: scaledY + 'px',
          transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
          zIndex: 500
        }"
      />


      <!-- Final score -->
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

import CoinSound from "../assets/collect.mp3";
import FootstepSound from "../assets/footsteps.mp3";
import BgMusic from "../assets/bgMusic.mp3";

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

      finalScore: null,

      bgMusic: null,
      coinAudio: null,
      footstepAudio: null,
      isFootstepPlaying: false
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
    },
    characterImg() {
      return this.isMoving ? this.runSprite : this.idleSprite;
    }
  },

  mounted() {
    this.updateGameAreaSize();

    this.coinAudio = new Audio(CoinSound);
    this.coinAudio.volume = 0.2;

    this.footstepAudio = new Audio(FootstepSound);
    this.footstepAudio.volume = 0.5;
    this.footstepAudio.loop = true;

    this.bgMusic = new Audio(BgMusic);
    this.bgMusic.volume = 0.03;
    this.bgMusic.loop = true;

    const startBgMusic = () => {
      this.bgMusic.play().catch(() => {});
      window.removeEventListener("keydown", startBgMusic);
      window.removeEventListener("mousedown", startBgMusic);
    };

    window.addEventListener("keydown", startBgMusic);
    window.addEventListener("mousedown", startBgMusic);

    window.addEventListener("keydown", e => (this.keysPressed[e.key] = true));
    window.addEventListener("keyup", e => (this.keysPressed[e.key] = false));
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

    scalePosX(v) {
      return v * this.scaleX;
    },
    scalePosY(v) {
      return v * this.scaleY;
    },

    gameLoop() {
      setInterval(() => {
        const speed = 8;

        let nextX = this.x;
        let nextY = this.y;
        let moved = false;

        if (this.keysPressed.a || this.keysPressed.ArrowLeft) {
          nextX -= speed;
          this.facing = "left";
          moved = true;
        }
        if (this.keysPressed.d || this.keysPressed.ArrowRight) {
          nextX += speed;
          this.facing = "right";
          moved = true;
        }
        if (this.keysPressed.w || this.keysPressed.ArrowUp) {
          nextY += speed;
          moved = true;
        }
        if (this.keysPressed.s || this.keysPressed.ArrowDown) {
          nextY -= speed;
          moved = true;
        }

        this.isMoving = moved;

        if (this.isMoving && !this.isFootstepPlaying) {
          this.isFootstepPlaying = true;
          this.footstepAudio.currentTime = 3;
          this.footstepAudio.playbackRate = 1.3;
          this.footstepAudio.play();
        } else if (!this.isMoving && this.isFootstepPlaying) {
          this.isFootstepPlaying = false;
          this.footstepAudio.pause();
        }

        nextX = Math.max(0, Math.min(nextX, DESIGN_WIDTH - this.characterWidth));
        nextY = Math.max(0, Math.min(nextY, DESIGN_HEIGHT - this.characterHeight));

        if (!this.collides(nextX, this.y)) this.x = nextX;
        if (!this.collides(this.x, nextY)) this.y = nextY;

        this.checkCoinCollision();
        this.updateFloatingScores();
      }, 16);
    },

    collides(nx, ny) {
    return this.obstacles.some(o => {
    const colW = o.collisionWidth ?? o.width;
    const colH = o.collisionHeight ?? o.height;

    const colX = o.x + (o.width - colW) / 2; // center collision
    const colY = o.y; // bottom-aligned

    // collision check
    return !(
      nx + this.characterWidth < colX ||
      nx > colX + colW ||
      ny + this.characterHeight < colY ||
      ny > colY + colH
    );
    });
  },

    isCharacterBehindObstacle(obs) {
      const charFeetY = this.y;

      const charCenterX = this.x + this.characterWidth / 2;
      const obsLeft = obs.x;
      const obsRight = obs.x + obs.width;
      const horizontalOverlap = charCenterX > obsLeft && charCenterX < obsRight;

      const depthLineY =
        obs.y + (obs.depthOffset ?? (obs.collisionHeight ?? obs.height) * 0.8);

      return horizontalOverlap && charFeetY > depthLineY;
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
          this.floatingScores.push({
            id: floatingId++,
            x: c.x,
            y: c.y,
            opacity: 1
          });
          this.coinAudio.currentTime = 0;
          this.coinAudio.play();
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

    setObstacles(obs = []) {
      this.obstacles = obs;
    },
    setBackground(url) {
      this.backgroundImg = url;
    },
    resetScore() {
      this.score = 0;
      this.finalScore = null;
    },
    showFinalScore() {
      this.finalScore = this.score;
    },
    hideFinalScore() {
      this.finalScore = null;
    }
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
  height: 45vw;
  max-height: 550px;
  margin: auto;
  position: relative;
  top: -50px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.game-area::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(51, 6, 100, 0.311);
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 900;
}

.character { 
  position: absolute; 
  width: 100px; 
}

.coin {
  position: absolute;
  width: 30px;
  z-index: 450;
}

.obstacle {
  position: absolute;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.score {
  position: absolute;
  top: 25px;
  right: 50px;
  font-weight: bold;
  font-size: 18px;
  color: white;
  background: rgba(22, 21, 77, 0.5);
  padding: 6px 12px;
  border-radius: 6px;
  z-index: 1000;
}

.floating-score {
  position: absolute;
  color: white;
  font-weight: bold;
  z-index: 700;
}

.final-score {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  font-size: 3vw;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 6px black;
  z-index: 2000;
}
</style>
