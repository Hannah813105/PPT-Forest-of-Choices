const textElement = document.getElementById('text');
const choicebuttonsElement = document.getElementById('choice-buttons');

let state = {};

function startGame() { state = {}; showTextNode(1); }

function changeBackground(url) {
  if (window.characterComponent) window.characterComponent.setBackground(url);
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(t => t.id === textNodeIndex);
  textElement.innerText = textNode.text;

  const container = document.querySelector('.container');

  // Reset character and coins
  if (window.characterComponent) {
    const coins = textNode.coins || [];
    window.characterComponent.resetCharacter(coins);

    // Hide or show final score
    if (textNode.isEnding) {
      window.characterComponent.displayFinalScore();
    } else {
      window.characterComponent.hideFinalScore();
    }
  }

  // Hide container until all coins collected
  if (textNode.coins && textNode.coins.length > 0) {
    container.style.display = 'none';
    const interval = setInterval(() => {
      if (window.characterComponent.allCoinsCollected) {
        container.style.display = 'block';
        clearInterval(interval);
      }
    }, 100);
  } else {
    container.style.display = 'block';
  }

  // Change background
  if (textNode.background) changeBackground(textNode.background);

  // Render options
  while (choicebuttonsElement.firstChild) choicebuttonsElement.removeChild(choicebuttonsElement.firstChild);

  const options = textNode.options || [];
  options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button');
      button.innerText = option.text;
      button.classList.add('button');
      button.addEventListener('click', () => selectOption(option));
      choicebuttonsElement.appendChild(button);
    }
  });
}

function showOption(option) { return option.requiredState == null || option.requiredState(state); }

function selectOption(option) {
  const nextTextNodeId = option.nextText;
  if (nextTextNodeId <= 0) {
    if (window.characterComponent) window.characterComponent.resetCharacter([], true); // Reset coins and score
    return startGame();
  }
  state = Object.assign(state, option.setState);
  showTextNode(nextTextNodeId);
}

// Import your assets
import forestImg from './assets/pexels-lum3n-44775-167698.jpg';
import foggyImg from './assets/foggy-autumn-forest-thick-forest-fall-aesthetic-nature.jpg';
import coinImg from './assets/coin.png';

const textNodes = [
  {
    id: 1,
    text: '',
    background: forestImg,
    coins: [
      { x: 300, y: 400 },
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    text: 'The trees grow darker. Suddenly, a hidden trap door opens beneath your feet!You find yourself in an underground cave.',
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    text: 'The map shows a hidden clearing. Following it, you find… a glowing sword stuck in a stone!',
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
    background: foggyImg,
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
