import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';

import Text from '../../../../components/Typography/index';
import DefaultButton from '../../../../components/Buttons/DefaultButton';
import Inputs from '../../../../components/Inputs/index';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../redux/actions';
import {withNavigation} from 'react-navigation';
import {Formik} from 'formik';
import {priceValidation} from '../validation';
import EstimatedCalculator from './EstimatedCalculator';
import KeyboardAvoidContainer from '../KeyboardAvoidContainer';
import FooterButton from '../FooterButton';

const PriceScreen = props => {
  const classData = useSelector(RXState => RXState.Classes.classData);
  const existingClass = props.navigation.getParam('existingClass');
  const promoCodeConfirmed = useSelector(
    RXState => RXState.Classes.promoCodeConfirmed,
  );

  const dispatch = useDispatch();

  // const goForward = () => {
  //   props.updateIndexOfStage(props.currentIndex + 1);
  // };

  const goToPreview = () => {
    props.navigation.navigate('PreviewScreen', {existingClass, edited: true});
  };

  const goToPromoScreen = React.useCallback(() => {
    props.updateIndexOfScreen(1);
  }, [props]);

  const EntypoIconRender = React.useCallback(
    () => (
      <View style={styles.entypoIcon}>
        <EntypoIcon name="chevron-small-right" size={35} />
      </View>
    ),
    [],
  );

  const changeAttendeePrice = React.useCallback(
    (value, error) => {
      if (!/^\$/.test(value)) {
        value = `$${value}`;
      }
      dispatch(actions.setAttendeePrice(value, error));
    },
    [dispatch],
  );

  const changeAttendeeLimit = React.useCallback(
    (value, error) => {
      dispatch(actions.setAttendeeLimit(value, error));
    },
    [dispatch],
  );

  const changeAttendee = React.useCallback(
    (values, errors) => {
      changeAttendeePrice(values.price, errors.price);
      changeAttendeeLimit(values.attend_limit_count, errors.attend_limit_count);
    },
    [changeAttendeeLimit, changeAttendeePrice],
  );

  const toggleAttendeeLimit = React.useCallback(
    isToggle => {
      dispatch(actions.setAttendeeUnlimited(!isToggle));
    },
    [dispatch],
  );

  const toggleFreeClass = React.useCallback(
    isToggle => {
      dispatch(actions.setClassFree(isToggle));
    },
    [dispatch],
  );

  return (
    <KeyboardAvoidContainer
      footerButtonComponent={
        <FooterButton
          goForward={goToPreview}
          currentIndex={props.currentIndex}
        />
      }>
      <View style={styles.container}>
        <View>
          <View style={styles.header}>
            <Text h2>Class price and size</Text>
            <Text bodyMedium>
              Decide what to charge and how many people can attend your class.
            </Text>
          </View>
          <Formik
            initialValues={{
              price: classData.price.value,
              attend_limit_count: classData.attend_limit_count.value,
            }}
            initialErrors={{
              price: classData.price.error,
              attend_limit_count: classData.attend_limit_count.error,
            }}
            validate={values =>
              priceValidation(values, changeAttendee, classData.free)
            }>
            {({handleBlur, setFieldValue, values, errors, touched}) => (
              <>
                <View style={{marginBottom: 30}}>
                  {classData.free ? (
                    <View>
                      <Text style={styles.label} bodyLargeBold bold>
                        Price per attendee
                      </Text>
                      <Text bodyMedium style={styles.sublabel}>
                        Toggle on to set class as free
                      </Text>
                    </View>
                  ) : (
                    <Inputs.Input
                      placeholder="$5"
                      label="Price per attendee"
                      sublabel="Toggle on to set class as free"
                      value={values.price}
                      onChangeText={value => {
                        let valueWithDollar = value;
                        if (!/^\$/.test(value)) {
                          valueWithDollar = `$${value.replace(/\D/g, '')}`;
                        } else {
                          valueWithDollar = `$${valueWithDollar
                            .slice(1)
                            .replace(/\D/g, '')}`;
                        }
                        setFieldValue('price', valueWithDollar);
                      }}
                      onBlur={handleBlur('price')}
                      errors={errors.price}
                      touched={touched.price}
                      keyboardType="number-pad"
                    />
                  )}

                  <Switch
                    style={styles.switchButton}
                    trackColor={classData.free ? '#00d03f' : '#fff'}
                    ios_backgroundColor="#fff"
                    value={classData.free}
                    onValueChange={toggleFreeClass}
                  />
                </View>
                <View style={{marginBottom: 30}}>
                  {!classData.is_attendee_limit ? (
                    <View>
                      <Text style={styles.label} bodyLargeBold bold>
                        Attendee limit
                      </Text>
                      <Text bodyMedium style={styles.sublabel}>
                        Set the maximum number of attendees
                      </Text>
                    </View>
                  ) : (
                    <Inputs.Input
                      label="Attendee limit"
                      sublabel="Set the maximum number of attendees"
                      placeholder="15"
                      value={values.attend_limit_count}
                      onChangeText={value => {
                        setFieldValue(
                          'attend_limit_count',
                          value.replace(/\D/g, ''),
                        );
                      }}
                      onBlur={handleBlur('attend_limit_count')}
                      errors={errors.attend_limit_count}
                      touched={touched.attend_limit_count}
                      keyboardType="number-pad"
                    />
                  )}
                  <Switch
                    style={styles.switchButton}
                    trackColor={
                      !classData.is_attendee_limit ? '#00d03f' : '#fff'
                    }
                    ios_backgroundColor="#fff"
                    value={!classData.is_attendee_limit}
                    onValueChange={toggleAttendeeLimit}
                  />
                </View>
              </>
            )}
          </Formik>
          {!classData.free && (
            <TouchableOpacity activeOpacity={0.6} onPress={goToPromoScreen}>
              <Inputs.Input
                label="Add a promo code"
                bold
                placeholder="None"
                rightIcon={EntypoIconRender()}
                value={
                  classData.promo_code[0]?.discount
                    ? classData.promo_code[0].promo
                    : ''
                }
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
          )}

          <EstimatedCalculator />
        </View>
      </View>
    </KeyboardAvoidContainer>
  );
};

export default withNavigation(PriceScreen);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 20,
    marginTop: 70,
  },
  header: {
    marginBottom: 30,
  },
  switchButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  entypoIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    right: -10,
  },
  label: {
    paddingBottom: 0,
  },
  sublabel: {
    paddingBottom: 8,
  },
});
