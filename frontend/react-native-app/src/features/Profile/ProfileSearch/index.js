import React, {Component} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import {Text} from 'react-native-ui-kitten';
import {Input} from 'react-native-elements';
import Dialog from 'react-native-dialog';

import {connect} from 'react-redux';
import CardView from 'react-native-cardview';
import * as reduxActions from '../redux/actions';
import * as calenderActions from '../../CalendarView/redux/actions';
import {styles} from './styles';
import Filters from './components/Filters';
import Loader from '../../../components/Loader';
import HeaderButtonGroup from './components/HeaderButtonGroup';
import ClassesSearch from '../ClassesSearch';
import ListHeader from './ListHeader';
import ListFooter from './ListFooter';

class ProfileSearch extends Component {
  state = {
    DATA: [],
    query: '',
    filters: [],
    spinner: false,
    errorMessage: null,
    selectedSearchType: 0,
    isDialogVisible: false,
    dialogInputValue: '',
  };

  toggleSearchType(index) {
    this.setState({selectedSearchType: index});
  }

  componentDidMount() {
    const {referral_code} = this.props.user.user;
    if (referral_code === null) {
      this.toggleDialog();
    }

    const {
      actions: {getChatToken},
    } = this.props;

    this.makeRequest();
    getChatToken();
    if (this.props.profiles && this.props.profiles.length === 0) {
      this.setState({spinner: true});
    }
  }

