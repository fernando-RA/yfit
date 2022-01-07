import Icon from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import {View, BackHandler, ImageBackground} from 'react-native';
import BottomNavigation, {
  FullTab,
} from 'react-native-material-bottom-navigation';
import {connect} from 'react-redux';
import DimensionUtils from '../../utils/DimensionUtils';
import ProfileSearch from '../Profile/ProfileSearch';
import ProfileView from '../Profile/ProfileView';
import ClassesView from '../ClassesView';
import * as calenderActions from '../CalendarView/redux/actions';
import Chat from 'twilio-chat';

const BAR_COLOR = '#333333';
class App extends React.Component {
  tabs = [
    {
      key: 'search',
      icon: 'search',
      label: 'Search',
      barColor: BAR_COLOR,
      pressColor: BAR_COLOR,
    },
    {
      key: 'events',
      label: 'Classes',
      icon: 'calendar-alt',
      barColor: BAR_COLOR,
      pressColor: BAR_COLOR,
    },
    {
      key: 'user',
      label: 'Me',
      icon: 'user',
      barColor: BAR_COLOR,
      pressColor: BAR_COLOR,
    },
  ];

  state = {
    activeTab: 'search',
  };

  renderIcon = icon => ({isActive}) => (
    <Icon size={20} color={isActive ? '#5FE487' : 'white'} name={icon} />
  );

  renderTab = ({tab, isActive}) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      labelStyle={{color: isActive ? '#5FE487' : 'white', fontWeight: '800'}}
      renderIcon={this.renderIcon(tab.icon)}
    />
  );

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.chatToken) {
      this.createChat(nextProps.user.chatToken);
      if (!this.client) {
        this.createChat(nextProps.user.chatToken);
      }
    }
  }
  componentWillUnmount() {
    if (this.client) {
      this.client.shutdown();
    }
  }

  handleError(error) {
    console.log(error);
    this.setState({error: 'Could not load chat.'});
  }

  setupChatClient(client) {
    _this = this;
    this.client = client;
  }

  createChat(token) {
    try {
      Chat.create(token)
        .then(this.setupChatClient)
        .catch(this.handleError);
    } catch (error) {
      console.log(error);
    }
  }

  UNSAFE_componentWillMount() {
    this.createChat = this.createChat.bind(this);
    this.setupChatClient = this.setupChatClient.bind(this);
    this.handleError = this.handleError.bind(this);

    let _this = this;
    const {
      actions: {getChatToken},
    } = this.props;
    getChatToken();
  }

  renderView() {
    if (this.state.activeTab == 'search') {
      return <ProfileSearch navigation={this.props.navigation} />;
    }
    if (this.state.activeTab == 'user') {
      return <ProfileView navigation={this.props.navigation} />;
    }
    if (this.state.activeTab == 'events') {
      return <ClassesView hideBack={true} navigation={this.props.navigation} />;
    }
  }

  setTab(key) {
    this.setState({activeTab: key});
  }

  handleBackButton = () => {
    BackHandler.exitApp();
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flex: 1}}>
          {/* Your screen contents depending on current tab. */}
          {this.renderView()}
        </View>
        <ImageBackground
          style={{
            width: '100%',
            paddingHorizontal: 15,
            backgroundColor: BAR_COLOR,
            height: 80 + DimensionUtils.safeAreaBottomHeight,
            justifyContent: 'flex-end',
          }}>
          <BottomNavigation
            activeTab={this.state.activeTab}
            onTabPress={newTab => this.setState({activeTab: newTab.key})}
            renderTab={this.renderTab}
            style={{
              height: 80,
              justifyContent: 'center',
              backgroundColor: BAR_COLOR,
              shadowOpacity: 0,
            }}
            tabs={this.tabs}
          />
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  chatToken: state.Calendar.chatToken,
  user: state.Calendar.user,
  profile: state.Calendar.profile,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    getChatToken: _ => {
      dispatch(calenderActions.getChatToken());
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
