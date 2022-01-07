import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';

import PaymentHeader from '../PaymentHeader';
import * as actions from '../../redux/actions';
import * as NavigationService from '../../../../navigator/NavigationService';
import {styles} from './styles';

const TransactionView = ({navigation}) => {
  const {link, user_type, headerTitle, isDetailed} = navigation.state.params;
  const dispatch = useDispatch();
  const paymentsLoading = useSelector(state => state.Profile.paymentsLoading);

  const selectedPayments = useSelector(
    state => state.Profile.selectedMonthPayments,
  );

  const isTrainer = user_type === 'trainer' ? true : false;

  const paymentSorted = useMemo(() => {
    return selectedPayments
      ? selectedPayments.sort(
          (a, b) =>
            new Date(b.updated_date_time) - new Date(a.updated_date_time),
        )
      : [];
  }, [selectedPayments]);

  const total = useMemo(() => {
    if (paymentSorted.length > 0) {
      return parseFloat(
        paymentSorted.map(e => e.price).reduce((prev, curr) => prev + curr) /
          100,
      ).toFixed(2);
    } else {
      return 0;
    }
  }, [paymentSorted]);

  const getPaymentsForThisMonth = () => {
    dispatch(actions.getPaymentsForMonth({link}));
  };

  const cancelSubscriptionRequest = payment => () => {
    dispatch(actions.cancelSubscriptions(payment));
  };

  useEffect(() => {
    getPaymentsForThisMonth();
    return () => {
      dispatch(actions.resetPaymentsForMonth());
      dispatch(actions.setPaymentsLoading({month: true}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderRecurringPaymentSection = payment => {
    console.log(payment);
    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 5,
          marginTop: 5,
          justifyContent: isTrainer ? 'flex-start' : 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            style={{
              width: 16,
              height: 16,
              marginRight: 5,
            }}
            source={require('../../../../assets/icons/sync_24px.png')}
          />
          <Text style={{fontSize: 14}}>This is a recurring payment</Text>
        </View>
        {!isTrainer && (
          <View style={{marginRight: 5}}>
            {payment.cancelled ? (
              <Text>Cancelled</Text>
            ) : (
              <TouchableOpacity onPress={cancelSubscriptionRequest(payment)}>
                <Text style={{color: '#5A76AB', fontWeight: '600'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const openSelectedUser = clientOrClass => {
    let idToPush = clientOrClass.id;
    let isClass = false;
    if (Array.isArray(clientOrClass.spots)) {
      isClass = true;
    }
    if (clientOrClass.user) {
      isClass = false;
      idToPush = clientOrClass.user.id;
    }
    let title = `${clientOrClass.first_name} ${clientOrClass.last_name}`;
    console.log(clientOrClass, title);
    NavigationService.navigate('UserPaymentsView', {
      id: idToPush,
      user_type,
      headerTitle: title,
      isDetailed: true,
      isClass,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <PaymentHeader headerTitle={headerTitle} />
        <View style={styles.contentContainer} />
        {paymentsLoading.month ? (
          <ActivityIndicator small />
        ) : (
          <>
            {isDetailed ? null : <Text style={styles.titleText}>${total}</Text>}
            {paymentSorted.map(payment => {
              return (
                <View key={payment.id}>
                  <TouchableOpacity
                    style={{
                      margin: 10,
                      borderBottomColor: '#C4C4C4',
                      borderBottomWidth: 1,
                      paddingBottom: 8,
                    }}
                    onPress={
                      isDetailed
                        ? null
                        : () =>
                            openSelectedUser(
                              isTrainer
                                ? payment.payment.client_class
                                  ? payment.payment.client_class
                                  : payment.payment.client
                                : payment.payment.trainer,
                            )
                    }>
                    <Text
                      style={{
                        color: '#000000',
                        padding: 4,
                        fontSize: 14,
                      }}>{`${moment(new Date(payment.updated_date_time)).format(
                      'DD MMM, YYYY hh:mm A',
                    )}`}</Text>
                    {isTrainer ? (
                      <>
                        <View style={styles.alignContainer}>
                          <Text style={styles.text}>
                            <Text style={styles.underlineText}>{`${
                              payment.payment.client_class
                                ? payment.payment.client_class.first_name
                                : payment.payment.client.first_name
                            } ${
                              payment.payment.client_class
                                ? payment.payment.client_class.last_name
                                : payment.payment.client.last_name
                            }`}</Text>
                            {' paid you.'}
                          </Text>
                          <Text style={styles.textBold}>{`$${payment.price /
                            100}`}</Text>
                        </View>
                        {payment.recurring
                          ? renderRecurringPaymentSection(payment)
                          : null}
                      </>
                    ) : (
                      <>
                        <View style={styles.alignContainer}>
                          <Text style={styles.text}>
                            {'You paid '}
                            <Text
                              style={{
                                fontWeight: 'bold',
                              }}>{`${payment.payment.trainer.first_name} ${
                              payment.payment.trainer.last_name
                            }`}</Text>
                          </Text>
                          <Text style={styles.textBold}>{`$${payment.price /
                            100}`}</Text>
                        </View>

                        {payment.recurring
                          ? renderRecurringPaymentSection(payment)
                          : null}
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default TransactionView;
