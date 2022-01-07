import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'react-native-image-picker';
import Swiper from 'react-native-swiper';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import {Input} from 'react-native-elements';

import CircleButton from '../../../components/Buttons/CircleButton';
import * as constants from '../redux/constants';

import InputSection from './InputSection';
import WorkoutTypeButton from './WorkoutTypeButton';
// import KeyboardShift from '../../../components/KeyboardShift';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

import DimensionUtils from '../../../utils/DimensionUtils';

const initialState = {
  photo: '',
  first_name: '',
  last_name: '',
  instagram_link: '',
  workout_types: [],
  bio: '',
};

const reducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case constants.CHANGE_PHOTO:
      return {...state, photo: payload};
    case constants.CHANGE_FIRST_NAME:
      return {...state, first_name: payload};
    case constants.CHANGE_LAST_NAME:
      return {...state, last_name: payload};
    case constants.CHANGE_INSTAGRAM_LINK:
      return {
        ...state,
        instagram_link: payload,
      };
    case constants.WORKOUT_TYPES_ADD:
      return {...state, workout_types: [...state.workout_types, payload]};
    case constants.WORKOUT_TYPES_REMOVE:
      return {
        ...state,
        workout_types: [...state.workout_types].filter(
          elem => elem.id !== payload.id,
        ),
      };
    case constants.CHANGE_ABOUT:
      return {...state, bio: payload};

    default:
      return state;
  }
};

const {width} = Dimensions.get('window');

const isSelectedType = (type, allTypes) =>
  allTypes.map(t => t.id).includes(type.id);

const LIMIT = 300;

const renderPagination = (index, total, context) => {
  return (
    <View style={styles.paginationStyle}>
      <Text style={{color: 'white'}}>
        <Text style={styles.paginationText}>{index + 1}</Text> of {total}
      </Text>
    </View>
  );
};

