import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import DimensionsStyle from '../../../../../utils/DimensionUtils';
import CloseButton from './CloseButton';
import BackButton from './BackButton';
import ForwardButton from './ForwardButton';

const WebHeader = props => {
  return (
    <View style={styles.container}>
      <CloseButton onClose={props.onClose} />
      <BackButton goBack={props.goBack} />
      <ForwardButton goForward={props.goForward} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    width: '100%',
    paddingTop: DimensionsStyle.safeAreaTopHeight,
  },
});

export default WebHeader;
