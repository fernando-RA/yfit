import React, {Component} from 'react';
import {
  Switch,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {Text, Layout, Button, Input} from 'react-native-ui-kitten';
import {appInfo, stripe as stripeConfig, regx} from '../../../../config/app';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';

import * as profileActions from '../../../Profile/redux/actions';
import * as NavigationService from '../../../../navigator/NavigationService';

import {styles} from './styles';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {FlatList} from 'react-native-gesture-handler';
import Loader from '../../../../components/Loader';
import stripe from 'tipsi-stripe';
import ModalSelector from 'react-native-modal-selector';

stripe.setOptions({
  publishableKey: stripeConfig.publicKey,
  merchantId: 'merchant.com.crowdbotics.inaday',
  androidPayMode: 'test', // Android only
});

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      isEnabled: false,
      cardList: [],
      cvv: '',
      expiryDate: '',
      cardNumber: '',
      name: '',
      spinner: false,
      disabled: false,
      creditCardAdd: false,
      isSupportPay: false,
    };
    this._sendPayment = this._sendPayment.bind(this);
    this._addPaymentType = this._addPaymentType.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {user} = this.props.user;
    this.setUser(user);
    if (this.props.chatRoom.user_1.id !== this.props.user.user.id) {
      user_1 = this.props.chatRoom.user_1;
      user_2 = this.props.chatRoom.user_2;
      this.props.chatRoom.user_1 = user_2;
      this.props.chatRoom.user_2 = user_1;
    }
    this.setState({chatRoom: this.props.chatRoom});
    this.props.actions.getStripeCards();
    this.setSupportPay();
  }

  async setSupportPay() {
    const isSupport = await stripe.deviceSupportsNativePay();
    this.setState({isSupportPay: isSupport});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      const {user} = nextProps.user;
      this.setUser(user);
    }
    this.setState({spinner: false, disabled: false});
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
      stripe_customer_id: user.stripe_customer_id,
    });
  }

  createCard = async val => {
    const cardNumber = val.cardNumber;
    const month = val.month;
    const year = val.year;
    const customerId = val.customerId;
    const cvv = val.cvv;
    const data = new URLSearchParams();
    data.append('card[number]', `${cardNumber}`);
    data.append('card[exp_month]', `${month}`);
    data.append('card[exp_year]', `${year}`);
    data.append('card[cvc]', `${cvv}`);
    fetch('https://api.stripe.com/v1/tokens', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeConfig.publicKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data.toString(),
    })
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          Alert.alert(appInfo.appName, 'Error while adding card!');
        } else {
          Alert.alert(appInfo.appName, 'Card added successfully!');
        }
        this.setState({
          cvv: '',
          expiryDate: '',
          cardNumber: '',
          creditCardAdd: false,
        });
        this.props.actions.addCardSource({token: json.id, type: 'credit_card'});
      })
      .catch(e => {
        console.log(e);
      });
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

          <Text style={styles.heading}>SEND PAYMENT</Text>

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

  handleApplePayPress = async () => {
    try {
      this.setState({creditCardAdd: false});
      await stripe.openNativePaySetup();
      const token = await stripe.paymentRequestWithNativePay(
        {
          // requiredBillingAddressFields: ['all'],
          // requiredShippingAddressFields: ['all'],
        },
        [
          {
            label: 'Pay to Trainer',
            amount: this.state.amount,
          },
        ],
      );

      console.log('handleApplePayPress:: ', token);

      this.props.actions.addCardSource({token: token.tokenId, type: 'apple'});
      await stripe.completeNativePayRequest();
    } catch (error) {
      await stripe.cancelNativePayRequest();
    }
  };

  render() {
    const {amount, isEnabled} = this.state;

    let index = 0;
    let data = [
      {key: index++, section: true, label: 'Choose a payment method'},
      {key: index++, label: 'Credit Card'},
    ];
    if (this.state.isSupportPay) {
      if (Platform.OS === 'android') {
        data = [
          {key: index++, section: true, label: 'Choose a payment method'},
          {key: index++, label: 'Google Pay'},
          {key: index++, label: 'Credit Card'},
        ];
      } else {
        data = [
          {key: index++, section: true, label: 'Choose a payment method'},
          {key: index++, label: 'Apple Pay'},
          {key: index++, label: 'Credit Card'},
        ];
      }
    }

    return (
      <View style={styles.itemsContainer}>
        <ImageBackground
          style={{
            width: windowWidth * 1.3,
            height: windowHeight * 0.5,
            position: 'absolute',
            backgroundColor: '#E5E5E5',
          }}
          resizeMode={'contain'}
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
              <Text
                style={[
                  styles.label,
                  {
                    color: '#EC5E53',
                    margin: 8,
                  },
                ]}>
                To
              </Text>
              <Text
                style={[
                  styles.label,
                  {
                    color: '#EC5E53',
                    fontSize: 20,
                    fontWeight: 'bold',
                  },
                ]}>{`${this.state.chatRoom.user_2.first_name} ${
                this.state.chatRoom.user_2.last_name
              }`}</Text>

              <View
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                  padding: 35,
                  paddingVertical: 15,
                }}>
                <View style={[styles.fieldContainer]}>
                  <Text style={styles.label}>AMOUNT</Text>
                  <Input
                    placeholder="Enter the amount"
                    size="large"
                    onChangeText={amount => {
                      this.setState({amount});
                    }}
                    maxLength={3}
                    style={styles.input}
                    textStyle={styles.text}
                    keyboardType="numeric"
                  />
                </View>

                <View
                  style={[
                    styles.fieldContainer,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                  ]}>
                  <Text style={styles.label}>{`Recurring Monthly Payment: ${
                    isEnabled ? 'ON' : 'OFF'
                  }`}</Text>
                  <Switch
                    trackColor={{
                      false: '#767577',
                      true: '#EC5E53',
                    }}
                    thumbColor={isEnabled ? '#EC5E53' : '#767577'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={isEnabled => {
                      this.setState({isEnabled});
                    }}
                    value={isEnabled}
                  />
                </View>
                <View style={{alignItems: 'center'}}>
                  <FlatList
                    style={styles.list}
                    data={this.props.cardList}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={item => item.id}
                  />
                  {this.state.creditCardAdd && (
                    <View style={styles.cardFormContainer}>
                      <View style={styles.cardForm}>
                        <View style={styles.cardHeader}>
                          <Image
                            source={require('../../../../assets/images/stripe.png')}
                          />
                          <Text style={styles.addCardText}>
                            {'Secure payments through Stripe'}
                          </Text>
                        </View>
                        <View style={styles.cardHeader}>
                          <View style={styles.cardRow}>
                            <View style={styles.cardColumnFirst}>
                              <TextInput
                                value={this.state.name}
                                onChangeText={val => this.setState({name: val})}
                                style={styles.input}
                                placeholder="Cardholder Name"
                              />
                            </View>
                            <View style={styles.cardColumnSecond}>
                              <TextInput
                                keyboardType="numeric"
                                maxLength={5}
                                value={this.state.expiryDate}
                                onChangeText={val =>
                                  this.setState({
                                    expiryDate: val
                                      .replace(/\W/gi, '')
                                      .replace(/(.{2})/g, '$1/')
                                      .replace(/\/$/, ''),
                                  })
                                }
                                style={styles.input}
                                placeholder="Expiry Date"
                              />
                            </View>
                          </View>
                          <View style={styles.cardRow}>
                            <View style={styles.cardColumnFirst}>
                              <TextInput
                                keyboardType="numeric"
                                maxLength={19}
                                value={this.state.cardNumber}
                                onChangeText={val =>
                                  this.setState({
                                    cardNumber: val
                                      .replace(/\W/gi, '')
                                      .replace(/(.{4})/g, '$1-')
                                      .replace(/-$/, ''),
                                  })
                                }
                                style={styles.input}
                                placeholder="Card Number"
                              />
                            </View>
                            <View style={styles.cardColumnSecond}>
                              <TextInput
                                keyboardType="numeric"
                                value={this.state.cvv}
                                onChangeText={cvv => this.setState({cvv})}
                                maxLength={4}
                                style={styles.input}
                                placeholder="CVV"
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={this._addCard.bind(this)}
                        activeOpacity={0.7}
                        style={[styles.buttonContainer]}>
                        <Text style={styles.buttonText}>
                          {'+ ADD NEW CARD'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {this.props.cardList.length === 0 && (
                    <Text style={styles.noCards}>
                      {'No payment method is selected.'}
                    </Text>
                  )}
                  {this.props.cardList.length === 0 && (
                    <ModalSelector
                      data={data}
                      accessible={true}
                      disabled={this.state.amount ? false : true}
                      scrollViewAccessibilityLabel={'Scrollable options'}
                      cancelButtonAccessibilityLabel={'Cancel Button'}
                      cancelText={'Cancel'}
                      style={{marginVertical: 25, marginTop: 10}}
                      onChange={option => {
                        this._addPaymentType(option.label);
                      }}>
                      <TouchableOpacity
                        disabled={this.state.amount ? false : true}
                        activeOpacity={0.7}
                        style={[
                          styles.buttonContainer,
                          {
                            backgroundColor: '##FFFFFF',
                            borderWidth: 1,
                            borderColor: '#828282',
                          },
                        ]}>
                        <Text style={[styles.buttonText, {color: '#5A76AB'}]}>
                          {'ADD PAYMENT TYPE'}
                        </Text>
                      </TouchableOpacity>
                    </ModalSelector>
                  )}
                  <TouchableOpacity
                    onPress={this._sendPayment}
                    disabled={
                      this.state.amount && this.props.cardList.length !== 0
                        ? false
                        : true
                    }
                    activeOpacity={0.7}
                    style={[
                      styles.buttonContainer,
                      {
                        backgroundColor:
                          this.state.amount && this.props.cardList.length !== 0
                            ? '#5FE487'
                            : '#BDBDBD',
                        marginVertical: 25,
                      },
                    ]}>
                    <Text style={styles.buttonText}>{'SEND PAYMENT'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingScrollView>
          {this.state.spinner && <Loader />}
        </View>
      </View>
    );
  }

  _addPaymentType(op) {
    if (op === 'Apple Pay') {
      this.handleApplePayPress();
    } else if (op === 'Google Pay') {
      this.handleGooglePayPress();
    } else {
      this.setState({creditCardAdd: true});
    }
  }

  handleGooglePayPress = async () => {
    try {
      await stripe.openNativePaySetup();
      const token = await stripe.paymentRequestWithNativePay({
        // requiredBillingAddressFields: ['all'],
        // requiredShippingAddressFields: ['all'],
        total_price: this.state.amount,
        currency_code: 'USD',
        line_items: [],
      });

      console.log('handleGooglePayPress:: ', token);

      this.props.actions.addCardSource({token: token.tokenId, type: 'google'});
      await stripe.completeNativePayRequest();
    } catch (error) {
      console.log('handleGooglePayPress::', error);
      await stripe.cancelNativePayRequest();
    }
  };

  _sendPayment(op) {
    if (this.state.amount === '') {
      Alert.alert(appInfo.appName, 'Please fill amount value to continue.');
      return true;
    }
    this.setState({spinner: true, disabled: true});
    this.props.actions.addSubscriptions({
      price: this.state.amount,
      recurring: this.state.isEnabled,
      trainer_id: this.props.chatRoom.user_2.id,
    });
  }

  _addCard = async () => {
    const {cardNumber, expiryDate, cvv, name} = this.state;
    const cardNumberVal = parseInt(cardNumber.replace(/-/g, ''), 10);
    let month = '';
    const rawMonth = expiryDate.split('/')[0];
    if (rawMonth.length === 1) {
      month = parseInt(expiryDate.split('/')[0].replace('0', ''), 10);
    } else {
      month = parseInt(expiryDate.split('/')[0], 10);
    }
    const year = parseInt(expiryDate.split('/')[1], 10);
    const myDate = new Date();
    const currentMonth = myDate.getMonth();
    const currentYear = (myDate.getFullYear() / 100).toFixed();
    if (
      name === '' ||
      cardNumber === '' ||
      expiryDate === '' ||
      cvv === '' ||
      month === '' ||
      year === ''
    ) {
      Alert.alert(appInfo.appName, 'Please fill values to continue.');
      return false;
    } else if (regx.cardNumber.test(cardNumberVal) === false) {
      Alert.alert(appInfo.appName, 'Please enter valid card number.');
      return false;
    } else if (expiryDate.length != 5) {
      Alert.alert(appInfo.appName, 'Please enter valid expiry date.');
      return false;
    } else if (
      regx.month.test(month) === false ||
      (year === currentYear && month < currentMonth) ||
      year < currentYear
    ) {
      Alert.alert(appInfo.appName, 'Please enter valid expiry date.');
      return false;
    } else if (regx.cvv.test(cvv) === false) {
      Alert.alert(appInfo.appName, 'Please enter valid cvv.');
      return false;
    } else {
      await this.createCard({
        cardNumber: cardNumberVal,
        month: month,
        year: year,
        customerId: this.state.user.stripe_customer_id,
        cvv: cvv,
      });
    }
  };

  renderItem = ({item}) => {
    console.log('renderItem:: ');
    if (this.props.payment_type === 'apple') {
      return (
        <View>
          <Text style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>
            Payment Type
          </Text>
          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Text style={[styles.cardNumber, {color: '#5A76AB'}]}>
                Apple Pay
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.actions.deleteCard({id: item.id});
              }}
              style={styles.deleteButton}>
              <Text style={styles.delete}>{'Delete'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (this.props.payment_type === 'google') {
      return (
        <View>
          <Text style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>
            Payment Type
          </Text>
          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Text style={[styles.cardNumber, {color: '#5A76AB'}]}>
                Google Pay
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.actions.deleteCard({id: item.id});
              }}
              style={styles.deleteButton}>
              <Text style={styles.delete}>{'Delete'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View>
        <Text style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>
          Payment Type
        </Text>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            {item.brand === 'Visa' && (
              <FontAwesome
                style={styles.visaIcon}
                {...this.props}
                name="cc-visa"
              />
            )}
            {item.brand === 'MasterCard' && (
              <FontAwesome
                style={styles.masterCardIcon}
                {...this.props}
                name="cc-mastercard"
              />
            )}
            {item.brand === 'American Express' && (
              <Fontisto
                style={styles.americanExpresssIcon}
                {...this.props}
                name="american-express"
              />
            )}
            {item.brand === 'Discover' && (
              <FontAwesome
                style={styles.discoverIcon}
                {...this.props}
                name="cc-discover"
              />
            )}
            {item.brand === 'Diners Club' && (
              <FontAwesome
                style={styles.dinersIcon}
                {...this.props}
                name="cc-diners-club"
              />
            )}
            {item.brand === 'JCB' && (
              <Fontisto style={styles.jcbIcon} {...this.props} name="jcb" />
            )}
            {item.brand === 'UnionPay' && (
              <Image
                style={styles.unionpayIcon}
                source={require('../../../../assets/images/unionpay.png')}
              />
            )}
            <View style={styles.cardItem}>
              <Text style={styles.cardNumber}>{`xxxx xxxx xxxx ${
                item.last4
              } `}</Text>
              <Text style={styles.cardExpiry}>{`${item.exp_month}/${
                item.exp_year
              }`}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.actions.deleteCard({id: item.id});
            }}
            style={styles.deleteButton}>
            <Text style={styles.delete}>{'Delete'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}

const mapStateToProps = state => ({
  createSubscription: state.Profile.createSubscription,
  chatRoom: state.Details.room,
  user: state.Calendar.user,
  cardList: state.Profile.cards,
  payment_type: state.Profile.payment_type,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    getStripeCards: () => {
      dispatch(profileActions.getStripeCards());
    },
    addCardSource: data => {
      dispatch(profileActions.addCardSource(data));
    },
    addSubscriptions: data => {
      dispatch(profileActions.addSubscriptions(data));
    },
    deleteCard: data => {
      dispatch(profileActions.deleteCard(data));
    },
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
