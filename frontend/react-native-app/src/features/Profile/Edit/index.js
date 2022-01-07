import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  ToastAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import {Text, Layout, Button, Input} from 'react-native-ui-kitten';
import ModalSelector from 'react-native-modal-selector';
import {styles} from './styles';
import personImage from '../assets/profile.png';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import * as actions from '../redux/actions';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import * as ImagePicker from 'react-native-image-picker';
import validate from 'validate.js';
import Toast from 'react-native-simple-toast';

var constraints = {
  email: {
    presence: true,
    email: {
      message: 'is not valid.',
    },
  },
  first_name: {
    presence: true,
    exclusion: {
      within: [''],
      message: 'can not be blanked.',
    },
  },
  last_name: {
    presence: true,
    exclusion: {
      within: [''],
      message: 'can not be blanked.',
    },
  },
  bio: {
    presence: true,
    exclusion: {
      within: [''],
      message: 'can not be blanked.',
    },
  },
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const data = [
  {
    key: 'client',
    label: 'Client',
  },
  {
    key: 'trainer',
    label: 'Trainer',
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      bio: '',
    };
  }

  renderImage = () => {
    const screenSize = Dimensions.get('window');
    const imageSize = {
      width: screenSize.width,
      height: screenSize.height,
    };
    return (
      <Image
        style={[styles.image, imageSize]}
        source={require('../assets/auth_bg.png')}
      />
    );
  };

  UNSAFE_componentWillMount() {
    const {user} = this.props.user;
    this.setState({
      user: user,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      photo: user.photo,
      userId: user.id,
      profile_picture: user.profile_picture,
      social_profile_url: user.social_profile_url,
      user_type: user.user_type,
      bio: user.bio,
    });
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.user) {
      const {user} = nextProp.user;
      this.setState({
        user: user,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        photo: user.photo,
        userId: user.id,
        profile_picture: user.profile_picture,
        social_profile_url: user.social_profile_url,
        user_type: user.user_type,
        bio: user.bio,
      });
    }
  }

  validate = () => {
    const {bio, first_name, last_name, email} = this.state;

    let errors = validate(
      {
        bio,
        first_name,
        last_name,
        email,
      },
      constraints,
    );

    if (errors) {
      if (errors.first_name) {
        Toast.show(errors.first_name[0], Toast.SHORT);
        return false;
      }
      if (errors.last_name) {
        Toast.show(errors.last_name[0], Toast.SHORT);
        return false;
      }
      if (errors.email) {
        Toast.show('Enter a valid email address.', Toast.LONG);
        return false;
      }
      if (errors.bio) {
        Toast.show(errors.bio[0], Toast.SHORT);
        return false;
      }
    }
    return true;
  };

  header() {
    return (
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 20,
            }}
            onPress={() => {
              const isValid = this.validate();
              if (!isValid) {
                return false;
              }
              this.props.navigation.navigate('MainApp');
            }}>
            <Image
              style={{
                width: 16,
                height: 16,
              }}
              source={require('../../../assets/icons/arrow_back.png')}
            />
          </TouchableOpacity>

          <Text style={styles.heading}>UPDATE PROFILE</Text>

          <TouchableOpacity
            style={{
              width: 16,
              height: 16,
              paddingHorizontal: 20,
            }}
            activeOpacity={0.8}
          />
        </View>
      </View>
    );
  }

  render() {
    const {first_name, last_name, email, bio, user_type} = this.state;

    let uri = null;
    if (this.state.avatarSource) {
      uri = this.state.avatarSource;
    } else {
      if (this.state.profile_picture) {
        uri = this.state.profile_picture;
      } else {
        uri = this.state.social_profile_url;
      }
    }
    return (
      <View style={styles.itemsContainer}>
        <View
          resizeMode={'contain'}
          style={{
            marginTop: 0,
            width: windowWidth * 1.3,
            height: windowHeight * 0.5,
            justifyContent: 'center',
            position: 'absolute',
            height: 80,
            backgroundColor: '#E5E5E5',
          }}
        />

        {this.header()}

        <View
          style={{
            flex: 1,
            width: '100%',
          }}>
          <KeyboardAvoidingScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              paddingBottom: 15,
            }}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <ImageBackground
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                  overflow: 'hidden',
                }}
                source={{
                  uri,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectImage();
                  }}
                  activeOpacity={0.6}
                  style={{
                    width: '100%',
                    flex: 1,
                    backgroundColor: '#00000050',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      marginBottom: 15,
                      color: '#fff',
                    }}>
                    Change
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>

            <View
              style={{
                backgroundColor: '#fff',
                width: '100%',
                padding: 35,
                paddingVertical: 15,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={[
                    styles.fieldContainer,
                    {
                      flex: 0.48,
                    },
                  ]}>
                  <Text style={styles.label}>First Name</Text>
                  <Input
                    value={first_name}
                    placeholder="John"
                    size="small"
                    onChangeText={first_name => {
                      this.setState({first_name});
                    }}
                    maxLength={15}
                    style={styles.input}
                    textStyle={styles.text}
                    autoCapitalize="words"
                  />
                </View>
                <View
                  style={[
                    styles.fieldContainer,
                    {
                      flex: 0.48,
                    },
                  ]}>
                  <Text style={styles.label}>Last Name</Text>
                  <Input
                    value={last_name}
                    placeholder="Retrick"
                    size="small"
                    maxLength={15}
                    onChangeText={last_name => {
                      this.setState({last_name});
                    }}
                    style={styles.input}
                    textStyle={styles.text}
                    autoCapitalize="words"
                  />
                </View>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email</Text>
                <Input
                  placeholder="john@gmail.com"
                  size="small"
                  value={email}
                  keyboardType="email-address"
                  onChangeText={email => {
                    this.setState({email});
                  }}
                  style={styles.input}
                  textStyle={styles.text}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Bio</Text>
                <Input
                  value={bio}
                  placeholder="Your bio should be here.."
                  size="small"
                  maxLength={30}
                  onChangeText={bio => {
                    this.setState({bio});
                  }}
                  style={[
                    styles.input,
                    {
                      height: 40,
                    },
                  ]}
                  textStyle={styles.text}
                  autoCapitalize="sentences"
                />
              </View>
              {/* <View style={styles.fieldContainer}>
                                <Text style={styles.label}>User Type</Text>
                                <ModalSelector
                                    data={data}
                                    style={[
                                        styles.input, {
                                            height: 40,
                                            width: '100%'
                                        }
                                    ]}
                                    selectedKey={user_type}
                                    onChange={(option) => {
                                        if (option.key) {
                                            console.log(option.key)
                                            this.setState({ user_type: option.key })
                                        }
                                    }} />
                            </View> */}
            </View>

            <View style={styles.contentContainer}>
              <TouchableOpacity
                onPress={() => {
                  const isValid = this.validate();
                  if (!isValid) {
                    return false;
                  }
                  let user = {};
                  user.bio = this.state.bio;
                  user.first_name = this.state.first_name;
                  user.last_name = this.state.last_name;
                  user.id = this.state.userId;
                  user.email = this.state.email;
                  user.user_type = this.state.user_type;
                  this.props.actions.profileCreate({user});
                }}
                activeOpacity={0.7}
                style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingScrollView>
        </View>
      </View>
    );
  }

  selectImage() {
    // More info on all the options is below in the API Reference... just some
    // common use cases shown here
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.5,
      maxWidth: 400,
      maxHeight: 400,
      includeBase64: true,
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.launchImageLibrary(options, response => {
      //console.log('Response = ', response);
      response.data = response.base64;
      delete response.base64;
      console.log(response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = {     uri: response.uri }; You can also display the image
        // using data: const source = { uri: 'data:image/jpeg;base64,' + response.data
        // };

        this.props.actions.profileImageChange({image: response});

        this.setState({
          avatarSource: 'data:image/jpeg;base64,' + response.data,
        });
      }
    });
  }
}

const mapStateToProps = state => ({
  user: state.Calendar.user,
  profile: state.Calendar.profile,
  CalendarGoogleSignInErrors: state.Calendar.errors.CalendarLogin,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    profileCreate: data => {
      dispatch(actions.createProfile(data));
    },
    profileImageChange: data => {
      dispatch(actions.setProfileImage(data));
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
