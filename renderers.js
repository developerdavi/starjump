import React, { PureComponent } from 'react';
import { StyleSheet, Image, Animated, View, Text } from 'react-native';
import { Font } from 'expo';

class Character extends PureComponent {
  render() {
    if (!this.props.b) {
      let x = this.props.position[0]
      let y = this.props.position[1]
      let w = this.props.size[0]
      let h = this.props.size[1]
      let side = this.props.side

      return (
        <Image style={[styles.char, {transform: [ { rotateY: side ? side : '0deg' } ]}, {left: x, top: y, width: w, height: h}]} source={require('./assets/astronaut.png')} />
      )
    } else {
      return (
        <Image style={[styles.char, {left: this.props.b[0], bottom: this.props.b[1]}]} source={require('./assets/astronaut.png')} />
      )
    }
  }
}

class Platform extends PureComponent {
  constructor() {
    super()
    let images = [require('./assets/ground_grass.png'), require('./assets/ground_grass_broken.png'), require('./assets/ground_stone.png'), require('./assets/ground_stone_broken.png')]
    let i = Math.round(Math.random() * 3)
    let image = images[i]
    this.state = {
      image: image
    }
  }
  render() {
    let x = this.props.position[0]
    let y = this.props.position[1]
    let w = this.props.size[0]
    let h = this.props.size[1]
    let image = this.state.image
    
    if (this.props.effects == 'lava')
      image = require('./assets/ground_lava.png')

    return (
      <Image style={[styles.platform, {left: x, top: y, width: w, height: h} ]} source={image}/>
    )
  }
};

class Score extends PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View style={styles.center}>
        <Text style={styles.score}>{this.props.score ? this.props.score : 0}</Text>
      </View>
    )
  }
}

class Logo extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{width: '100%', alignItems: 'center', position: 'absolute', top: 100}}>
        <Image style={[styles.logo]} source={require('./assets/logo.png')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  char: {
    height: 80,
    width: 43.80,
    position: 'absolute',
    zIndex: 3,
    // top: 100,
    resizeMode: 'stretch'
  },
  center: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  score: {
    fontSize: 32,
    zIndex: 4,
    fontFamily: 'nasalization',
    color: '#fff'
  },
  platform: {
    position: 'absolute',
    // resizeMode: 'contain',
    zIndex: 2
  },
  platforms: {
    position: 'absolute',
    zIndex: 1,
    flex: 1
  }
});



export { Character, Platform, Score, Logo }