const TrainerEditProfile = props => {
  const user = useSelector(stateRX => stateRX.Calendar.user.user);
  const workout_types = useSelector(
    stateRX => stateRX.CommonData.workout_types,
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  const [validationState, setValidationState] = useState({
    instagramLinkValid: true,
    nameValid: true,
    lastNameValid: true,
    bioValid: !!state.bio,
    formErrors: {
      instagram_link: '',
      name: '',
      lastName: '',
      bio: '',
    },
  });

  const [isFormValid, setValidationForm] = useState(true);
  const dispatchRedux = useDispatch();

  const onPressImagePicker = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 1,
      includeBase64: true,

      // maxWidth: 400,
      // maxHeight: 400,
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
        dispatchRedux({
          type: constants.UPDATEPROFILEIMAGE_REQUEST_SUCCESS,
          data: {image: response},
        });
        dispatch({
          type: constants.CHANGE_PHOTO,
          payload: response.uri,
        });
      }
    });
  };

  const onPressSave = () => {
    const stateToSave = {...state};

    if (validationState.instagramLinkValid) {
      stateToSave.instagram_link = `https://www.instagram.com/${stateToSave.instagram_link
        .split('')
        .slice(1)
        .join('')}`;
    } else {
      stateToSave.instagram_link = '';
    }
    dispatchRedux({
      type: constants.SAVE_TRAINER_PROFILE,
      payload: {...stateToSave, workout_types: state.workout_types},
    });
  };

  const onPressEdit = () => {
    onPressImagePicker();
  };

  const handleChange = type => event => {
    dispatch({type, payload: event});
  };

  useEffect(() => {
    validateField(constants.CHANGE_ABOUT, state.bio);
  }, [state.bio, validateField]);

  useEffect(() => {
    validateField(constants.CHANGE_FIRST_NAME, state.first_name);
  }, [state.first_name, validateField]);

  useEffect(() => {
    validateField(constants.CHANGE_INSTAGRAM_LINK, state.instagram_link);
  }, [state.instagram_link, validateField]);
  useEffect(() => {
    validateField(constants.CHANGE_LAST_NAME, state.last_name);
  }, [state.last_name, validateField]);

  useEffect(() => {
    validateForm();
  }, [
    validateForm,
    validationState.nameValid,
    state.first_name,
    validationState.lastNameValid,
    state.last_name,
    validationState.instagramLinkValid,
    state.instagram_link,
    validationState.bioValid,
  ]);

  useEffect(() => {
    dispatch({type: constants.CHANGE_FIRST_NAME, payload: user.first_name});
    dispatch({type: constants.CHANGE_LAST_NAME, payload: user.last_name});
    dispatch({
      type: constants.CHANGE_INSTAGRAM_LINK,
      payload: user.instagram_link
        ? `@${user.instagram_link.split('/').pop()}`
        : '',
    });
    dispatch({
      type: constants.CHANGE_ABOUT,
      payload: user.bio || '',
    });
    dispatch({
      type: constants.CHANGE_PHOTO,
      payload: user.profile_picture
        ? user.profile_picture
        : user.social_profile_url,
    });
    user.workout_types.forEach(type => {
      dispatch({type: constants.WORKOUT_TYPES_ADD, payload: type});
    });
  }, [user]);

  const onWorkoutTypePress = type => () => {
    const isSelected = isSelectedType(type, state.workout_types);
    console.log({type, isSelected, workout_types: state.workout_types});
    if (isSelected) {
      dispatch({type: constants.WORKOUT_TYPES_REMOVE, payload: type});
    } else {
      dispatch({type: constants.WORKOUT_TYPES_ADD, payload: type});
    }
  };

  const goToProfile = () => {
    props.navigation.navigate('Home');
  };

  const validateForm = useCallback(() => {
    setValidationForm(
      validationState.nameValid &&
        validationState.lastNameValid &&
        validationState.bioValid,
    );
  }, [
    validationState.nameValid,
    validationState.lastNameValid,
    validationState.bioValid,
  ]);

  const validateField = useCallback(
    (type, value) => {
      let fieldValidationErrors = validationState.formErrors;
      let instagramLinkValid = validationState.instagramLinkValid;
      let nameValid = validationState.first_name;
      let lastNameValid = validationState.last_name;

      switch (type) {
        case constants.CHANGE_INSTAGRAM_LINK:
          if (value.length > 1) {
            instagramLinkValid = value.match(
              /^@(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gi,
            );
          } else {
            instagramLinkValid = false;
          }
          fieldValidationErrors.instagram_link = instagramLinkValid
            ? ''
            : ' Invalid user name';
          setValidationState({
            ...validationState,
            instagramLinkValid: instagramLinkValid,
          });
          break;
        case constants.CHANGE_LAST_NAME:
          if (value.length === 0) {
            lastNameValid = false;
          } else {
            lastNameValid = true;
          }
          setValidationState({
            ...validationState,
            lastNameValid: lastNameValid,
          });
          fieldValidationErrors.last_name = lastNameValid
            ? ''
            : 'Last Name cannot be empty';
          break;

        case constants.CHANGE_FIRST_NAME:
          if (value.length === 0) {
            nameValid = false;
          } else {
            nameValid = true;
          }
          setValidationState({...validationState, nameValid: nameValid});
          fieldValidationErrors.first_name = nameValid
            ? ''
            : 'Name cannot be empty';

          break;

        case constants.CHANGE_ABOUT:
          if (value.length === 0) {
            bioValid = false;
          } else {
            bioValid = true;
          }
          setValidationState({...validationState, bioValid: bioValid});
          fieldValidationErrors.bio = bioValid ? '' : 'Bio cannot be empty';
          break;
        default:
          break;
      }
      // setValidationState({
      //   ...validationState,
      //   formErrors: fieldValidationErrors,
      //   instagramLinkValid: instagramLinkValid,
      //   nameValid: nameValid,
      //   lastNameValid: nameValid,
      // });
    },
    [
      validationState,
      // validationState.formErrors,
      // validationState.instagramLinkValid,
      // validationState.first_name,
      // validationState.last_name,
    ],
  );

  return (
    <ScrollView>
      <CircleButton
        onPress={goToProfile}
        circleDiameter={32}
        top={DimensionUtils.safeAreaBottomHeight + 45}
        left={12}>
        <FontAwesomeIcon
          name="chevron-left"
          size={18}
          color="#333333"
          style={{alignSelf: 'center'}}
        />
      </CircleButton>
      <CircleButton
        onPress={onPressSave}
        circleDiameter={32}
        ellipsis
        top={DimensionUtils.safeAreaBottomHeight + 45}
        right={24}
        disabled={!isFormValid}>
        <Text
          style={
            isFormValid ? styles.saveButtonText : styles.saveButtonTextDisabled
          }>
          Save
        </Text>
      </CircleButton>
      <CircleButton
        onPress={onPressEdit}
        circleDiameter={32}
        top={DimensionUtils.safeAreaBottomHeight + 220}
        right={24}>
        <MaterialIcon
          name="edit"
          size={18}
          color="#333333"
          style={{alignSelf: 'center'}}
        />
      </CircleButton>

      {state.photo ? (
        <View
          containerStyle={styles.wrapper}
          // renderPagination={renderPagination}
          loop={false}
          height={300}>
          <View style={styles.slide}>
            <ImageBackground
              style={styles.image}
              source={{
                uri: state.photo,
              }}
            />
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={onPressImagePicker}>
          <View style={styles.takePhoto}>
            <MaterialIcon
              name="add-a-photo"
              color="#DADADA"
              size={35}
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
      )}
      <KeyboardAvoidingScrollView>
        <View style={styles.inputs}>
          <View style={styles.creds}>
            <InputSection title="First name" type="half">
              <Input
                placeholder="Enter first name"
                containerStyle={styles.input}
                onChangeText={handleChange(constants.CHANGE_FIRST_NAME)}
                value={state.first_name}
                errorMessage={validationState.formErrors.first_name}
              />
            </InputSection>
            <InputSection title="Last name" type="half">
              <Input
                placeholder="Enter last name"
                containerStyle={styles.input}
                onChangeText={handleChange(constants.CHANGE_LAST_NAME)}
                value={state.last_name}
                errorMessage={validationState.formErrors.last_name}
              />
            </InputSection>
          </View>
          <InputSection title="Instagram">
            <Input
              placeholder="@yourname"
              onChangeText={handleChange(constants.CHANGE_INSTAGRAM_LINK)}
              value={state.instagram_link}
              containerStyle={styles.input}
              errorMessage={validationState.formErrors.instagram_link}
            />
          </InputSection>
          <InputSection title="Workout types">
            <View style={{...styles.buttonGroup, ...styles.workouts}}>
              {workout_types.map(type => (
                <WorkoutTypeButton
                  key={type.id}
                  name={type.workout_type}
                  onPress={onWorkoutTypePress(type)}
                  selected={isSelectedType(type, state.workout_types)}
                  // selected={state.workout_types.includes(type)}
                />
              ))}
            </View>
          </InputSection>
          <InputSection title="About me">
            <TextInput
              multiline
              errorMessage={validationState.formErrors.bio}
              maxLength={300}
              placeholder="Tell us a little about what type of trainer you are"
              style={styles.textInput}
              value={state.bio ? state.bio : ''}
              onChangeText={handleChange(constants.CHANGE_ABOUT)}
            />
            <Text style={styles.reamainingChars}>
              {state.bio.length}/{LIMIT}
            </Text>
          </InputSection>
          {
            <Text style={styles.textDanger}>
              {validationState.formErrors.bio}
            </Text>
          }
        </View>
      </KeyboardAvoidingScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  takePhoto: {
    height: 300,
    width: width,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'relative',
    // paddingTop: DimensionUtils.safeAreaTopHeight,
  },
  saveButtonText: {
    paddingHorizontal: 18,
    color: '#5A76AB',
    fontWeight: '800',
  },
  inputs: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: width,
    padding: 16,
  },
  textInput: {
    borderWidth: 1,
    padding: 19,
    paddingTop: 19,
    borderColor: '#BDBDBD',
    marginTop: 12,
    height: 165,
  },
  input: {
    paddingHorizontal: 0,
  },
  buttonGroup: {
    marginVertical: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reamainingChars: {
    position: 'absolute',
    bottom: 10,
    right: 16,
  },
  image: {
    width,
    flex: 1,
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    fontSize: 12,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  paginationText: {
    color: 'white',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  wrapper: {
    minHeight: 300,
  },
  saveButtonTextDisabled: {
    paddingHorizontal: 18,
    color: '#5A76AB',
    fontWeight: '800',
    opacity: 0.5,
  },
  creds: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  workouts: {
    marginBottom: 24,
  },
  textDanger: {
    // position:'absolute',
    color: 'red',
  },
});

export default TrainerEditProfile;
