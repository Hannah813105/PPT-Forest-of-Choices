const textElement = document.getElementById('text')
const choicebuttonsElement = document.getElementById('choice-buttons')

let state = {}

function startGame () {
  state = {}
  showTextNode(1)
}

function changeBackground(url) {
  const bg = document.getElementById('background')
  bg.classList.add('fade-out')

  setTimeout(() => {
    bg.style.backgroundImage = `url(${url})`
    bg.classList.remove('fade-out')
  }, 400)
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(t => t.id === textNodeIndex);

  textElement.innerText = textNode.text;

  // Reset character
  if (window.characterComponent) {
    window.characterComponent.resetCharacter();
    // Add coins if defined for this textNode
    if (textNode.coins) {
      window.characterComponent.setCoins(textNode.coins);
    }
  }

  if (textNode.background) { changeBackground(textNode.background); }

  while (choicebuttonsElement.firstChild) {
    choicebuttonsElement.removeChild(choicebuttonsElement.firstChild);
  }

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

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startGame()
  }
  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}

import forestImg from './assets/pexels-lum3n-44775-167698.jpg'
import foggyImg from './assets/foggy-autumn-forest-thick-forest-fall-aesthetic-nature.jpg'

const textNodes = [
  {
    id: 1,
    text: '',
    background: forestImg,
    coins: [
      { x: 300, y: 0 },
      { x: 500, y: 0 }
    ],
    options: [
      {
        text: 'Start your Journey',
        setState: { blueGoo: true },
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
        requiredState: (currentState) => currentState.blueGoo,
        setState: { blueGoo: false, sword: true },
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
        text: 'Leave it alone',
        nextText: 10
      }
    ]
  },
  {
    id: 6,
    text: 'he trees grow darker. Suddenly, a hidden trap door opens beneath your feet! You find yourself in an undergroud cave.',
    background: foggyImg,
    options: [
      {
        text: 'Grab the edge and try to climb out',
        nextText: 20
      },
      {
        text: 'Explore the cave system',
        nextText: 20
      }
    ]
  },
  {
    id: 7,
    text: 'The cabin is dusty but cozy. On the table is a mysterious old map, a book covered in moss, and a lantern with a purple light glowing inside.',
    background: foggyImg,
    options: [
      {
        text: 'Take the map',
        nextText: 11,
        setState: { map: true }
      },
      {
        text: 'Take the book',
        nextText: 20,
        setState: { book: true }
      },
      {
        text: 'Take the lantern',
        nextText: 20,
        setState: { lantern: true }
      }
    ]
  },
  {
    id: 8,
    text: 'You follow a quiet path. Suddenly, fireflies form a glowing circle around you, and the forest feels… magical.',
    background: foggyImg,
    options: [
      {
        text: 'Step into the circle',
        nextText: 13,
      },
      {
        text: 'Step back',
        nextText: 3,
      }
    ]
  },
  {
    id: 8,
    text: 'You follow a quiet path. Suddenly, fireflies form a glowing circle around you, and the forest feels… magical.',
    background: foggyImg,
    options: [
      {
        text: 'Step into the circle',
        nextText: 20,
      },
      {
        text: 'Step back',
        nextText: 3,
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
        nextText: 20,
      },
      {
        text: 'Sit and wait',
        nextText: 20,
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
        nextText: 6,
      },
      {
        text: 'Stay on the main path',
        nextText: 20,
      }
    ]
  },
  {
    id: 11,
    text: 'The map shows a hidden clearing. Following it, you find… a glowing sword stuck in a stone!',
    background: foggyImg,
    options: [
      {
        text: 'Pull the sword',
        nextText: 20,
      },
      {
        text: 'Explore the hidden clearing',
        nextText: 20,
      }
    ]
  },
  {
    id: 20,
    text: 'You moved to ending 1!',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 21,
    text: 'You moved to ending 2!',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  }
  ,
  {
    id: 22,
    text: 'You moved to ending 3!',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  }
]

startGame()
