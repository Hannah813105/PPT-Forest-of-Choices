const textElement = document.getElementById("text");
const choiceButtons = document.getElementById("choice-buttons");
const container = document.querySelector(".container");

let state = {};

function startGame() {
  state = {};
  window.characterComponent?.resetScore();
  showTextNode(1);
}


let typingInterval = null;

function typeText(text = "", speed = 30) {
  if (typingInterval) clearInterval(typingInterval);

  if (!text) {
    textElement.innerText = "";
    typingInterval = null;
    return;
  }

  textElement.innerText = "";
  let index = 0;

  typingInterval = setInterval(() => {
    textElement.innerText += text[index];
    index++;

    if (index >= text.length) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
  }, speed);
}

function showTextNode(id) {
  const node = textNodes.find(n => n.id === id);
  typeText(node.text || "");

  // Update character component
  if (window.characterComponent) {
    window.characterComponent.resetCharacter(node.coins || []);
    if (node.background) window.characterComponent.setBackground(node.background);
    window.characterComponent.setObstacles(node.obstacles || []);

    if (node.coins && node.coins.length > 0 && !node.isEnding) {
    container.style.display = "none"; // hide text/buttons
    const wait = setInterval(() => {
    if (window.characterComponent.allCoinsCollected) {
      container.style.display = "block"; // show after all coins picked
      clearInterval(wait);
    }
    }, 50);
  } else {
    container.style.display = "block"; // show immediately if no coins
    }

    
    // Show final score if ending
    if (node.isEnding) {
      window.characterComponent.showFinalScore();
    } else {
      window.characterComponent.hideFinalScore();
    }
  }

  // Update options
  choiceButtons.innerHTML = "";
  const visibleOptions = (node.options || []).filter(opt => {
    return !opt.requiredState || opt.requiredState(state);
  });

  if (visibleOptions.length === 1) {
    choiceButtons.classList.add("single-option");
  } else {
    choiceButtons.classList.remove("single-option");
  }

  visibleOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.classList.add("button");
    btn.textContent = opt.text;
    btn.onclick = () => selectOption(opt);
    choiceButtons.appendChild(btn);
  });
}

function selectOption(option) {
  if (option.nextText <= 0) return startGame();
  state = Object.assign(state, option.setState || {});
  showTextNode(option.nextText);
}

// Import your assets
import grassImg from './assets/grass.png';
import foggyImg from './assets/foggy-autumn-forest-thick-forest-fall-aesthetic-nature.jpg';
import coinImg from './assets/coin.png';
import treeImg from './assets/Tree.png';

