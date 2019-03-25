import React, { PureComponent } from 'react';
import { StyleSheet, Image, Animated, View } from 'react-native';

class Character extends PureComponent {
  // constructor(props) {
  //   super(props)
  // }
  render() {
    // let x = this.props.position[0]
    // let y = this.props.position[1]
    // let side = this.props.side
    // return (
    //   <Image style={[styles.char, {transform: [ { translateX: x }, { translateY: y }, { rotateY: side ? side : '0deg' } ]}]} source={require('.././assets/astronaut.png')} />
    // )

    const x = this.props.position[0]
    const y = this.props.position[1]

    return (
      <View style={[styles.view, { left: x, top: y}]} />
    )
  }
}

const styles = StyleSheet.create({
  char: {
    height: 80,
    width: 43.80,
    position: 'absolute',
    zIndex: 1,
    // top: 100,
    resizeMode: 'stretch'
  },
  view: {
    borderColor: "#CCC",
    borderWidth: 4,
    width: 40,
    height: 40,
    backgroundColor: "#191919",
    position: "absolute"
  }
});

export { Character }
