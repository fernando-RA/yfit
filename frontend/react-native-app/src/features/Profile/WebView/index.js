import React, {Component} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {Text} from 'react-native-ui-kitten';
import {appConfig} from '../../../config/app';

import * as actions from '../redux/actions';
import Loader from '../../../components/Loader';
import {styles} from './styles';
import WebView from 'react-native-webview';
import Toast from 'react-native-simple-toast';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
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
    console.log('UNSAFE_componentWillMount');
    this.setState({spinner: true});
    const {createStripeAccount, getStripeAccount} = this.props.actions;
    createStripeAccount();
    getStripeAccount();
  }

  componentWillReceiveProps(nextProps) {
    let url = '';
    if (nextProps.stripe_data) {
      url = nextProps.stripe_data.url;
    }
    console.log('componentWillReceiveProps', url);
    this.setState({uri: url});
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
              this.props.navigation.goBack();
            }}>
            <Image
              style={{
                width: 16,
                height: 16,
              }}
              source={require('../../../assets/icons/arrow_back.png')}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>PAYMENTS</Text>

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
    return (
      <View style={styles.itemsContainer}>
        <View resizeMode={'contain'} style={styles.headerBg} />

        {this.header()}
        <View
          style={{
            flex: 1,
          }}>
          <WebView
            onNavigationStateChange={webViewState => {
              if (
                webViewState.url.startsWith(
                  `${
                    appConfig.emailAuthAPIEndPoint
                  }/api/v1/payment/user_created/`,
                )
              ) {
                const {getStripeAccount} = this.props.actions;
                getStripeAccount();
                Toast.show('Stripe Account Created...', Toast.LONG);
                this.props.navigation.navigate('MainApp');
              } else if (
                webViewState.url.startsWith(
                  `${appConfig.emailAuthAPIEndPoint}/v1/payment/user_failed`,
                )
              ) {
                const {getStripeAccount} = this.props.actions;
                getStripeAccount();
                Toast.show('Stripe Account Creation failed...', Toast.LONG);
                this.props.navigation.navigate('MainApp');
              }
            }}
            onLoad={() => this.setState({spinner: false})}
            source={{
              uri: this.state.uri,
            }}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
          />
          {this.state.spinner && <Loader />}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  stripe_data: state.Profile.stripe_account_data,
  stripeProfile: state.Profile.stripeProfile,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    createStripeAccount: () => {
      dispatch(actions.createStripeAccount());
    },
    getStripeAccount: () => {
      dispatch(actions.getStripeAccount());
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
