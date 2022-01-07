import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import {HEADER_BUTTONS} from '../constants';

const HeaderButtonGroup = props => {
  return (
    <View style={styles.container}>
      <ButtonGroup
        onPress={props.toggleSearchType}
        selectedIndex={props.selectedSearchType}
        buttons={HEADER_BUTTONS}
        containerStyle={styles.buttonContainer}
        selectedButtonStyle={styles.selectedButton}
        textStyle={styles.textStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    width: 240,
    height: 30,
    borderRadius: 12,
  },
  selectedButton: {
    backgroundColor: '#000',
    color: '#fff',
  },
  textStyle: {
    fontSize: 16,
  },
});

export default HeaderButtonGroup;
