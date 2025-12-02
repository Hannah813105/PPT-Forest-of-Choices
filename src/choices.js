const textElement = document.getElementById('text')
const choicebuttonsElement = document.getElementById('choice-buttons')

let state = {}

function startGame () {
  state = {}
  showTextNode(1)
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(t => t.id === textNodeIndex)

  textElement.innerText = textNode.text

  while (choicebuttonsElement.firstChild) {
    choicebuttonsElement.removeChild(choicebuttonsElement.firstChild)
  }
  const options = textNode.options || []

  options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('button')
      button.addEventListener('click', () => selectOption(option))
      choicebuttonsElement.appendChild(button)
    }
  })
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

const textNodes = [
  {
    id: 1,
    text: 'Go into the forest',
    options: [
      {
        text: 'Go into the forest',
        setState: { blueGoo: true },
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    text: 'You moved to node 2!',
    options: [
      {
        text: 'Trade the Goo',
        requiredState: (currentState) => currentState.blueGoo,
        setState: { blueGoo: false, sword: true },
        nextText: 11
      },
      {
        text: 'Trade Ignore',
        nextText: 12
      }
    ]
  },
  {
    id: 11,
    text: 'You moved to ending 1!',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 12,
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
    id: 13,
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