  static getDerivedStateFromProps(props, state) {
    const stateToReturn = {spinner: false};
    if (
      (!props.profiles || props.profiles.length !== 0) &&
      state.spinner === true
    ) {
      stateToReturn.spinner = false;
    }
    return stateToReturn;
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

  header() {
    return (
      <View style={styles.header}>
        <Text style={styles.heading}>Select Profile</Text>
      </View>
    );
  }

  handleQuery = val => {
    this.setState({query: val}, this.makeRequest);
  };

  makeRequest = obj => {
    const {
      actions: {searchProfiles},
    } = this.props;
    const objectToPush = {
      query: this.state.query,
      filters: this.state.filters,
      limit: this.props.limit,
      // offset: this.props.offset,
      offset: 0,
      ...obj,
    };
    searchProfiles(objectToPush);
  };

  changeFilters = filterName => e => {
    const {filters} = this.state;
    let filterd = [...filters];
    if (filters.includes(filterName)) {
      filterd = filters.filter(elem => elem !== filterName);
    } else {
      filterd = [...filterd, filterName];
    }
    this.setState({filters: filterd}, this.makeRequest);
  };

  clearFilters = () => {
    this.setState({filters: []}, this.makeRequest);
  };

  openScreen = data => () => {
    this.props.navigation.navigate('Details', {data});
  };

  clearInput = () => {
    this.setState({query: ''});
  };

  renderItems = ({item}) => {
    if (!item.first_name) {
      return;
    }
    const imageWidth = 80;
    const horizontalTextMargin = 15;
    const cardMargin = 20;
    const cardPadding = 20;
    const currentWidth = Dimensions.get('window').width;
    return (
      <CardView
        cardElevation={2}
        cardMaxElevation={2}
        cornerRadius={10}
        style={{
          flexDirection: 'row',
          paddingHorizontal: cardPadding,
          minHeight: 120,
          margin: cardMargin,
          marginVertical: 8,
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          justifyContent: 'space-between',
          flex: 1,
          shadow: '0 0 12 rgba(0, 0, 0, 0.2)',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          // onPress={() => {
          //   this.props.actions.getChats();
          // }}
          onPress={this.openScreen({
            user2: item.id,
            user1: this.props.user.user.id,
          })}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}>
          <Image
            style={{
              width: imageWidth,
              height: 80,
              backgroundColor: 'grey',
              borderRadius: 40,
            }}
            source={{
              uri: item.profile_picture
                ? item.profile_picture
                : item.social_profile_url,
            }}
          />
          <View
            style={{
              flex: 1,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 16,
                color: '#000000',
                marginEnd: horizontalTextMargin,
                marginStart: horizontalTextMargin,
                fontWeight: '800',
              }}>
              {`${item.first_name} ${item.last_name}`}
            </Text>
            {item.bio && item.bio !== 'null' && (
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 14,
                  color: '#828282',
                  marginStart: 15,
                  width:
                    currentWidth -
                    imageWidth -
                    horizontalTextMargin * 2 -
                    cardMargin * 2 -
                    cardPadding * 2,
                }}>
                {item.bio}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </CardView>
    );
  };

  toggleDialog = bool => {
    if (bool !== undefined) {
      this.setState({isDialogVisible: bool});
    } else {
      this.setState(state => ({isDialogVisible: !state.isDialogVisible}));
    }
  };

  handleDialogInputChange = value => {
    this.setState({dialogInputValue: value});
  };

  handleDialogPress = () => {
    this.toggleDialog(false);
    this.props.actions.putReferral(this.state.dialogInputValue);
  };

  loadMoreProfiles = () => {
    if (this.props.loadMoreLoading) {
      return null;
    }
    if (this.props.limit !== null && this.props.limit > 0) {
      this.makeRequest({limit: this.props.limit + 10, loadMore: true});
    }
  };

  render() {
    const profilesToRender = this.props.profiles.filter(
      x => x.id !== this.props.user.user.id,
    );
    return (
      <View style={styles.itemsContainer}>
        <Dialog.Container visible={this.state.isDialogVisible}>
          <Dialog.Title>Did someone refer you?</Dialog.Title>
          <Dialog.Description>
            Tell us their full name or referral code
          </Dialog.Description>
          <Dialog.Input
            value={this.state.dialogInputValue}
            onChangeText={this.handleDialogInputChange}
          />
          <Dialog.Button label="Skip" onPress={this.handleDialogPress} />
          <Dialog.Button label="Submit" bold onPress={this.handleDialogPress} />
        </Dialog.Container>
        <View
          style={{
            height: 60,
            flexDirection: 'row',
            width: '100%',
            marginTop: 25,
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <Input
            leftIcon={{type: 'font-awesome', name: 'search', color: '#000'}}
            rightIcon={
              this.state.query ? (
                <TouchableOpacity onPress={this.clearInput}>
                  <Image
                    style={{
                      backgroundColor: '#E0E0E0',
                      width: 22,
                      height: 22,
                      borderRadius: 14,
                    }}
                    source={require('../../../assets/icons/close_24px.png')}
                  />
                </TouchableOpacity>
              ) : null
            }
            inputContainerStyle={{
              fontSize: 18,
              borderWidth: 1,
              width: '100%',
              borderColor: '#E0E0E0',
              padding: 5,
              paddingStart: 14,
              paddingEnd: 10,
              backgroundColor: '#fff',
              height: 52,
              position: 'relative',
              borderRadius: 5,
              marginBottom: -25,
              zIndex: 33,
            }}
            leftIconContainerStyle={{paddingEnd: 16}}
            value={this.state.query}
            onChangeText={this.handleQuery}
            placeholder={'Search for a trainer'}
          />
        </View>

        {this.state.spinner && <Loader />}
        {this.state.errorMessage ? (
          <>
            <Text style={{alignSelf: 'center'}}>{this.state.errorMessage}</Text>
          </>
        ) : (
          <>
            {this.state.selectedSearchType === 0 && (
              <ClassesSearch
                filtersByWorkoutType={this.state.filters}
                query={this.state.query}
                ListHeaderComponent={
                  <ListHeader
                    workout_types={this.props.workout_types}
                    changeFilters={this.changeFilters}
                    clearFilters={this.clearFilters}
                    filters={this.state.filters}
                    toggleSearchType={this.toggleSearchType.bind(this)}
                    selectedSearchType={this.state.selectedSearchType}
                  />
                }
              />
            )}
            {this.state.selectedSearchType === 1 && (
              <FlatList
                style={{
                  flex: 1,
                  width: '100%',
                }}
                ListHeaderComponent={
                  <ListHeader
                    workout_types={this.props.workout_types}
                    changeFilters={this.changeFilters}
                    clearFilters={this.clearFilters}
                    filters={this.state.filters}
                    toggleSearchType={this.toggleSearchType.bind(this)}
                    selectedSearchType={this.state.selectedSearchType}
                  />
                }
                ListFooterComponent={
                  <ListFooter isLoading={this.props.loadMoreLoading} />
                }
                data={profilesToRender}
                renderItem={this.renderItems}
                keyExtractor={item => String(item.id)}
                onEndReachedThreshold={0.9}
                onEndReached={this.loadMoreProfiles}
              />
            )}
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.Calendar.user,
  profiles: state.Calendar.profiles,
  limit: state.Calendar.limit,
  offset: state.Calendar.offset,
  workout_types: state.CommonData.workout_types,
  loadMoreLoading: state.Calendar.loadMoreLoading,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    searchProfiles: data => {
      dispatch(reduxActions.searchProfiles(data));
    },
    setMessageUser: data => {
      dispatch(reduxActions.setChatUIWithUser(data));
    },
    getChatToken: _ => {
      dispatch(calenderActions.getChatToken());
    },
    putReferral: value => {
      dispatch(reduxActions.putReferralUser(value));
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileSearch);