const textNodes = [
  {
    id: 1,
    text: '',
    background: grassImg,
    obstacles: [
      { x: 700, y: 300, width: 250, height: 230, collisionWidth: 150, collisionHeight: 40, image: treeImg, depthOffset: 40},
      { x: 200, y: 200, width: 250, height: 230, collisionWidth: 150, collisionHeight: 40, image: treeImg, depthOffset: 40}
    ],
    coins: [
      { x: 300, y: 380 },
      { x: 500, y: 60 }
    ],
    options: [
      {
        text: 'Start your Journey',
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    text: 'You stand at the edge of a mysterious forest. The sun is setting, and a cool mist curls around the trees.',
    background: grassImg,
    options: [
      {
        text: 'Enter the forest cautiously',
        nextText: 3
      },
      {
        text: 'Walk along the forest edge',
        nextText: 4
      }
    ]
  },
  {
    id: 3,
    text: 'The forest is dense, and shadows loom. You hear a rustle nearby.',
    background: grassImg,
    options: [
      {
        text: 'Investigate the sound',
        nextText: 5
      },
      {
        text: 'Ignore it and continue walking',
        nextText: 6
      }
    ]
  },
  {
    id: 4,
    text: 'Walking along the forest edge, you find a small, abandoned cabin.',
    background: grassImg,
    options: [
      {
        text: 'Enter the cabin',
        nextText: 7
      },
      {
        text: 'Keep walking past the cabin',
        nextText: 8
      }
    ]
  },
  {
    id: 5,
    text: 'You discover a glowing blue mushroom surrounded by strange footprints.',
    background: grassImg,
    options: [
      {
        text: 'Pick the mushroom',
        nextText: 9,
        setState: { blueShroom: true }
      },
      {
        text: 'Investigate the footprints',
        nextText: 10
      }
    ]
  },
  {
    id: 6,
    text: 'The trees grow darker. Suddenly, a hidden trap door opens beneath your feet! You find yourself in an underground cave.',
    background: foggyImg,
    options: [
      {
        text: 'look on the map for a route in the cave system',
        requiredState: (currentState) => currentState.map,
        setState: { map: false, gems: true },
        nextText: 26
      },
      {
        text: 'Explore the cave system',
        nextText: 11
      },
      {
        text: 'Try to climb out',
        nextText: 12
      }
    ]
  },
  {
    id: 7,
    text: 'The cabin is dusty but cozy. On the table is a mysterious old map, a book covered in moss.',
    background: foggyImg,
    options: [
      {
        text: 'Take the map',
        nextText: 13,
        setState: { map: true }
      },
      {
        text: 'Take the book',
        nextText: 14,
        setState: { book: true }
      }
    ]
  },
  {
    id: 8,
    text: 'As you walk past the cabin, the forest thins, and the trees become more scattered. A narrow dirt road appears ahead, winding toward the horizon.',
    background: grassImg,
    options: [
      {
        text: 'Go into the forest',
        nextText: 15
      },
      {
        text: 'Follow the dirt road',
        nextText: 16
      }
    ]
  },
  {
    id: 9,
    text: 'As you pick the mushroom, the forest seems to shift. Colors swirl, and you feel dizzy.',
    background: grassImg,
    options: [
      {
        text: 'Keep walking',
        nextText: 17
      },
      {
        text: 'Sit and wait',
        nextText: 18
      }
    ]
  },
  {
    id: 10,
    text: 'You ignore the mushroom. A hidden path opens to your left, leading deeper into the forest.',
    background: grassImg,
    options: [
      {
        text: 'Take the path',
        nextText: 4
      },
      {
        text: 'Stay on the main path',
        nextText: 6
      }
    ]
  },
  {
    id: 11,
    text: 'Within the cave system you spot an path leading further into the cave and a winding underground river.',
    background: foggyImg,
    options: [
      {
        text: 'Go further into cave',
        nextText: 19
      },
      {
        text: 'Investigate the winding river',
        nextText: 20
      }
    ]
  },
  {
    id: 12,
    text: 'You climb up to the trapdoor`s opening, grab the edge, and pull yourself out.',
    background: grassImg,
    options: [
      {
        text: 'You head toward the forest`s edge, keeping distance from the cave.',
        nextText: 4
      }
    ]
  },
  {
    id: 13,
    text: 'When you take the map, the symbols begin to glow faintly, revealing a hidden path deep within the forest.',
    background: grassImg,
    options: [
      {
        text: 'Stay on the main path',
        nextText: 6
      },
      {
        text: 'Follow the hidden path into the forest',
        nextText: 21
      }
    ]
  },
  {
    id: 14,
    text: 'When you take the book, the moss flakes away, revealing pages filled with strange symbols that seem to shift before your eyes.',
    background: foggyImg,
    options: [
      {
        text: 'Examine the book and its symbols',
        nextText: 22
      },
      {
        text: 'Take the book with you into the forest',
        nextText: 5
      }
    ]
  },
  {
    id: 15,
    text: 'In the forest, you come across two paths: one continues along the trail, the other crosses a bridge.',
    background: grassImg,
    options: [
      {
        text: 'Continue on the trail',
        nextText: 6
      },
      {
        text: 'Cross the bridge',
        nextText: 23
      }
    ]
  },
  {
    id: 16,
    text: 'He trees gradually give way to an open field. Sunlight spills across the grass, and the sounds of the forest fade to birdsong and wind.',
    background: grassImg,
    options: [
      {
        text: 'Explore the field',
        nextText: 24
      },
      {
        text: 'Follow the birdsong',
        nextText: 25
      }
    ]
  },
  {
    id: 17,
    text: 'The trees stretch impossibly tall, their bark shimmering with blue-veined light. The ground softens under your feet, springy like moss yet warm like skin. Ahead, a narrow path glows faintly, leading deeper into the forest`s heart.',
    background: grassImg,
    options: [
      {
        text: 'Ignore the glowing path',
        nextText: 27
      },
      {
        text: 'Take the glowing path',
        nextText: 28
      }
    ]
  },
  {
    id: 18,
    text: 'You sink to the forest floor, letting the dizziness wash over you. The colors settle into a slow hypnotic pulse, then fade entirely. In the quiet that follows, the footprints beside you begin to glow.',
    background: grassImg,
    options: [
      {
        text: 'Follow the glowing footprints',
        nextText: 28
      },
      {
        text: 'Ignore the footprints and continue walking',
        nextText: 30
      }
    ]
  },
  {
    id: 19,
    text: 'A deep rumble shakes the cave as rocks crash down around you.',
    background: foggyImg,
    options: [
      {
        text: 'Accept your fate',
        nextText: 28
      }
    ]
  },
  {
    id: 20,
    text: 'Looking down into the flowing water, your eyes catch a gem sparkling.',
    background: foggyImg,
    options: [
      {
        text: 'Ignore the gem and find a way out',
        nextText: 30
      },
      {
        text: 'Take the gem',
        nextText: 29
      }
    ]
  },
  {
    id: 21,
    text: 'The path opens into a clearing with a circle of standing stones that hum softly. Strange symbols glow on their surfaces, and the air inside feels charged.',
    background: grassImg,
    options: [
      {
        text: 'Step inside of the circle of stones',
        nextText: 27
      },
      {
        text: 'Investigate the strange symbols',
        nextText: 22
      }
    ]
  },
  {
    id: 22,
    text: 'As you trace the strange symbols with your fingers, the letters rearrange themselves into a pattern you can almost understand. Faint whispers rise from the forest.',
    background: grassImg,
    options: [
      {
        text: 'Follow the voices into the forest',
        nextText: 29
      },
      {
        text: 'Call out to the voices demanding answers',
        nextText: 28
      }
    ]
  },
  {
    id: 23,
    text: 'You step onto the bridge, and it creaks under your weight. Some of the wooden planks wobble dangerously, and a few snap with a sharp crack.',
    background: grassImg,
    options: [
      {
        text: 'Run across',
        nextText: 28
      },
      {
        text: 'Jump into the river beneath',
        nextText: 31
      }
    ]
  },
  {
    id: 24,
    text: 'You step into the open grass, curious what might lie ahead. Perhaps there`s something hidden in the tall blades or a path leading further.',
    background: grassImg,
    options: [
      {
        text: 'Search for hidden objects in the grass',
        nextText: 29
      },
      {
        text: 'Follow the path you find',
        nextText: 30
      }
    ]
  },
  {
    id: 25,
    text: 'You spot a tree filled with birds. In front of the tree there`s a sign with two directions: into the forest or out of the forest.',
    background: grassImg,
    options: [
      {
        text: 'Step into the forest',
        nextText: 3
      },
      {
        text: 'Step out of the forest',
        nextText: 27
      }
    ]
  },
  {
    id: 26,
    text: 'The map shifts and reveals a hidden treasure within the cave. Following it you find a chest filled with gems.',
    background: foggyImg,
    options: [
      {
        text: 'Take the gems and find a way out',
        nextText: 29
      }
    ]
  },
  {
    id: 27,
    text: 'You emerge once more at the forest`s edge. The sun sits exactly where it was when you began—no time has passed, though the faint chill on your skin insists something has changed.',
    isEnding: true,
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 28,
    text: 'The world narrows around you, walls of the forest closing in. No matter how you struggle or call for help, the path out seems to vanish. Slowly, you realize the place has claimed you. You are trapped, and there is no escape.',
    isEnding: true,
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 29,
    text: 'Deep within the forest`s secret places, you uncover a long-lost treasure. When you finally return home, word of your discovery spreads, and you are celebrated as a hero.',
    isEnding: true,
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 30,
    text: 'You step out of the forest and come across a quiet village where you settle down for the night.',
    isEnding: true,
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 31,
    text: 'You fall into a cold and winding river. When getting up you notice that you are mostly unharmed',
    options: [
      {
        text: 'Investigate the winding river',
        nextText: 20
      }
    ]
  }
]

startGame()
