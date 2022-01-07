import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

export default class SimpleCircleButton extends React.Component {
  render() {
    let localStyles = styles(this.props); //need to load styles with props because the styles rely on prop values

    return (
      <View style={localStyles.container}>
        <TouchableOpacity
          activeOpacity={0.8} //The opacity of the button when it is pressed
          style={localStyles.button}
          onPress={this.props.onPress}
          disabled={this.props.disabled}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = props =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      zIndex: 10,
      top: props.top,
      left: props.left,
      right: props.right,
      bottom: props.bottom,
      backgroundColor: 'transparent', //add a background to highlight the touchable area
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
    button: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignContent: 'center',
      borderRadius: props.circleDiameter / 2,
      width: props.ellipsis ? undefined : props.circleDiameter,
      height: props.circleDiameter,
    },
  });
