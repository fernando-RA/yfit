import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {Text, Layout, Button} from 'react-native-ui-kitten';
import {Input} from 'react-native-elements';
import * as NavigationService from '../../../../navigator/NavigationService';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_API} from 'react-native-dotenv';

import moment from 'moment';
import * as actions from '../../redux/actions';
import {styles} from './styles';
import Toast from 'react-native-simple-toast';
import Loader from '../../../../components/Loader';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class CalenderEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      startTimeShow: '',
      endTimeShow: '',
      description: '',
      location: '',
      spinner: false,
    };
  }

  componentDidMount() {
    const {actions} = this.props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({spinner: false});
  }

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
              padding: 20,
            }}
            onPress={() => {
              NavigationService.goBack();
            }}>
            <Image
              style={{
                width: 16,
                height: 16,
              }}
              source={require('../../../../assets/icons/arrow_back.png')}
            />
          </TouchableOpacity>

          <Text style={styles.heading}>CREATE EVENT</Text>

          <TouchableOpacity
            style={{
              width: 16,
              height: 16,
              padding: 20,
            }}
            activeOpacity={0.8}
          />
        </View>
      </View>
    );
  }

  render() {
    const {title, startTimeShow, endTimeShow, description} = this.state;
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

        <KeyboardAvoidingScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingBottom: 15,
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              padding: 35,
              paddingVertical: 15,
            }}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Title *</Text>
              <Input
                activeOpacity={1}
                size="small"
                value={title}
                // style={styles.input}
                onChangeText={title => {
                  this.setState({title});
                }}
                placeholder="Enter event title.."
                autoCapitalize="sentences"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              underlayColor={'transparent'}
              onPress={this._showStartTimePicker.bind(this)}>
              <View pointerEvents="none" style={styles.fieldContainer}>
                <Text style={styles.label}>Start Time *</Text>
                <Input
                  placeholder="Select start time"
                  size="small"
                  editable={false}
                  value={startTimeShow}
                  disabled
                  // style={styles.input}
                  textStyle={styles.text}
                  autoCapitalize="none"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              underlayColor={'transparent'}
              onPress={this._showEndTimePicker.bind(this)}>
              <View pointerEvents="none" style={styles.fieldContainer}>
                <Text style={styles.label}>End Time *</Text>
                <Input
                  placeholder="Select end time"
                  size="small"
                  value={endTimeShow}
                  disabled
                  editable={false}
                  style={styles.input}
                  textStyle={styles.text}
                  autoCapitalize="none"
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.label}>Location *</Text>

            <GooglePlacesAutocomplete
              onChangeText={location => {
                this.setState({location});
              }}
              styles={{
                textInputContainer: {
                  ...styles.input,
                  borderTopWidth: 0,
                  marginHorizontal: 10,
                  paddingRight: 20,
                  borderColor: '#86939e',
                  borderBottomWidth: 0,
                },
                container: {
                  borderBottomWidth: 0,
                  borderColor: '#86939e',
                  padding: 0,
                  margin: 0,
                },
                textInput: {
                  borderColor: '#86939e',
                  alignSelf: 'center',
                  flex: 1,
                  minHeight: 40,
                  marginLeft: 0,
                  fontSize: 18,
                  paddingTop: 0,
                  paddingRight: 0,
                  paddingBottom: 0,
                  paddingLeft: 0,
                  borderBottomWidth: 1,
                  borderRadius: 0,
                  marginTop: 0,
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
                row: {
                  borderColor: '#86939e',
                  margin: 0,
                },
              }}
              placeholder="Search location"
              minLength={1} /* minimum length of text to search */
              fetchDetails={true}
              onPress={(data, details = null) => {
                console.log(
                  'LOCATION SEARCH SCREEN:: ',
                  details.formatted_address,
                );
                this.setState({location: details.formatted_address});
                return ''; /* text input default value */
              }}
              query={{
                /* available options: https://developers.google.com/places/web-service/autocomplete */
                key: GOOGLE_API,
                language: 'en',
                types: 'geocode',
                components: 'country:us',
              }}
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Description</Text>
              <Input
                size="small"
                value={description}
                // style={styles.input}
                placeholder="description here.."
                onChangeText={description => {
                  this.setState({description});
                }}
                textStyle={[
                  styles.text,
                  {
                    textAlignVertical: 'top',
                  },
                ]}
                autoCapitalize="sentences"
              />
            </View>
          </View>

          <View style={styles.contentContainer}>
            <TouchableOpacity
              onPress={() => {
                if (!this.state.title) {
                  Toast.show('Add the title..', Toast.LONG);
                  return;
                }
                if (!this.state.startTime) {
                  Toast.show('Select the start time..', Toast.LONG);
                  return;
                }
                if (!this.state.endTime) {
                  Toast.show('Select the end time..', Toast.LONG);
                  return;
                }
                if (!this.state.location) {
                  Toast.show('Select the location..', Toast.LONG);
                  return;
                }

                if (moment(this.state.startTime).isAfter(this.state.endTime)) {
                  Toast.show(
                    'End time cannot be before start time..',
                    Toast.LONG,
                  );
                  return;
                }
                this.setState({spinner: true});
                this.props.actions.postEvent({
                  title: this.state.title,
                  startTime: this.state.startTime,
                  endTime: this.state.endTime,
                  location: this.state.location,
                  description: this.state.description,
                });
              }}
              activeOpacity={0.7}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Create Event</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={this.state.isStartTimePickerVisible}
            onConfirm={this._handleStartTimePicked}
            mode={'datetime'}
            onCancel={this._hideStartTimePicker}
          />

          <DateTimePickerModal
            isVisible={this.state.isEndTimePickerVisible}
            onConfirm={this._handleEndTimePicked}
            mode={'datetime'}
            onCancel={this._hideEndTimePicker}
          />
          {this.state.spinner && <Loader />}
        </KeyboardAvoidingScrollView>
      </View>
    );
  }

  _showStartTimePicker = () => this.setState({isStartTimePickerVisible: true});

  _hideStartTimePicker = () => this.setState({isStartTimePickerVisible: false});

  _handleStartTimePicked = date => {
    this._hideStartTimePicker();
    this.setState({startTime: new Date(date)});
    this.setState({
      startTimeShow: moment(new Date(date)).format('DD/MM/YYYY hh:mm A'),
    });
  };

  _showEndTimePicker = () => this.setState({isEndTimePickerVisible: true});

  _hideEndTimePicker = () => this.setState({isEndTimePickerVisible: false});

  _handleEndTimePicked = date => {
    this._hideEndTimePicker();
    this.setState({endTime: new Date(date)});
    this.setState({
      endTimeShow: moment(new Date(date)).format('DD/MM/YYYY hh:mm A'),
    });
  };

  renderItem(item) {
    return (
      <View
        style={[
          styles.item,
          {
            height: item.height,
          },
        ]}
        key={item.uuid}>
        <Text>{item.name}</Text>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    postEvent: data => {
      dispatch(actions.addEvent(data));
    },
  },
});

const mapStateToProps = state => ({
  createdCalenderEvent: state.Calendar.createdCalenderEvent,
  CalenderADDError: state.Calendar.errors.CalenderADDError,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalenderEvent);
