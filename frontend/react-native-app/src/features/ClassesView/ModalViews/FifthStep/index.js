import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';

import Text from '../../../../components/Typography';
import DefaultButton from '../../../../components/Buttons/DefaultButton';
import {CheckBox} from 'react-native-elements';

import * as actions from '../../redux/actions';

export const POLICY = [
  {
    id: 0,
    value: 'Flexible',
    text1: 'Full refund up to 12 hours before class.',
    text2: '50% refund after 12 hours before class.',
  },
  {
    id: 1,
    value: 'Moderate',
    text1: 'Full refund up to 24 hours before class.',
    text2: '50% refund after 24 hours before class.',
  },
  {
    id: 2,
    value: 'Strict',
    text1: 'Full refund up to 24 hours before class.',
    text2: 'No refund after 24 hours before class.',
  },
];

const FifthStep = props => {
  const existingClass = props.navigation.getParam('existingClass');
  const state = useSelector(stateRX => stateRX.Classes.classData);
  const dispatch = useDispatch();

  const goToPreview = () => {
    props.navigation.navigate('PreviewScreen', {existingClass, edited: true});
  };

  const onCheckboxChange = React.useCallback(
    policy => {
      dispatch(actions.setPolicy(policy));
    },
    [dispatch],
  );

  return (
    <View style={styles.container}>
      <View>
        <Text h2>Cancellation policy</Text>
        <Text bodyMedium>Tell attendees what to expect if they cancel.</Text>
        <View style={{marginTop: 40}}>
          {POLICY.map(policy => (
            <View key={policy.id} style={styles.row}>
              <View style={styles.left}>
                <Text h4 style={{marginBottom: 7}}>
                  {policy.value}
                </Text>
                <Text bodyMedium>{policy.text1}</Text>
                <Text bodyMedium>{policy.text2}</Text>
              </View>
              <View style={styles.right}>
                <CheckBox
                  checked={
                    state.cancellation_policy === policy.value.toLowerCase()
                  }
                  checkedColor="#5FE487"
                  uncheckedIcon={<View style={styles.checkboxUnchecked} />}
                  checkedIcon={<View style={styles.checkboxIcon} />}
                  containerStyle={styles.checkboxContainer}
                  onPress={() => onCheckboxChange(policy.value.toLowerCase())}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.button}>
        <DefaultButton text="Finish" onPress={goToPreview} />
      </View>
    </View>
  );
};

export default withNavigation(FifthStep);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
    justifyContent: 'space-between',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  left: {
    flex: 0.85,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#5FE487',
    borderRadius: 20,
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  checkboxUnchecked: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
});
