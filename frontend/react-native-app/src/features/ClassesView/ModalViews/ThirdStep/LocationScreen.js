import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {Formik} from 'formik';

import Text from '../../../../components/Typography';
import Inputs from '../../../../components/Inputs/index';
import {ButtonGroup} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import * as actions from '../../redux/actions';
import {linkValidate} from '../validation';
import KeyboardAvoidContainer from '../KeyboardAvoidContainer';
import FooterButton from '../FooterButton';

const TRAINING_TYPES = ['In person', 'Virtual'];

const LocationScreen = props => {
  const dispatch = useDispatch();
  const state = useSelector(stateRX => stateRX.Classes.classData);

  const updateTypeOfClasses = React.useCallback(
    selectedTypeOfClasses => {
      dispatch(actions.setTypeOfClasses(selectedTypeOfClasses));
    },
    [dispatch],
  );

  const goForward = () => {
    props.updateIndexOfStage(props.currentIndex + 1);
  };

  const changeLocationNotes = React.useCallback(
    e => {
      dispatch(actions.setLocationNotesAction(e));
    },
    [dispatch],
  );

  const changeSafeProtocol = React.useCallback(
    e => {
      dispatch(actions.setSafeProcotol(e));
    },
    [dispatch],
  );

  const changeVirtualLink = React.useCallback(
    (value, error) => {
      dispatch(actions.setVirtualLink(value, error));
    },
    [dispatch],
  );

  const changeVirtualPassword = React.useCallback(
    e => {
      dispatch(actions.setVirtualPassword(e));
    },
    [dispatch],
  );

  const EntypoIconRender = React.useCallback(
    () => (
      <View style={styles.entypoIcon}>
        <EntypoIcon name="chevron-small-right" size={35} />
      </View>
    ),
    [],
  );

  const goToLocationSearch = React.useCallback(() => {
    props.updateIndexOfScreen(1);
  }, [props]);

  const inPersonRender = () => (
    <View>
      <TouchableOpacity activeOpacity={0.6} onPress={goToLocationSearch}>
        <Inputs.Input
          label="Enter a location name or address"
          bold
          placeholder="Add a location"
          rightIcon={EntypoIconRender()}
          editable={false}
          pointerEvents="none"
          value={state.location.location_name}
        />
      </TouchableOpacity>
      <Inputs.TextInput
        label="Location notes (optional)"
        bold
        placeholder="Meet at the north side of the park near the fountain."
        limit={100}
        containerStyles={{marginBottom: 25}}
        value={state.location_notes}
        onChangeText={changeLocationNotes}
        autoFocus={false}
      />
      <Inputs.TextInput
        label="Safety protocols"
        bold
        value={state.safety_protocol}
        onChangeText={changeSafeProtocol}
        autoFocus={false}
      />
    </View>
  );

  const inVirtualRender = () => (
    <View>
      <Formik
        initialValues={{link: state.link.value}}
        initialErrors={state.link.error ? {link: state.link.error} : {}}
        validate={values => linkValidate(values, changeVirtualLink)}
        validateOnBlur
        validateOnChange>
        {({handleChange, handleBlur, values, errors, touched}) => (
          <Inputs.TextInput
            label="Add a shareable link"
            bold
            placeholder="www.zoom.com/123"
            containerStyles={{marginBottom: 25}}
            value={values.link}
            onBlur={handleBlur('link')}
            onChangeText={handleChange('link')}
            errors={errors.link}
            touched={touched}
            autoFocus={false}
          />
        )}
      </Formik>
      <Inputs.Input
        label="Add a password (optional)"
        bold
        placeholder="Password"
        onChangeText={changeVirtualPassword}
        value={state.password}
        autoFocus={false}
      />
    </View>
  );

  return (
    <KeyboardAvoidContainer
      footerButtonComponent={
        <FooterButton goForward={goForward} currentIndex={props.currentIndex} />
      }>
      <View style={styles.container}>
        <View>
          <Text h2>Location</Text>
          <Text bodyMedium>Let attendees know where to go.</Text>
          <ButtonGroup
            onPress={updateTypeOfClasses}
            selectedIndex={state.type}
            buttons={TRAINING_TYPES}
            containerStyle={styles.groupButton}
            textStyle={{fontWeight: 'bold'}}
            selectedButtonStyle={{backgroundColor: '#333333'}}
          />
          {!state.type ? inPersonRender() : inVirtualRender()}
        </View>
      </View>
    </KeyboardAvoidContainer>
  );
};

export default withNavigation(LocationScreen);

const styles = StyleSheet.create({
  groupButton: {
    height: 40,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 50,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
    marginTop: 70,
  },
  entypoIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    right: -10,
  },
});
