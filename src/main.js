import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

let resizeTimeout;

function scaleGame() {
  const root = document.getElementById("game-root");
  if (!root) return;

  const scale = Math.min(
    window.innerWidth / 1440,
    window.innerHeight / 800
  );

  root.style.transform = `scale(${scale})`;
}

// Run AFTER layout is stable
function handleResize() {
  cancelAnimationFrame(resizeTimeout);
  resizeTimeout = requestAnimationFrame(scaleGame);
}

window.addEventListener("resize", handleResize);
window.addEventListener("orientationchange", handleResize);
window.addEventListener("load", scaleGame);
