import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

function scaleGame() {
  const scale = Math.min(
    window.innerWidth / 1440,
    window.innerHeight / 800
  );

  document.getElementById("game-root").style.transform =
    `scale(${scale})`;
}

window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);
