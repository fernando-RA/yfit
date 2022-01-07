import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

import Text from '../../../../components/Typography/index';
import Inputs from '../../../../components/Inputs/index';
import FooterButton from '../FooterButton';
import KeyboardAvoidContainer from '../KeyboardAvoidContainer';
import Tags from './Tags';

import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../redux/actions';
import {withNavigation} from 'react-navigation';

const SecondStep = ({updateIndex, currentIndex}) => {
  const state = useSelector(stateRX => stateRX.Classes.classData);
  const dispatch = useDispatch();

  const onPressImagePicker = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 1,
      includeBase64: true,
    };

    ImagePicker.launchImageLibrary(options, response => {
      response.data = response.base64;
      delete response.base64;
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        dispatch(actions.changePhoto(response));
      }
    });
  };

  const changeDetails = e => {
    dispatch(actions.setDetails(e));
  };
  const changeEquipments = e => {
    dispatch(actions.setEquipments(e));
  };

  const goForward = () => {
    updateIndex(currentIndex + 1);
  };

  return (
    <KeyboardAvoidContainer
      footerButtonComponent={
        <FooterButton goForward={goForward} currentIndex={currentIndex} />
      }>
      <View style={styles.container}>
        <View>
          <Text h2>About your class</Text>
          <Text bodyMedium>You can edit your class information later.</Text>
        </View>
        <View>
          <Text style={styles.label} bodyLargeBold>
            Add featured photo
          </Text>
          {state.featured_photo?.uri ||
          (typeof state.featured_photo === 'string' && state.featured_photo) ? (
            <View style={styles.photoContainer}>
              <Image
                style={styles.classesPhoto}
                source={{
                  uri:
                    typeof state.featured_photo === 'string' &&
                    state.featured_photo
                      ? state.featured_photo
                      : state.featured_photo?.uri,
                }}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.6}
                onPress={() => dispatch(actions.deletePhoto())}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={'rgba(0, 0, 0, 0.6)'}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onPressImagePicker}
              style={styles.takePhoto}>
              <MaterialIcons name="add-a-photo" size={24} color={'#BDBDBD'} />
            </TouchableOpacity>
          )}
          <Inputs.TextInput
            placeholder="Let your attendees know what to expect during your class."
            label="Details"
            value={state.details}
            limit={300}
            onChangeText={changeDetails}
            containerStyles={{marginBottom: 30}}
            autoFocus={false}
          />
          <Inputs.Input
            label="Equipment required"
            small
            bold
            placeholder="Water bottle, towel, yoga mat, etc"
            value={state.equipment}
            onChangeText={changeEquipments}
            autoFocus={false}
          />
        </View>
        <Tags />
      </View>
    </KeyboardAvoidContainer>
  );
};

export default withNavigation(SecondStep);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 70,
  },
  label: {
    paddingBottom: 8,
  },
  takePhoto: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 12,
    marginBottom: 20,
  },
  classesPhoto: {
    width: 210,
    height: 190,
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    width: 26,
    height: 26,
    right: -13,
    top: -13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BDBDBD',
    borderRadius: 30,
  },
  photoContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 70,
    zIndex: 1,
  },
});
