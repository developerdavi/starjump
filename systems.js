import Expo, { Accelerometer } from 'expo';
import { Dimensions, Alert } from 'react-native';
import React, { PureComponent } from 'react';
// import { GameLoop } from 'react-native-game-engine';

var accelerometerData = {}

function randomW(w) {
  let max = Dimensions.get('window').width - w
  return Math.random() * max
}

_toggle = () => {
  if (this._subscription) {
    this._unsubscribe();
  } else {
    this._subscribe();
  }
}

_slow = () => {
  Accelerometer.setUpdateInterval(1000);
}

_fast = () => {
  Accelerometer.setUpdateInterval(30);
}

_subscribe = () => {
  this._subscription = Accelerometer.addListener(accelerometerData => {
    this.accelerometerData = accelerometerData;
  });
}

_unsubscribe = () => {
  this._subscription && this._subscription.remove();
  this._subscription = null;
}

_toggle()
_fast()

let inGame = true

const Controller = (entities, { touches, time }) => {
  const n = 9 // Number of platforms
  const wh = Dimensions.get('window').height // Window height
  const ww = Dimensions.get('window').width // Window width
  const GRAVITY = 0.25 // Gravity value
  const JUMP_SPEED = -13.6 - (entities.score.score/6000) // Velocity of each jump

  gameLoop = () => {
    
    let velocityX = this.accelerometerData.x
    let character = entities.character
    let position = entities.character.position
    let speed = entities.character.speed
  
    // FUNCTIONS
    collide = (character, num) => {
      if (character.position[1] + character.size[1] + 10 >= entities['p' + num].position[1]) {
        if (character.position[1] + character.size[1] -10 <= entities['p' + num].position[1]) {
          if (character.position[0] + character.size[0] >= entities['p' + num].position[0]) {
            if (character.position[0] <= entities['p' + num].position[0] + entities['p' + num].size[0]) {
              if (entities['p' + num].effects == 'lava'){
                inGame = false
              }
              return true
            }
          }
        }
      }
      return false
    }
  
    jump = () => {
      entities['character'].speed = JUMP_SPEED
      entities['score'].jumps++
      // soundObject.playAsync()
      
      if (entities.score.score > 600) {
        for (let i = 1; i <= n; i++) {
          let effect = Math.round(Math.random() * 5)
          let sum = (Math.round(entities.score.score/1000) > 3 ? Math.round(entities.score.score/1000) : 4)
          // console.log(effect + ' + ' + sum)

          effect+=sum

          // console.log(effect)

          if (effect >= 9) {
            let count = 0
            for (let j = 1; j <= n; j++) {
              if (entities['p'+j].effects = 'lava') {
                count++
                break
              }
            }
            if (count == 0)
              effect = entities['p'+i].effects ? entities['p'+i].effects : 'lava'
          }
        } 
      }
    }
    
    up = () => {
      for (let i = 1; i <= n; i++) {
        let w = entities.p1.size[0]
        let h = entities.p1.size[1]
        let max = Dimensions.get('window').width - w
  
        entities['p'+i].position = [entities['p'+i].position[0], entities['p'+i].position[1]+speed * -1.2]
  
        if(entities['p'+i].position[1] > wh) {
          entities['p'+i].position = [Math.random() * max, -h]
          if(entities['p'+i].effects) {
            entities['p'+i].effects = null
            entities['p'+i].broken = false
          }

          let effect = Math.random() * 10

          effect = Math.round(effect) + (Math.round(entities.score.score/1000) > 3 ? Math.round(entities.score.score/1000) : 4)

          if (effect <= 7) {
            effect = null
          } else {
            effect = 'moving'
          } 

          entities['p'+i].effects = effect

          // console.log(effects[effect])
        }
      }
      entities.score.score = entities.score.score + speed / 5 * -1
      entities.score.score = Math.round(entities.score.score)
    }

    animateEffects = (index) => {
      if(entities['p' + index].effects) {
        switch(entities['p' + index].effects) {
          case 'moving':
            if (entities['p' + index].velocityX > 0) {
              if (entities['p' + index].size[0] + entities['p' + index].position[0] + 10 > ww) {
                entities['p' + index].velocityX = -1.5
              }
            } else if (entities['p' + index].velocityX < 0) {
              if (entities['p' + index].position[0] - 10 < 0) {
                entities['p' + index].velocityX = 1.5
              }
            } else {
              entities['p' + index].velocityX = 1.5
            }
            entities['p' + index].position = [entities['p' + index].position[0] + entities['p' + index].velocityX, entities['p' + index].position[1]]
            // console.log(entities['p' + index].velocityX)
            break;
          default:
            break;
        }
      }
    }
    
    if (speed > 0) {
      for (let i = 1; i <= n; i++) {
        if (collide(character, i))
          jump()
      }
    }

    for (let i = 1; i <= n; i++) {
      animateEffects(i)
    }
    
    if (position[1] > wh) {
      inGame = false
      // Alert.alert('Fim de jogo', 'Pontuação: ' + entities.score.score)
    }
  
    if (position[1] < wh / 3 && speed < 0) {
      up()
    } else {
      entities.character.position = [position[0], position[1] + speed]
    }
    
    if (velocityX > 0) {
      entities.character.side = '180deg'
      if (entities.character.position[0] + entities.character.size[0] <= 0) {
        entities.character.position[0] = Dimensions.get('window').width - 1
      }
    } else if (velocityX < 0) {
      entities.character.side = '0deg'
      if (entities.character.position[0] >= Dimensions.get('window').width)
      entities.character.position[0] = - entities.character.size[0]
    }
    
    entities.character.position[0] += (velocityX * -20)
    entities.character.speed += GRAVITY
  }

  reset = () => {
    entities.score.score = 0
    entities.score.jumps = 0
    entities.character.position = [Dimensions.get('window').width / 2 - 20, Dimensions.get('window').height / 2]
    entities.character.speed = -10
    for (let i = 1; i <= n; i++) {
      entities['p'+i].position = [randomW(60), 60 * i]
    }
  }

  if (inGame)
    gameLoop()
  else {
    entities.gameState.score = entities.score.score
    entities.gameState.jumps = entities.score.jumps
    entities.gameState.inGame = false
    inGame = true
    reset()
  }
  
  return entities
}

export { Controller }
