import React from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import Text from '../../../../components/Typography/index';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import {useSelector} from 'react-redux';
import {calculateEstimatedProfit} from '../../utils';

const EstimatedCalculator = () => {
  const classData = useSelector(stateRX => stateRX.Classes.classData);
  const state = useSelector(stateRX => stateRX.Classes);
  const heightAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const maxHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
    duration: 400,
  });
  const [open, setOpen] = React.useState(false);
  const attendeePrice = classData.price.value.replace(/^\$/, '');

  React.useEffect(() => {
    if (open) {
      Animated.timing(heightAnim, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
      Animated.timing(rotateAnim, {
        toValue: 180,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      Animated.timing(rotateAnim, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [heightAnim, open, rotateAnim]);

  const estimatedCalculate = React.useCallback(() => {
    return calculateEstimatedProfit(
      attendeePrice,
      classData.attend_limit_count.value,
      classData.promo_code[0].discount,
      state.promoCodeConfirmed,
    );
  }, [
    attendeePrice,
    classData.attend_limit_count.value,
    classData.promo_code,
    state.promoCodeConfirmed,
  ]);

  const calculateTotal = React.useCallback(() => {
    if (classData.free) {
      return `$${0}`;
    }
    if (
      !classData.is_attendee_limit ||
      classData.price.error ||
      classData.attend_limit_count.error
    ) {
      return '$∞';
    }

    return classData.promo_code[0]?.discount ? `$${estimatedCalculate()}` : '';
  }, [
    classData.free,
    classData.is_attendee_limit,
    classData.price.error,
    classData.attend_limit_count.error,
    classData.promo_code,
    estimatedCalculate,
  ]);

  return (
    <TouchableOpacity
      style={styles.estimatedContainer}
      activeOpacity={0.6}
      onPress={() => setOpen(!open)}>
      <View style={styles.estimatedHeader}>
        <Text h3>Your estimated payout:</Text>
        <Text h3>{calculateTotal()}</Text>
      </View>
      {!classData.free && (
        <>
          <View style={[styles.estimatedHeader, styles.estimatedMore]}>
            <Text>How is this calculate?</Text>
            <Animated.View style={{transform: [{rotate: rotate}]}}>
              <AntDesignIcon name="caretup" size={12} style={{top: 5}} />
            </Animated.View>
          </View>

          <Animated.View style={[styles.estimatedBody, {maxHeight: maxHeight}]}>
            <View style={styles.row}>
              <Text bodyMedium>Price per attendee</Text>
              <Text bodyMedium>
                {attendeePrice ? `$${attendeePrice}` : '$0'}
              </Text>
            </View>
            {/* <View style={styles.row}>
          <Text bodyMedium>10% processing fee</Text>
          <Text bodyMedium>${(attendeePrice * 0.1).toFixed(2)}</Text>
        </View> */}
            {state.promoCodeConfirmed && classData.promo_code.length >= 1 ? (
              <View style={styles.row}>
                <Text bodyMedium>Percentage from promocode</Text>
                <Text bodyMedium>
                  $
                  {(
                    attendeePrice *
                    (classData.promo_code[0].discount / 100)
                  ).toFixed(2)}
                </Text>
              </View>
            ) : null}
            <View style={styles.row}>
              <Text bodyMedium>Maximum attendees</Text>
              <Text bodyMedium>
                {!classData.is_attendee_limit
                  ? 'Unlimited'
                  : classData.attend_limit_count.value}
              </Text>
            </View>
          </Animated.View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  estimatedContainer: {
    backgroundColor: '#F2F2F2',
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  estimatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  estimatedMore: {
    marginTop: 10,
  },
  estimatedBody: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default EstimatedCalculator;
