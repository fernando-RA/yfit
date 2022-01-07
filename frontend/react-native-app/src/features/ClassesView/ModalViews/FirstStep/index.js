import React, {useCallback} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {StyleSheet, View, Dimensions} from 'react-native';

import Text from '../../../../components/Typography';
import Inputs from '../../../../components/Inputs';
import FooterButton from '../FooterButton';
import KeyboardAvoidContainer from '../KeyboardAvoidContainer';

import DatePickers from './DatePickers';

import * as actions from '../../redux/actions';

const FirstStep = ({currentIndex, updateIndex}) => {
  const state = useSelector(stateRX => stateRX.Classes.classData);
  const dispatch = useDispatch();

  const changeName = useCallback(
    e => {
      dispatch(actions.setClassName(e));
    },
    [dispatch],
  );

  const goForward = () => {
    updateIndex(currentIndex + 1);
  };

  if (state.name.toLowerCase() === '-*- throw the error -*-') {
    throw new Error('TEST ERROR');
  }
  return (
    <KeyboardAvoidContainer
      footerButtonComponent={
        <FooterButton goForward={goForward} currentIndex={currentIndex} />
      }>
      <View style={styles.container}>
        <View>
          <Text h2>About your class</Text>
          <Text bodyMedium>You can edit your class information later.</Text>
          <Inputs.Input
            label="Name your class"
            value={state.name}
            placeholder="Workout in the park"
            onChangeText={changeName}
            autoFocus={false}
          />
          <DatePickers />
        </View>
      </View>
    </KeyboardAvoidContainer>
  );
};
export default withNavigation(FirstStep);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
    flex: 1,
    height: '100%',
  },
});
