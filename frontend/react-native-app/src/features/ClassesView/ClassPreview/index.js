import React, {useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Avatar} from 'react-native-elements';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import Dialog from 'react-native-dialog';
import FastImage from 'react-native-fast-image'

import * as actions from '../redux/actions';
import TimeText from '../ClassCard/TimeText';
import Map from './Map';
import {POLICY} from '../ModalViews/FifthStep';
import TagLabel from '../ClassCard/TagLabel';
import DefaultButton from '../../../components/Buttons/DefaultButton';
import Text from '../../../components/Typography/index';
import DeviceInfo from 'react-native-device-info';
import DimensionUtils from '../utils/index';



const deviceId = DeviceInfo.getDeviceId();
const isIphone12 =
  deviceId === 'iPhone13,4' ||
  deviceId === 'iPhone13,3' ||
  deviceId === 'iPhone13,2';
const ClassPreview = props => {
  const edited = props.navigation.getParam('edited');
  const existingClass = props.navigation.getParam('existingClass');
  const dispatch = useDispatch();
  const stateClass = useSelector(RXState => RXState.Classes);
  const userProfileState = useSelector(RXState => RXState.Calendar.user.user);
  const stripeProfile = useSelector(state => state.Profile.stripeProfile);
  const state = useSelector(state => state.Profile);

  const [showMore, setShowMore] = React.useState(false);
  const [isModalVisible, toggleModalVisibility] = React.useState(false);
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);






  const hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied', '', [
        {text: 'Go to Settings', onPress: openSetting},
      ]);
    }

    if (status === 'disabled') {
      Alert.alert(
        'Turn on Location Services to allow Rec to determine your location.',
        '',
        [{text: 'Go to Settings', onPress: openSetting}],
      );
    }

    return false;
  };

  const onPublishClass = async () => {
    if (
      stripeProfile?.requirements?.disabled_reason &&
      !stateClass.classData.free
    ) {
      toggleModalVisibility(true);
      return;
    }
    if (Platform.OS === 'ios') {
      // return null;
      const hasLocationPermission = await hasLocationPermissionIOS();
      if (!hasLocationPermission) {
        Alert.alert('Location permission denied', '', [
          {
            text: 'Go to Settings',
            onPress: () =>
              Linking.openSettings().catch(() => {
                Alert.alert('Unable to open settings');
              }),
          },
        ]);
        return;
      }
    }
    if (existingClass) {
      Geolocation.getCurrentPosition(
        position => {
          dispatch(actions.classFetching(true));
          dispatch(
            actions.editExistingClassRequest({
              id: existingClass,
              classData: {
                ...stateClass.classData,
                geotag: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
              },
            }),
          );
        },
        error => {
          console.error(error.code, error.message);
        },
        {timeout: 15000, showLocationDialog: true},
      );
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        dispatch(actions.classFetching(true));
        dispatch(
          actions.publishClassRequest({
            ...stateClass.classData,
            geotag: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }),
        );
      },
      error => {
        console.error(error.code, error.message);
      },
      {timeout: 15000, showLocationDialog: true},
    );
  };

  useEffect(() => {
    if (stateClass.success && existingClass) {
      props.navigation.navigate('Home', {
        onModalOpen: undefined,
      });
      return;
    }
    if (stateClass.success) {
      props.navigation.navigate('Home', {
        onModalOpen: () => stateClass.class_link,
      });
    }
    // necessary disabling because we'll get infinity loop after updating navigation params
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, stateClass.success]);

  const remainingSlots =
    Number(stateClass.classData?.attend_limit_count?.value) -
    stateClass.classData?.clients;

  const toggleDialog = () => {
    setIsDialogVisible(isVisible => !isVisible);
  };

  const cancelClass = () => {
    toggleDialog();
    dispatch(actions.cancelClass(existingClass));
  };

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={0.5}
        swipeDirection={['down']}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        onSwipeComplete={() => toggleModalVisibility(false)}
        useNativeDriver={true}>
        <View
          style={{
            width: '100%',
            backgroundColor: '#FFF',
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            paddingHorizontal: 22,
            paddingTop: 30,
            paddingBottom: 20,
          }}>
          <TouchableOpacity
            style={{position: 'absolute', top: 20, right: 20, zIndex: 10}}
            activeOpacity={0.6}
            onPress={() => toggleModalVisibility(false)}>
            <AntDesign name="close" size={24} color="#333333" />
          </TouchableOpacity>
          <Text h2 bold style={{marginBottom: 13}}>
            Connect Stripe to enable sign-ups for your class
          </Text>
          <Text
            bodyRegular
            style={{marginBottom: 15, textDecorationLine: 'underline'}}>
            Create or connect your Stripe account to publish your class and get
            paid. It’s fast, easy, and secure.
          </Text>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginTop: 20,
            }}>
            <DefaultButton
              text="CONNECT NOW"
              onPress={() => {
                toggleModalVisibility(false);
                props.navigation.navigate('PaymentAccount');
              }}
            />
          </View>
        </View>
      </Modal>
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <ScrollView contentContainerStyle={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.headerContainer}>
            <View style={styles.imageContainer}>
              <FastImage
                source={{
                  uri:
                    typeof stateClass?.classData?.featured_photo === 'string'
                      ? stateClass?.classData?.featured_photo
                      : stateClass?.classData?.featured_photo?.uri,

                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,


                }
                }

                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.overlapHeader}>
              {stateClass.classData.repeat !== 'never' && (
                <TagLabel
                  label="RECURRING CLASS"
                  backgroundColor="#5A76AB"
                  style={{marginBottom: 11, alignSelf: 'flex-start'}}
                />
              )}
              <Text h1 style={{color: '#fff', marginBottom: 15}}>
                {stateClass.classData.name}
              </Text>
              <View style={[styles.row, styles.profileInfo]}>
                <Avatar
                  source={{uri: userProfileState?.profile_picture}}
                  rounded
                  small
                />
                <View style={{marginLeft: 14}}>
                  <Text
                    bodyMedium
                    bold
                    style={[styles.whiteText, styles.underlineText]}>
                    {userProfileState.first_name} {userProfileState.last_name}
                  </Text>
                  <View style={[styles.row]}>
                    {userProfileState.workout_types.map((type, i) => (
                      <Text key={type.id} bodyMedium style={styles.whiteText}>
                        {i !== 0 && ' + '}
                        {type.workout_type}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bodyContainer}>
            <View style={[styles.row, styles.rowCenter, {marginBottom: 18}]}>
              <EntypoIcon
                name="location"
                color="#828282"
                size={19}
                style={{marginRight: 8}}
              />
              <Text
                bodyRegular
                style={[
                  styles.whiteText,
                  styles.underlineText,
                  {marginLeft: 10},
                ]}>
                {stateClass.classData.type === 0
                  ? stateClass.classData.location.location_name
                  : 'Virtual'}
              </Text>
            </View>
            <View style={[styles.row, styles.rowCenter, {marginBottom: 18}]}>
              <FeatherIcon
                name="user"
                color="#828282"
                size={19}
                style={{marginRight: 8}}
              />
              <Text bodyRegular style={[styles.whiteText, {marginLeft: 10}]}>
                {stateClass.classData.is_attendee_limit
                  ? `${
                      stateClass.classData?.clients
                        ? stateClass.classData?.clients
                        : 0
                    }/${
                      stateClass.classData?.attend_limit_count?.value
                    } Spots booked`
                  : '0 Spots booked'}
                {!isNaN(remainingSlots) &&
                  remainingSlots < 4 &&
                  remainingSlots > 0 &&
                  !stateClass.classData.is_attendee_limit && (
                    <Text style={{color: '#5FE487'}} bold>
                      {' '}
                      {remainingSlots} spots left!
                    </Text>
                  )}
                {!isNaN(remainingSlots) &&
                  remainingSlots === 0 &&
                  !stateClass.classData.is_attendee_limit && (
                    <Text style={{color: '#FB1B1B'}}> Sold out</Text>
                  )}
              </Text>
            </View>
            <View style={[styles.row, styles.rowCenter, {marginBottom: 5}]}>
              <FeatherIcon
                name="clock"
                color="#828282"
                size={19}
                style={{marginRight: 8}}
              />
              <TimeText
                bodyRegular
                duration={stateClass.classData.duration}
                startDate={stateClass.classData.start_time}
                style={[styles.whiteText, {marginLeft: 10}]}
              />
            </View>
            <View style={{paddingLeft: 38}}>
              {stateClass.classData.repeat !== 'never' && (
                <Text bodySmall style={{fontStyle: 'italic', color: '#5FE487'}}>
                  {stateClass.classData.repeat === 'daily' &&
                    'This class occurs every day'}
                  {stateClass.classData.repeat === 'weekly' &&
                    `This class occurs every week on ${moment(
                      stateClass.classData.start_time,
                    ).format('dddd')}`}
                  {stateClass.repeat === 'monthly' &&
                    `This class occurs every two weeks on ${moment(
                      stateClass.classData.start_time,
                    ).format('dddd')}`}
                </Text>
              )}
            </View>
            <View style={{marginBottom: 20, marginTop: 13}}>
              <Text bodySmall bold style={styles.subtitle}>
                WHAT YOU NEED FOR CLASS
              </Text>
              <Text bodyRegular style={[styles.whiteText]}>
                {stateClass.classData.equipment}
              </Text>
            </View>
            <View
              style={[
                styles.bottomBorder,
                {paddingBottom: 20, marginBottom: 25},
              ]}>
              {stateClass.classData.tags.length > 0 ? (
                <>
                  <Text bodySmall bold style={styles.subtitle}>
                    CLASS TYPE
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    {stateClass.classData.tags.map((tag, i) => (
                      <Text key={tag} bodyRegular style={styles.whiteText}>
                        {`${i !== 0 ? ', ' : ''}${tag}`}
                      </Text>
                    ))}
                  </View>
                </>
              ) : null}
            </View>
            <View
              style={[
                styles.bottomBorder,
                {paddingBottom: 20, marginBottom: 25},
              ]}>
              <Text h4 style={styles.whiteText}>
                {showMore
                  ? stateClass.classData.details
                  : `${stateClass.classData.details.slice(0, 150)}${
                      stateClass.classData.details.length > 150 ? '...' : ''
                    }`}
              </Text>
              {stateClass.classData.details.length > 150 && (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{marginTop: 15}}
                  onPress={() =>
                    showMore ? setShowMore(false) : setShowMore(true)
                  }>
                  <Text h4 style={[styles.subtitle, styles.underlineText]}>
                    {showMore ? 'Hide' : 'Show more'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={[
                styles.bottomBorder,
                {paddingBottom: 20, marginBottom: 25},
              ]}>
              <Text bodySmall bold style={styles.subtitle}>
                LOCATION
              </Text>
              <View>
                {stateClass.classData.type === 1 ? (
                  <>
                    <Text
                      bodyRegular
                      bold
                      style={[styles.whiteText, {marginBottom: 12}]}>
                      Virtual
                    </Text>

                    <Text bodyRegular style={styles.whiteText}>
                      You will receive an email 6 hours before class with a with
                      virtual class details. If you sign up within the 6 hour
                      window you will receive the email immediately.
                    </Text>
                  </>
                ) : null}
                {stateClass.classData.location &&
                stateClass.classData.type === 0 ? (
                  <>
                    <View style={{marginBottom: 12}}>
                      <Map location={{...stateClass.classData.location}} />
                    </View>
                    <Text
                      bodyRegular
                      bold
                      style={[styles.whiteText, {marginBottom: 12}]}>
                      {stateClass.classData.location.location_name}
                    </Text>
                    {stateClass.classData.location_notes ? (
                      <Text bodyRegular style={styles.whiteText}>
                        {stateClass.classData.location_notes}
                      </Text>
                    ) : null}
                  </>
                ) : null}
              </View>
            </View>
            <View
              style={[
                styles.bottomBorder,
                {paddingBottom: 20, marginBottom: 25},
              ]}>
              <Text bodySmall style={styles.subtitle}>
                CANCELLATION POLICY
              </Text>
              <Text bodyRegular style={styles.whiteText}>
                Speak with your trainer before class.
                {/* {
                  POLICY.find(
                    policy =>
                      policy.value.toLowerCase() ===
                      stateClass.classData.cancellation_policy,
                  ).text1
                } */}
              </Text>
              {/* <Text bodyRegular style={styles.whiteText}>
                {
                  POLICY.find(
                    policy =>
                      policy.value.toLowerCase() ===
                      stateClass.classData.cancellation_policy,
                  ).text2
                }
              </Text> */}
            </View>
            {stateClass.classData.type !== 1 && (
              <View
                style={[
                  styles.bottomBorder,
                  {paddingBottom: 20, marginBottom: 25},
                ]}>
                <Text bodySmall style={styles.subtitle}>
                  HEALTH & SAFETY
                </Text>
                <Text bodyRegular style={styles.whiteText}>
                  {stateClass.classData.safety_protocol}
                </Text>
              </View>
            )}

            {edited && (
              <View style={styles.button}>
                <DefaultButton
                  text="Publish"
                  onPress={onPublishClass}
                  loading={stateClass.isFetching}
                  disabled={stateClass.isFetching}
                />
              </View>
            )}

            {!edited && existingClass && (
              <TouchableOpacity
                style={styles.cancelContainer}
                onPress={toggleDialog}>
                {stateClass.cancelClassLoading ? (
                  <ActivityIndicator small />
                ) : (
                  <Text style={styles.cancelText}>
                    {stateClass.classData?.clients > 0
                      ? 'Request to cancel'.toUpperCase()
                      : 'CANCEL CLASS'}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            <Dialog.Container visible={isDialogVisible}>
              <Dialog.Title>
                {stateClass.classData?.clients > 0
                  ? 'Are you sure you want to request to cancel this class?'
                  : 'Are you sure you want to cancel'}
              </Dialog.Title>
              {stateClass.classData?.clients > 0 && (
                <Dialog.Description>
                  We will review your request and get in touch via email
                </Dialog.Description>
              )}
              <Dialog.Button label="Cancel" onPress={toggleDialog} />
              <Dialog.Button
                label="Yes"
                bold
                color="#FB1B1B"
                onPress={cancelClass}
              />
            </Dialog.Container>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

ClassPreview.navigationOptions = props => {
  const existingClass = props.navigation.getParam('existingClass');
  const past = props.navigation.getParam('past');
  const duplicate = props.navigation.getParam('duplicate');

  const headerTitleRender = () => {
    if (existingClass || past) {
      return null;
    }
    return (
      <Text bodyRegular bold style={styles.whiteText}>
        Preview
      </Text>
    );
  };

  const headerRightRender = () => {
    if (past) {
      return (
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.6}
          onPress={() => props.navigation.navigate('Modal', {past: true})}>
          <Text bodyMedium bold>
            Duplicate
          </Text>
        </TouchableOpacity>
      );
    }
    if (existingClass) {
      return (
        <View
          style={
            isIphone12
              ? {
                  flexDirection: 'row',
                  position: 'absolute',
                  top: 30,
                  right: 0,
                }
              : {flexDirection: 'row'}
          }>
          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={0.6}
            onPress={() =>
              props.navigation.navigate('ShareScreen', {existingClass})
            }>
            <Text bodyMedium bold>
              Share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={0.6}
            onPress={() =>
              props.navigation.navigate('Modal', {
                existingClass,
                edited: true,
              })
            }>
            <Text bodyMedium bold>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (duplicate) {
      return (
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.6}
          onPress={() => props.navigation.navigate('Modal', {duplicate: true})}>
          <Text bodyMedium bold>
            Edit
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={styles.headerButton}
        activeOpacity={0.6}
        onPress={() => props.navigation.navigate('Modal')}>
        <Text bodyMedium bold>
          Edit
        </Text>
      </TouchableOpacity>
    );
  };

  const headerLeftRender = () => {
    if (existingClass) {
      return (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Home')}
          style={
            isIphone12
              ? {marginHorizontal: 16, position: 'absolute', top: 30, left: 0}
              : {marginHorizontal: 16}
          }>
          <AntDesignIcon name="arrowleft" size={26} color="#fff" />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return {
    headerStyle: styles.routeHeader,
    headerTransparent: true,
    headerTintColor: '#fff',
    headerTitle: headerTitleRender,
    headerRight: headerRightRender,
    headerLeft: headerLeftRender,
  };
};

const styles = StyleSheet.create({
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 21,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#828282',
  },
  subtitle: {
    color: '#828282',
    marginBottom: 7,
  },
  bodyContainer: {
    backgroundColor: '#000',
    paddingTop: 28,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  rowCenter: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  whiteText: {
    color: '#fff',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  overlapHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    height: 580,
    width: '100%',
  },
  container: {
    backgroundColor: '#000',
  },
  routeHeader: {
    backgroundColor: 'transparent',
  },
  cancelContainer: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FB1B1B',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: '#FB1B1B',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ClassPreview;
