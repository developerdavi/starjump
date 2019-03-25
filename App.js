import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  AppRegistry,
  Dimensions,
  Alert,
  ImageBackground,
  BackHandler,
  StatusBar,
  AsyncStorage,
  NativeModules
} from 'react-native';
import { RkButton, RkTheme, RkCard } from 'react-native-ui-kitten';
import { LinearGradient, KeepAwake } from 'expo';

// React Native Game Engine
import { GameEngine } from 'react-native-game-engine';

// Game components
import { Controller } from './systems.js'
import { Character, Platform, Score } from './renderers.js'

// Prizes
import { dPrizes, jPrizes } from './prizes.js';

// Accelerometer
import {
  Font,
  AppLoading, 
  Asset
} from 'expo';

// RkTheme
RkTheme.setType('RkButton', 'start', {
  backgroundColor: '#cdc739'
})

/**
 * 
 *   ACHIEVEMENTS
 * 
 */
const achievements = [
  500,
  1000,
  1500,
  2000,
  3500,
  5000,
  7000,
  9000,
  12000,
  20000,
  30000,
  45000,
  60000,
  80000,
  100000
]

const achievementsJumps = [
  500,
  1000,
  1500,
  2000,
  3500,
  5000,
  7000,
  9000,
  12000,
  20000,
  30000,
  45000,
  60000,
  80000,
  100000
]

class StarBotsLogo extends Component {
  render() {
    return (
      <Image style={[styles.starbots]} source={require('./assets/starbots.png')}/>
    )
  }
}

class Logo extends Component {
  render() {
    return (
      <Image style={styles.logo} source={require('./assets/logo.png')}/>
    )
  }
}

class GameState extends PureComponent {
  render() {
    if (this.props.inGame == false)
      this.props.endGame(this.props.score, this.props.jumps)
    return null
  }
}

class Curiosidade extends PureComponent {
  render() {
    // console.log(this.props)
    
    if (this.props.got)
    return (
      <View style={[styles.fullW, styles.centerContent]}>
        <RkCard style={[styles.prizeCard]}>
          <LinearGradient colors={['#61cb46', '#50a93b']} style={{borderRadius: 10}}>
            <View rkCardHeader>
              <Text style={{fontSize: 22, fontFamily: 'nasalization', opacity: 1}}>Curiosidade #{this.props.number.toString()}</Text>
            </View>
            <View rkCardContent style={{}}>
              <Text style={{fontSize: 14, fontFamily: 'Montserrat', opacity: 1, marginTop: -20}}>{this.props.text}</Text>
            </View>
            <View style={{width: '100%', alignItems: 'center', alignContent: 'center', justifyContent: 'center', paddingHorizontal: 15, marginBottom: -90}}>
              <Text style={{fontSize: 12, fontFamily: 'OpenDyslexicAlta', opacity: 1}}>Adquirida ao alcançar a pontuação {this.props.score.toString()} em {this.props.type.toString() == 'distance' ? 'distância' : 'pulos'}</Text>
            </View>
          </LinearGradient>
        </RkCard>
      </View>
    )
    else
    return (
      <View style={[styles.fullW, styles.centerContent]}>
        <RkCard style={[styles.prizeCard]}>
          <LinearGradient colors={['#e2e0da', '#c6c3b7']} style={{borderRadius: 10}}>
            <View rkCardHeader>
              <Text style={{fontSize: 22, fontFamily: 'nasalization', opacity: 1}}>Curiosidade #{this.props.number.toString()}</Text>
            </View>
            <View rkCardContent style={[styles.centerContent, {marginBottom: -50}]}>
              <Text style={{fontSize: 18, fontFamily: 'OpenDyslexicAlta', opacity: 1}}>???</Text>
            </View>
            <View style={{width: '100%', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginTop: -100, paddingHorizontal: 20, marginBottom: -90}}>
              <Text style={{fontSize: 12, fontFamily: 'OpenDyslexicAlta', opacity: 1}}>Adquire-se ao alcançar a pontuação {this.props.score.toString()} em {this.props.type.toString() == 'distance' ? 'distância' : 'pulos'}</Text>
            </View>
          </LinearGradient>
        </RkCard>
      </View>
    )
  }
}

