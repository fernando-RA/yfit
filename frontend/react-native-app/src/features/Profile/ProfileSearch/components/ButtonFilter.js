import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import BoxingIcon from '../../../../assets/icons/Boxing.svg';
import BoxingIconGreen from '../../../../assets/icons/Boxing-green.svg';
import YogaIcon from '../../../../assets/icons/Yoga.svg';
import YogaIconGreen from '../../../../assets/icons/Yoga-green.svg';
import HIITIcon from '../../../../assets/icons/HIIT.svg';
import HIITIconGreen from '../../../../assets/icons/HIIT-green.svg';
import MeditationIcon from '../../../../assets/icons/Meditation.svg';
import MeditationIconGreen from '../../../../assets/icons/Meditation-green.svg';
import * as constants from './../constants';

const ButtonFilter = props => {
  let Variant = BoxingIcon;

  switch (props.type.workout_type) {
    case constants.Boxing:
      if (props.isSelected) {
        Variant = BoxingIconGreen;
      } else {
        Variant = BoxingIcon;
      }
      break;
    case constants.Yoga:
      if (props.isSelected) {
        Variant = YogaIconGreen;
      } else {
        Variant = YogaIcon;
      }
      break;
    case constants.HIIT:
      if (props.isSelected) {
        Variant = HIITIconGreen;
      } else {
        Variant = HIITIcon;
      }
      break;
    case constants.Meditation:
      if (props.isSelected) {
        Variant = MeditationIconGreen;
      } else {
        Variant = MeditationIcon;
      }
      break;
    default:
      Variant = null;
      break;
  }

  if (Variant) {
    const styles = stylesFunc(props);

    return (
      <View style={styles.button}>
        <TouchableOpacity onPress={props.onPress(props.type)}>
          <View style={styles.image}>
            <Variant width={48} height={48} />
          </View>
          <Text style={styles.text}>{props.type.workout_type}</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return null;
  }
};

export default ButtonFilter;

const stylesFunc = StyleSheet.create(props => ({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    color: props.isSelected ? '#1CC900' : '#000',
  },
  image: {
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
}));
