import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Text, Layout} from 'react-native-ui-kitten';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {styles} from './styles';
import * as calendarActions from '../../redux/actions';
import ErrorBox from '../../../../components/ErrorBox';
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import {Web} from 'react-native-openanything';

import AppleIcon from '../../../../assets/icons/apple-icon.svg';
import GoogleIcon from '../../../../assets/icons/google-icon.svg';
class CalendarLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSigninInProgress: false,
      user: props.user,
    };

    this.goToCalendar = this.goToCalendar.bind(this);
  }

  onPressAppleLogin = async () => {
    try {
      this.setState({loading: true, isAppleLoading: true});
      let data = {};

      const credential = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      this.props.actions.appleSignIn({
        access_token: credential.authorizationCode,
        credential,
      });
    } catch (e) {
      console.log('apple auth error', e);
      console.log('apple  error code', e.code);
    }
  };

  UNSAFE_componentWillMount() {
    if (this.state.user) {
      this.props.navigation.navigate('MainApp');
    }
  }

  renderErrors() {
    const {CalendarGoogleSignInErrors} = this.props;

    if (CalendarGoogleSignInErrors) {
      return <ErrorBox errorText={CalendarGoogleSignInErrors} />;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({user: nextProps.user});
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
        source={require('../../assets/auth/auth_bg.png')}
      />
    );
  };

  goToCalendar() {
    this.setState({user: null});
  }

  renderUser() {
    const {actions} = this.props;

    return (
      <Layout style={styles.signInContainer}>
        <TouchableOpacity
          onPress={actions.googleSignIn}
          activeOpacity={0.7}
          style={styles.buttonContainer}>
          <View style={styles.buttonBody}>
            <GoogleIcon />
            <Text style={styles.buttonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            onPress={this.onPressAppleLogin}
            activeOpacity={0.7}
            style={styles.buttonContainer}>
            <View style={styles.buttonBody}>
              <AppleIcon />
              <Text style={styles.buttonText}>Continue with Apple</Text>
            </View>
          </TouchableOpacity>
        )}
        <Text
          style={styles.termText}
          onPress={() => {
            Web('https://getrec.com/privacy-policy').catch(err => {
              alert('Something went wrong, please try again later');
              console.error(err);
            });
          }}>
          {'Terms and conditions'}
        </Text>
      </Layout>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          backgroundColor: '#232429',
          paddingTop: 80,
        }}>
        <Image
          style={styles.logo}
          source={require('../../../../assets/icons/logo.png')}
        />
        <Text style={styles.logoTitle}>Find your next group class</Text>
        <Text style={styles.logoText}>
          Group fitness directly with trainers in your area, no memberships
          required.
        </Text>
        <View
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
          }}>
          {this.renderUser()}
          {/* {this.renderErrors()} */}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.Calendar.user,
  CalendarGoogleSignInErrors: state.Calendar.errors.CalendarLogin,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    googleSignIn: () => {
      dispatch(calendarActions.googleSignIn());
    },
    appleSignIn: data => {
      dispatch(calendarActions.appleSignIn(data));
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarLogin);
