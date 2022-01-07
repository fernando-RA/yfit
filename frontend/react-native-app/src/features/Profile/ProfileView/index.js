import React, {Component} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {CardHeader} from 'react-native-ui-kitten';
import {Text} from 'react-native-elements';
import CardView from 'react-native-cardview';
import Dialog from 'react-native-dialog';
import isEqual from 'lodash/isEqual';
import moment from 'moment';

import {GoogleSignin} from 'react-native-google-signin';
import * as profileActions from '../redux/actions';
import * as actions from '../../CalendarView/redux/actions';
import * as NavigationService from '../../../navigator/NavigationService';

import {styles} from './styles';

const stripeText =
  'We use Stripe to make sure you get paid on time and to keep your personal bank and details secure. Tap "Add Payment Account" to setup payment on stripe';
class Me extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      bio: '',
      paymentStatus: '',
      collapsible: '',
      invoicesArray: [],
      selectedCountry: 'US',
      paymentMonthes: [],
      currentNumberOfMonths: 5,
      payments: [],
      isDialogVisible: false,
      isUnsubscribeDialogVisible: false,
      selectedPayment: null,
    };
  }

  componentDidMount() {
    const {user} = this.props.user;
    const {getStripeAccount, getSubscriptions} = this.props.actions;
    if (user.user_type === 'trainer') {
      getStripeAccount();
    }
    getSubscriptions();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let user;
    if (nextProps.user?.user) {
      user = nextProps.user.user;
    }
    let paymentStatus;
    if (!nextProps.stripeProfile?.requirements?.disabled_reason) {
      paymentStatus = 'Enabled';
    } else {
      if (
        nextProps.stripeProfile?.requirements?.disabled_reason ===
        'requirements.pending_verification'
      ) {
        paymentStatus = 'Under Verification';
      } else {
        if (
          nextProps.stripeProfile?.requirements?.disabled_reason?.startsWith(
            'rejected.',
          )
        ) {
          paymentStatus = 'Rejected';
        } else {
          paymentStatus = 'Inactive';
        }
      }
    }
    if (user) {
      return {
        paymentStatus,
        user: user,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        photo: user.profile_picture
          ? user.profile_picture
          : user.social_profile_url,
        bio: user.bio,
        name: user.first_name + ' ' + user.last_name,
        user_type: user.user_type,
      };
    }
  }

  setUser(user) {
    this.setState({
      user: user,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      photo: user.profile_picture
        ? user.profile_picture
        : user.social_profile_url,
      bio: user.bio,
      name: user.first_name + ' ' + user.last_name,
      user_type: user.user_type,
    });
  }

  connectGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      let isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }

      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/calendar.events'],
      });
      const user = await GoogleSignin.signIn();
      const {accessToken} = await GoogleSignin.getTokens();

      this.props.actions.setUser({
        ...this.props.user,
        scopes: user.scopes,
      });
      this.props.actions.setGoogleToken(accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  navigateTo = () => {
    if (this.state.user_type === 'trainer') {
      this.props.navigation.navigate('TrainerPreviewProfile');
    } else {
      this.props.navigation.navigate('ProfileEdit');
    }
  };

  header() {
    return (
      <View style={styles.header}>
        <Text style={styles.heading}>Profile</Text>
      </View>
    );
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

  loadMoreTransactions = () => {
    this.setState(state => ({
      currentNumberOfMonths: state.currentNumberOfMonths + 3,
    }));
  };

  toggleToTrainer = () => {
    this.props.actions.setUserType('trainer');
  };

  toggleDialogView = () => {
    this.setState(state => ({isDialogVisible: !state.isDialogVisible}));
  };

  openMonthDetail = (link, monthName, total) => {
    NavigationService.navigate('PaymentDetails', {
      link: link,
      user_type: this.state.user_type,
      headerTitle: 'Earnings in ' + monthName,
      allPayments: this.state.payments,
      total: total,
    });
  };

  getClientPayments = () => {
    return [...this.props.subscriptions, ...this.props.payments].sort(
      (a, b) => moment(b.create_date_time) - moment(a.create_date_time),
    );
  };

  showUnsubscribeDialog = payment => () => {
    this.setState({
      isUnsubscribeDialogVisible: true,
      selectedPayment: payment,
    });
  };

  toggleUnsubscribeDialogVisible = () => {
    this.setState(state => ({
      isUnsubscribeDialogVisible: !state.isUnsubscribeDialogVisible,
    }));
  };

  callUnsubscribe = () => {
    this.props.actions.cancelSubscriptions(this.state.selectedPayment);
  };

  render() {
    const loadingOffset = 2;
    const payments = [...this.props.payments].map(e => ({
      ...e,
      sum: parseFloat(e.sum / 100).toFixed(2),
    }));
    const currentMonth = payments.shift();
    const {email, name, user_type, photo} = this.state;
    if (!name) {
      return <ActivityIndicator />;
    }
    return (
      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <Dialog.Container visible={this.state.isDialogVisible}>
            <Dialog.Title>Switch to trainer mode?</Dialog.Title>
            <Dialog.Description>
              You will be logged out. When you log back in, your account will be
              in trainer mode.
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={this.toggleDialogView} />
            <Dialog.Button
              label="Continue"
              bold
              onPress={() => {
                this.toggleDialogView();
                this.toggleToTrainer();
              }}
            />
          </Dialog.Container>
          <Dialog.Container visible={this.state.isUnsubscribeDialogVisible}>
            <Dialog.Title>Turn off recurring payment?</Dialog.Title>
            <Dialog.Description>
              You will no longer pay automatically
            </Dialog.Description>
            <Dialog.Button
              label="Cancel"
              onPress={this.toggleUnsubscribeDialogVisible}
            />
            <Dialog.Button
              label="Turn off"
              color="#FB1B1B"
              bold
              onPress={() => {
                this.toggleUnsubscribeDialogVisible();
                this.callUnsubscribe();
              }}
            />
          </Dialog.Container>
          <CardView
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={10}
            style={[styles.cardView, styles.marginBottom]}>
            <View style={styles.profileBlock}>
              <ImageBackground
                style={styles.profileImage}
                source={{
                  uri: photo,
                }}
              />
            </View>

            <Text category="h1" style={styles.labelName}>
              {name.toUpperCase()}
            </Text>
            <Text style={styles.label}>{email}</Text>
            {user_type === 'trainer' && (
              <Text style={[styles.label, styles.paymentsLabel]}>
                Payments:{' '}
                <Text
                  style={{
                    color:
                      this.state.paymentStatus === 'Enabled'
                        ? 'green'
                        : this.state.paymentStatus === 'Under Verification'
                        ? 'orange'
                        : 'red',
                  }}>
                  {this.state.paymentStatus}
                </Text>
              </Text>
            )}

            <Text style={[styles.label]}>Member Since: July 2020</Text>
            <Text style={styles.label}>Session: {this.props.sessionCount}</Text>

            <Text
              onPress={this.navigateTo}
              style={[styles.label, styles.viewProfileLink]}>
              View Profile
            </Text>
          </CardView>

          <View style={styles.paymentSection}>
            <View style={styles.contentContainer}>
              {user_type === 'trainer' && (
                <CardView
                  style={styles.cardViewBtn}
                  cardElevation={2}
                  cardMaxElevation={2}
                  cornerRadius={10}>
                  <CardHeader>
                    <Text style={styles.paymentText}>Payment Account</Text>
                  </CardHeader>
                  <View style={styles.stripeImage}>
                    <Text style={styles.stripeText}>{stripeText}</Text>
                    <Image
                      source={require('../../../assets/images/stripe.png')}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (this.props.activePayment) {
                        Alert.alert(
                          'Payment Account!',
                          'Your payment account is enabled and accepting payments. Would you like to remove it and add a new payment account?',
                          [
                            {
                              text: 'No',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: 'Yes',
                              onPress: () =>
                                this.props.navigation.navigate(
                                  'PaymentAccount',
                                ),
                            },
                          ],
                          {cancelable: true},
                        );
                      } else {
                        this.props.navigation.navigate('PaymentAccount');
                      }
                    }}
                    activeOpacity={0.7}
                    disabled={this.state.paymentStatus === 'Under Verification'}
                    style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>
                      {this.state.paymentStatus === 'Enabled'
                        ? 'Edit Payment Account'
                        : 'Add Payment Account'}
                    </Text>
                  </TouchableOpacity>
                </CardView>
              )}

              {user_type === 'client' && (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={this.toggleDialogView}
                    style={styles.buttonContainer}>
                    <Text style={styles.buttonTextBold}>
                      Switch to trainer mode
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <>
                {currentMonth && (
                  <TouchableOpacity
                    style={{marginTop: 25}}
                    onPress={
                      currentMonth.sum
                        ? () =>
                            this.openMonthDetail(
                              currentMonth.link,
                              currentMonth.date,
                              currentMonth.sum,
                            )
                        : null
                    }>
                    <View style={styles.earningsContainer}>
                      <Text style={styles.cardText}>Earnings</Text>
                    </View>
                    <CardView
                      style={styles.cardViewBtn}
                      cardElevation={2}
                      cardMaxElevation={2}
                      cornerRadius={10}>
                      <View style={styles.thisMonth}>
                        <Text style={styles.cardText}>This month</Text>
                        <Text style={styles.cardText}>${currentMonth.sum}</Text>
                      </View>
                    </CardView>
                  </TouchableOpacity>
                )}
                {payments && payments.length > 0 && (
                  <CardView
                    style={styles.earningsTable}
                    cardElevation={2}
                    cornerRadius={10}>
                    {payments.map((payment, index) => {
                      if (
                        index + loadingOffset >
                        this.state.currentNumberOfMonths
                      ) {
                        return null;
                      }
                      return (
                        <TouchableOpacity
                          key={payment.link}
                          onPress={
                            payment.sum
                              ? () =>
                                  this.openMonthDetail(
                                    payment.link,
                                    payment.date,
                                    payment.total,
                                  )
                              : null
                          }>
                          <View style={styles.cardHeader}>
                            <Text
                              style={{
                                fontSize: 16,
                              }}>
                              {payment.date}
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                              }}>
                              ${payment.sum}
                            </Text>
                          </View>
                          <View style={styles.breakLine} />
                        </TouchableOpacity>
                      );
                    })}
                    {this.state.currentNumberOfMonths <= 12 &&
                    payments.length >= this.state.currentNumberOfMonths ? (
                      <TouchableOpacity onPress={this.loadMoreTransactions}>
                        <Text style={styles.underlineText}>
                          View 3 more months
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </CardView>
                )}
              </>

              <View style={styles.contentContainer}>
                {!this.props?.scopes?.includes(
                  'https://www.googleapis.com/auth/calendar.events',
                ) && (
                  <CardView
                    style={styles.cardViewBtn}
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={10}>
                    <TouchableOpacity
                      onPress={this.connectGoogle}
                      activeOpacity={0.7}
                      style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>
                        {'CONNECT GOOGLE CALENDAR'}
                      </Text>
                    </TouchableOpacity>
                  </CardView>
                )}

                <Text
                  onPress={() => {
                    this.props.actions.logout();
                  }}
                  style={[styles.label, styles.signOut]}>
                  {'Sign out'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  subscriptions: state.Profile.subscriptions,
  sessionCount: state.Calendar.sessionCount,
  scopes: state.Calendar.user?.scopes,
  user: state.Calendar.user,
  CalendarGoogleSignInErrors: state.Calendar.errors.CalendarLogin,
  activePayment: state.Profile.activePayment,
  stripeProfile: state.Profile.stripeProfile,
  payments: state.Profile.payments,
  payment_country: state.Profile.payment_country,
  googleToken: state.Calendar.user ? state.Calendar.user.accessToken : '',
});

const mapDispatchToProps = dispatch => ({
  actions: {
    logout: () => {
      dispatch(actions.googleLOGOUT());
    },
    getStripeAccount: () => {
      dispatch(profileActions.getStripeAccount());
    },
    getSubscriptions: () => {
      dispatch(profileActions.getSubscriptions());
    },
    updatePaymentCountry: data => {
      dispatch(profileActions.updatePaymentCountry(data));
    },
    cancelSubscriptions: data => {
      dispatch(profileActions.cancelSubscriptions(data));
    },
    setGoogleToken: token => {
      dispatch(actions.setGoogleToken(token));
    },
    setUserType: userType => {
      dispatch(profileActions.setUserType(userType));
    },
    setUser: user => {
      dispatch(actions.setUser(user));
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Me);