class PopUp extends PureComponent {
  render() {
    return (
      <ImageBackground source={require('./assets/splash_background.jpg')} style={{width: '100%', height: '100%'}}>
        <ScrollView contentContainerStyle={{width: '100%', alignContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 32, fontFamily: 'Montserrat', marginTop: 100}}>{this.props.title}</Text>
          {this.props.children}
        </ScrollView>
      </ImageBackground>
    )
  }
}

export default class StarJump extends PureComponent {
  constructor() {
    super()
  }

  static navigationOptions = {
    header: null
  }

  state = {
    isLoadingComplete: false,
    inGame: false
  }
  
  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/astronaut.png'),
        require('./assets/background.jpg'),
        require('./assets/logo.png'),
        // require('./assets/platform.png'),
      ]),
      Font.loadAsync({
        'nasalization': require('./assets/fonts/nasalization.ttf'),
        'thaleah': require('./assets/fonts/ThaleahFat.ttf'),
        'OpenDyslexicAlta': require('./assets/fonts/OpenDyslexicAlta-Bold.otf'),
        'Montserrat': require('./assets/fonts/Montserrat.ttf')
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
  
  startGame = () => {
    this.setState({inGame: true})
  }

  endGame = async (score, jumps) => {
    this.setState({inGame: false, gameOver: true, score: score})
    // Alert.alert('a', 'score: ' + score)

    let record = await this.getRecord() 
    
    if (score > record) {
      // Alert.alert('Novo recorde', 'Pontuação: ' + score)
      await this.setRecord(score)
      this.setState({record:score})
      this.setState({newRecord:true})
    }

    // TODO
    // let prizesD = await this.saveDistance(score)
    // let prizesJ = await this.saveJumps(jumps)
    // if (prizesD.length > 0) {
    //   this.setState({showDistancePopup: prizesD})
    // }
    // if (prizesJ.length > 0) {
    //   this.setState({showJumpsPopup: prizesJ})
    // }

    await this.saveDistance(score)
    await this.saveJumps(jumps)

    let distance = await this.getDistance()
    let curr_jumps = await this.getJumps()
    this.setState({distance: distance, jumps: curr_jumps})
  }

  gotoMenu = () => {
    this.setState({inGame: false, gameOver: false, achievements: false, newRecord: false})
  }

  gotoAchievements = () => {
    this.setState({achievements: true})
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    // NativeModules.KCKeepAwake.activate();
    KeepAwake.activate();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    // NativeModules.KCKeepAwake.deactivate();
    KeepAwake.deactivate();
  }

  componentWillMount = async () => {
    let distance = await this.getDistance()
    let record = await this.getRecord()
    let jumps = await this.getJumps()

    this.setState({distance: distance, record: record, jumps: jumps, newRecord: false})
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  }

  goBack = () => {
    if(this.state.inGame)
      this.gotoMenu()
    else {
      // if (this.state.bestD[0] != false)
      //   this.setState({bestD: [false]})
      // TODO
      if (this.state.prize != false)
        this.setState({prize: false})
      else if (this.state.achievements)
        this.gotoMenu()
      else 
        BackHandler.exitApp()
    }
  }

  saveDistance = async (score) => {
    let distance = await this.getDistance()
    // TODO
    // this.setState({bestD: [false]})
    // for (let index = 0; index < achievements.length; index++) {
    //   // const element = array[index];
    //   if (distance < achievements[index] && distance + parseInt(score) >= achievements[index]) {
    //     if (this.state.bestD[0] == false) {
    //       this.setState({bestD: bestD[0] = (index)})          
    //     } else {
    //       this.setState({bestD: bestD.push(index)})
    //     }
    //   }
    // }
    try {
      await AsyncStorage.setItem('@Game:distance', (distance + parseInt(score)).toString())
    } catch (e) {
      Alert.alert('Erro', e.message)
    }
  }

  getDistance = async () => {
    let distance = 0
    try {
      distance = await AsyncStorage.getItem('@Game:distance')
      // console.log(distance)
      if (distance == null) {
        try {
          await AsyncStorage.setItem('@Game:distance', (0).toString())
        } catch (e) {
          Alert.alert('Erro', e.message)
        } finally {
          return 0
        }
      }
    } catch (e) {
      Alert.alert('Erro', e.message)
    } finally {
      // Alert.alert(distance)
      return parseInt(distance)
    }
  }

  saveJumps = async (jumps) => {
    let curr_jumps = await this.getJumps()
    try {
      await AsyncStorage.setItem('@Game:jumps', (curr_jumps + parseInt(jumps)).toString())
    } catch (e) {
      Alert.alert('Erro', e.message)
    }
  }

  getJumps = async () => {
    let distance = 0
    try {
      distance = await AsyncStorage.getItem('@Game:jumps')
      // console.log(distance)
      if (distance == null) {
        try {
          await AsyncStorage.setItem('@Game:jumps', (0).toString())
        } catch (e) {
          Alert.alert('Erro', e.message)
        } finally {
          return 0
        }
      }
    } catch (e) {
      Alert.alert('Erro', e.message)
    } finally {
      // Alert.alert(distance)
      return parseInt(distance)
    }
  }

  setRecord = async (record) => {
    try {
      await AsyncStorage.setItem('@Game:record', Math.round(record).toString())
    } catch (e) {
      Alert.alert('Erro', e.message)
    }
  }

  getRecord = async () => {
    let record = 0
    try {
      record = await AsyncStorage.getItem('@Game:record')
    } catch (e) {
      Alert.alert('Erro', e.message)
    } finally {
      // console.log(record)
      if (isNaN(parseInt(record))) {
        await this.setRecord(0)
        return 0
      }
      return parseInt(record)
    }
  }

  showDistancePrizes = () => {
    this.setState({prize: 'distance'})
  }

  showJumpsPrizes = () => {
    this.setState({prize: 'jumps'})
  }

  prizes = (type) => {
    let getPrizes = (type) => {
      if (type == 'distance') {
        let {distance} = this.state

        return achievements.map((prize, index) => {
          // Alert.alert('Variables', 'distance: ' + distance + '\nprize: ' + prize + '\nindex: ' + index + '\ntype: ' + type)
          return (
            <Curiosidade got={distance >= prize} text={dPrizes[index]} number={index + 1} score={prize} type={type}></Curiosidade>
            // <Text>a</Text>
          )
        })
      } else {
        let {jumps} = this.state

        return achievementsJumps.map((prize, index) => {
          // Alert.alert('Variables', 'distance: ' + distance + '\nprize: ' + prize + '\nindex: ' + index + '\ntype: ' + type)
          return (
            <Curiosidade got={jumps >= prize} text={jPrizes[index]} number={index + 1} score={prize} type={type}></Curiosidade>
            // <Text>a</Text>
          )
        })
      }
    }

    let prizes = getPrizes(type)

    return (
      <ImageBackground source={require('./assets/splash_background.jpg')} style={{width: '100%', height: '100%'}}>
        <ScrollView contentContainerStyle={{width: '100%', alignContent: 'center', alignItems: 'center'}}>
          <Text style={[styles.white, {paddingTop: 15, paddingBottom: 25, fontSize: 32, fontFamily: 'nasalization'}]}>Curiosidades</Text>
          {prizes}
        </ScrollView>
        <StatusBar hidden={true}/>
      </ImageBackground>
    )
  }

  achievements = () => {
    let { distance } = this.state
    let { jumps } = this.state

    let nextDistance = 500
    let progress = 0
    let max = achievements.length

    for (let index = 0; index < achievements.length; index++) {
      if (distance < achievements[index]) {
        nextDistance = achievements[index]
        progress = index
        break
      }
    }

    let nextJumps = 500
    let progressJumps = 0
    let maxJumps = achievementsJumps.length

    for (let index = 0; index < achievementsJumps.length; index++) {
      if (jumps < achievementsJumps[index]) {
        nextJumps = achievementsJumps[index]
        progressJumps = index
        break
      }
    }

    return (
      <ImageBackground source={require('./assets/splash_background.jpg')} style={{width: '100%', height: '100%'}}>
        {/* <View style={[styles.container, {alignContent: 'center'}]}> */}
          <ScrollView contentContainerStyle={{width: '100%', alignContent: 'center', alignItems: 'center'}}>
            <Text style={[styles.white, {paddingTop: 15, paddingBottom: 25, fontSize: 32, fontFamily: 'nasalization'}]}>Conquistas</Text>
            <RkCard style={[styles.card]}>
              <View rkCardHeader>
                <Text style={[{fontSize: 20, fontFamily: 'nasalization', opacity: 1}]}>Distância ({progress.toString()}/{max.toString()})</Text>
              </View>
              <View rkCardContent style={{alignItems: 'center'}}>
                <Text style={{fontSize: 25, fontFamily: 'nasalization', opacity: 1}}>{(distance / nextDistance * 100) > 100 ? 100 + (distance / nextDistance * 100).toFixed(2) : (distance / nextDistance * 100).toFixed(2)}%</Text>
              </View>
              <View style={{width: '100%', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginTop: -40}}>
                <Text style={{fontSize: 18, fontFamily: 'nasalization', opacity: 1}}>{distance.toString()} <Text style={{fontSize: 64}} > → </Text> {(nextDistance).toString()}</Text>
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <RkButton style={styles.curiosidades} rkType='start' onPress={this.showDistancePrizes}>
                  {/* <LinearGradient style={{width: '100%', height: 60, justifyContent: 'center', alignItems: 'center'}} colors={['#a73a86', '#e650b9']}> */}
                    <Text style={styles.startText}>
                      Curiosidades
                    </Text> 
                  {/* </LinearGradient> */}
                </RkButton>
              </View>
            </RkCard>
            <RkCard style={[styles.card]}>
              <View rkCardHeader>
                <Text style={[{fontSize: 20, fontFamily: 'nasalization', opacity: 1}]}>Pulos ({progressJumps.toString()}/{maxJumps.toString()})</Text>
              </View>
              <View rkCardContent style={{alignItems: 'center'}}>
                <Text style={{fontSize: 25, fontFamily: 'nasalization', opacity: 1}}>{(jumps / nextJumps * 100).toFixed(2)}%</Text>
              </View>
              <View style={{width: '100%', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginTop: -40}}>
                <Text style={{fontSize: 18, fontFamily: 'nasalization', opacity: 1}}>{jumps.toString()} <Text style={{fontSize: 64}} > → </Text> {(nextJumps).toString()}</Text>
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <RkButton style={styles.curiosidades} rkType='start' onPress={this.showJumpsPrizes}>
                  {/* <LinearGradient style={{width: '100%', height: 60, justifyContent: 'center', alignItems: 'center'}} colors={['#a73a86', '#e650b9']}> */}
                    <Text style={styles.startText}>
                      Curiosidades
                    </Text> 
                  {/* </LinearGradient> */}
                </RkButton>
              </View>
            </RkCard>
          </ScrollView>
        {/* </View> */}
        <StatusBar hidden={true}/>
      </ImageBackground>
    )
  }

  game = () => {
    return (
      <ImageBackground source={require('./assets/background.jpg')} style={{width: '100%', height: '100%'}}>
        <GameEngine
          style={styles.game}
          systems={[Controller]}
          entities={{
            gameState: {
              inGame: true,
              endGame: this.endGame,
              renderer: <GameState/>
            },
            score: {
              score: 0,
              jumps: 0,
              renderer: <Score/>
            },
            character: {
              position: [Dimensions.get('window').width / 2 - 20, Dimensions.get('window').height / 2],
              size: [43.8, 79],
              speed: -10,
              renderer: <Character/>
            },
            p1: {
              position: [randomW(60), 60],
              size: [60, 14.8],
              renderer: <Platform/>
            }, 
            p2: {
              position: [randomW(60), 120],
              size: [60, 14.8],
              renderer: <Platform/>
            },
            p3: {
              position: [randomW(60), 180],
              size: [60, 14.8],
              renderer: <Platform/>
            },
            p4: {
              position: [randomW(60), 240],
              size: [60, 14.8],
              renderer: <Platform/>
            },
            p5: {
              position: [randomW(60), 300],
              size: [60, 14.8],
              renderer: <Platform/>
            },
            p6: {
              position: [randomW(60), 360],
              size: [60, 14.8],
              renderer: <Platform/>
            },
            p7: {
              position: [randomW(60), 420],
              size: [60, 14.8],
              renderer: <Platform/>
            },
            p8: {
              position: [randomW(60), 480],
              size: [60, 14.8],
              renderer: <Platform/>
            },
            p9: {
              position: [randomW(60), 540],
              size: [60, 14.8],
              renderer: <Platform/>
            },
          }}>
          <StatusBar hidden={true}/>
        </GameEngine>
      </ImageBackground>
    )
  }

  gameOver = () => {
    // TODO
    // let { bestD } = this.state
    // if (this.state.bestD[0] != false)
    // return (
    //   <PopUp title='Curiosidade(s) liberada(s)!'>
    //     {bestD.map((value, index) => {
    //       <Curiosidade type='distance' number={value + 1} text={this.props.text} score={this.props.score} />
    //     })}
    //   </PopUp>
    // )
    // else
    return (
      <ImageBackground source={require('./assets/splash_background.jpg')} style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
          <View style={styles.center}>
            <StarBotsLogo/>
            <Text style={[styles.white, {paddingTop: 25, fontSize: 20, fontFamily: 'OpenDyslexicAlta'}]}>pontuação obtida</Text>
            <Text style={styles.score}>{this.state.score ? this.state.score : 0}</Text>
            <Text style={styles.newRecord}>{this.state.newRecord ? 'Novo recorde!' : ''}</Text>
          </View>
          <RkButton style={styles.startButton} rkType='start' onPress={this.gotoMenu}>
            <LinearGradient style={{width: '200%', height: 60, justifyContent: 'center', alignItems: 'center'}} colors={['#eeede9', '#e2e0da', '#d5d2c9']}>
              <Text style={[styles.startText, /*styles.white*/]} >
                Voltar
              </Text> 
            </LinearGradient>
          </RkButton>
        </View>
        <StatusBar hidden={true}/>
      </ImageBackground>
    )
  }

  startScreen = () => {
    let { record } = this.state
    let { distance } = this.state

    return (
      <ImageBackground source={require('./assets/start.jpg')} style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
          <Logo/>
          
          <View style={styles.statsview}>
            <Text style={[styles.white, {paddingTop: 50, fontSize: 20, fontFamily: 'nasalization'}]}>recorde</Text>
            <Text style={styles.record}>{record}</Text>
            {/* <Text style={[styles.white, {paddingTop: 25, fontSize: 20, fontFamily: 'nasalization'}]}>distância total</Text>
            <Text style={styles.record}>{distance}</Text> */}
            {/* <Text style={styles.stats}>Recorde:</Text>
            <Text style={styles.score}>{record}</Text> */}
            {/* <Text style={styles.stats}>Distância total: {distance}</Text> */}
          </View>

          <Character position={[Dimensions.get('window').width / 2 - 22, Dimensions.get('window').height / 2 + 70]} size={[43.8, 79]}/>

          <RkButton style={styles.startButton} rkType='start' onPress={this.startGame}>
            <LinearGradient style={{width: '200%', height: 60, justifyContent: 'center', alignItems: 'center'}} colors={['#ffde59', '#ffe47a']}>
              <Text style={styles.startText} >
                Iniciar
              </Text> 
            </LinearGradient>
          </RkButton>
          <RkButton style={styles.conquistas} rkType='start' onPress={this.gotoAchievements}>
            <LinearGradient style={{width: '200%', height: 60, justifyContent: 'center', alignItems: 'center'}} colors={['#eeede9', '#e2e0da']}>
              <Text style={styles.startText} >
                Conquistas
              </Text> 
            </LinearGradient>
          </RkButton>
          <StatusBar hidden={true}/>
        </View>
      </ImageBackground>
    )
  }

  loading = () => {
    return (
      <AppLoading
        startAsync={this._loadResourcesAsync}
        onError={this._handleLoadingError}
        onFinish={this._handleFinishLoading}
      >
        <StatusBar hidden={true}/>
      </AppLoading>
    )
  }

  render = () => {
    if (this.state.isLoadingComplete) {
      if (this.state.achievements){
        if (this.state.prize) 
          return this.prizes(this.state.prize)
        else
          return this.achievements()
      }
      else if (this.state.inGame)
        return this.game()
      else if (this.state.gameOver)
        return this.gameOver()
      else 
        return this.startScreen()
    }
    else
      return this.loading()
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

function randomW(w) {
  let max = Dimensions.get('window').width - w
  return Math.random() * max
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#272932',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 20
  },
  fullScreen: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  game: {
    flex: 1,
    // backgroundColor: '#5E2750'
  },
  char: {
    height: 100,
    width: 100,
    position: 'absolute',
    zIndex: 2,
    // top: 100,
    resizeMode: 'stretch'
  },
  logo: {
    position: 'absolute',
    top: 0,
    width: 220,
    resizeMode: 'contain'
  },
  starbots: {
    position: 'absolute',
    top: - (Dimensions.get('window').height / 2),
    width: 200,
    resizeMode: 'contain'
  },
  startButton: {
    position: 'absolute',
    bottom: 130,
    width: '60%',
    // height: 60,
    borderColor: '#fff',
    borderWidth: 2
    // backgroundColor: '#E3170A',
  },
  curiosidades: {
    position: 'relative',
    // marginTop: 50,
    width: '80%',
    // height: 60,
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 20

    // backgroundColor: '#E3170A',
  },
  conquistas: {
    position: 'absolute',
    bottom: 80,
    width: '60%',
    // height: 60,
    borderColor: '#fff',
    borderWidth: 2
    // backgroundColor: '#E3170A',
  },
  startText: {
    fontFamily: 'thaleah',
    fontSize: 24,
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
    color: '#fff'
  },
  background: {
    zIndex: -1,

  },
  platform: {
    height: 30,
    width: 60,
    position: 'absolute',
    // resizeMode: 'stretch',
    zIndex: 1
  },
  startScreen: {
    flex: 1,
    alignItems: 'center'
  },
  center: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center'
  },
  score: {
    fontSize: 46,
    zIndex: 4,
    fontFamily: 'nasalization',
    color: '#fff',
    top: -160
  },
  white: {
    color: '#fff',
    // width: '100%',
    // alignItems: 'center'
  },
  button: {
    width: '60%',
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 150
  },
  record: {
    color: '#fff',
    fontSize: 48,
    fontFamily: 'nasalization'
  },
  distance: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'nasalization',
    top: -50,
    position: 'relative'
  },
  statsview: {
    width: Dimensions.get('window').width,
    // height: 50,
    position: 'absolute',
    top: 180,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffff90',
    marginBottom: 25,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10
  },
  prizeCard: {
    width: '90%',
    backgroundColor: '#ffffff90',
    marginBottom: 25,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10
  },
  fullW: {
    width: '100%'
  },
  centerContent: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  newRecord: {
    color: '#ffde59',
    fontSize: 32,
    zIndex: 4,
    fontFamily: 'thaleah',
    // color: '#fff',
    top: -120
  }
});

AppRegistry.registerComponent('App', () => App)
