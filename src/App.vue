<script setup>
import Character from './components/character.vue';

</script>

<template>
  <section id="foc">
    <div id="background"></div>
    <h1 id="title">
      Forest of Choices
    </h1>
    <Character />
    <div class="container">
      <div class="text-container">
        <p id="text"></p>
      </div>
      <div id="choice-buttons" class="button-grid">
        <button class="button">option 1</button>
        <button class="button">option 2</button>
        <button class="button">option 3</button>
        <button class="button">option 4</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
#foc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('./assets/grass.png');
  background-size: cover;  
  background-position: center;
  background-repeat: no-repeat;
}

.text-container {
  width: 100%;
  max-width: 3000px;
  margin: 0 auto;
  position: relative;
  left: 10px;
  bottom: 5px;
  }

  #text {
    color: white;
    font-weight: 700;
    white-space: pre-wrap; 
    text-align: left;
  }

  #title {
  position: fixed;
  font-size: 32px;
  color: white;
  text-align: left;
  top: 5px;
  left: 5%;
  }
  
  .container {
    position: fixed;
    bottom: 5%;
    left: 5%;
    right: 5%;
    background-color: rgba(22, 21, 77, 0.474);
    padding: 15px 20px 40px;
    border-radius: 10px;
    box-shadow: 0 5px 10px 0.5px rgba(47, 100, 44, 0.582);
  }

  .button-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px; 
    margin-top: 20px;
  }

  .button-grid.single-option {
  grid-template-columns: 1fr;
  }
</style>
