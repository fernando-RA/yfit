import React, {useEffect, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import * as actions from '../../redux/actions';
import PaymentHeader from '../PaymentHeader';
import {styles} from './styles';

export default function UserPaymentsView({navigation}) {
  const {
    id,
    user_type,
    headerTitle,
    isDetailed,
    isClass,
  } = navigation.state.params;
  const dispatch = useDispatch();
  const paymentsLoading = useSelector(state => state.Profile.paymentsLoading);

  const selectedPayments = useSelector(
    state => state.Profile.selectedUserPayments,
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

  const getPaymentsForUser = () => {
    dispatch(actions.getPaymentsForUser({id, isClass}));
  };

  useEffect(() => {
    getPaymentsForUser();
    return () => {
      dispatch(actions.resetPaymentsForUser());
      dispatch(
        actions.setPaymentsLoading({
          user: true,
        }),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isClass]);

  const renderRecurringPaymentSection = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 5,
          marginTop: 5,
        }}>
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
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <PaymentHeader headerTitle={headerTitle} />
        <View style={styles.contentContainer} />
        {paymentsLoading.user ? (
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
                    }}>
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
                                ? payment.payment.client_class.first_name
                                : payment.payment.client.last_name
                            }`}</Text>
                            {' paid you.'}
                          </Text>
                          <Text style={styles.textBold}>{`$${payment.price /
                            100}`}</Text>
                        </View>
                        {payment.recurring
                          ? renderRecurringPaymentSection()
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
                          ? renderRecurringPaymentSection()
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
}
