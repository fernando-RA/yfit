import {all, takeLatest, put, call, select} from 'redux-saga/effects';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import {Platform} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import * as Sentry from '@sentry/react-native';

import * as NavigationService from '../../../navigator/NavigationService';
import * as constants from './constants';
import * as profileConstants from '../../Profile/redux/constants';
import {googleEventsToAgendaEvents} from '../helpers';
import {request} from '../../../utils/http';
import DeviceInfo from 'react-native-device-info';
import * as commonDataConstants from '../../../redux/constants';
import {getUserSelf} from '../../../api/profile';
import AsyncStorage from '@react-native-community/async-storage';

function getWorkoutTypes() {
  return request.get('/api/v1/profile/list_workout_types/');
}

const postGoogleCalendarEvents = (
  summary,
  startDateTime,
  endDateTime,
  location,
  description,
  user1_email,
  user2_email,
  accessToken,
) => {
  const timeStart = moment(startDateTime).format('YYYY-MM-DDTHH:mm:ssZ');

  const timeEnd = moment(endDateTime).format('YYYY-MM-DDTHH:mm:ssZ');

  return axios({
    method: 'POST',
    url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Referer: 'https://developers.google.com',
    },
    data: {
      start: {
        dateTime: timeStart,
        timeZone: 'UTC',
      },
      end: {
        dateTime: timeEnd,
        timeZone: 'UTC',
      },
      location,
      description,
      summary,
      attendees: [{email: user1_email}, {email: user2_email}],
    },
  });
};

function sendLogin({access_token}) {
  return request.post(
    '/api/v1/login/google/',
    {access_token},
    {
      headers: {
        Authorization: '',
      },
    },
  );
}

function sendAppleLogin({access_token, first_name = null, last_name = null}) {
  return request.post(
    '/api/v1/login/apple/',
    {access_token, first_name, last_name},
    {
      headers: {
        Authorization: '',
      },
    },
  );
}

function getChatToken({token, user_id, deviceId}) {
  request.defaults.headers.common.Authorization = 'Token ' + token;
  return request.get(
    '/api/v1/chat/get_token/?user_id=' +
      user_id +
      '&device_id=' +
      deviceId +
      '&platform=' +
      Platform.OS,
  );
}

function* handleAppleLogin(action) {
  try {
    const dataToLogin = {
      access_token: action.data.access_token,
      first_name: action.data.credential.fullName?.first_name,
      last_name: action.data.credential.fullName?.last_name,
    };
    const loginResponse = yield call(sendAppleLogin, dataToLogin);
    const accessKey = loginResponse.data.token;

    const {status, data} = yield call(getUserSelf, {token: accessKey});
    const {data: workoutTypes} = yield call(getWorkoutTypes);

    yield put({
      type: commonDataConstants.STORE_WORKOUT_TYPES,
      payload: workoutTypes,
    });
    let user = {user: {}};

    yield call(Sentry.setUser, {
      email: data.email,
      user_name: `${data.first_name} ${data.last_name}`,
      id: data.id,
    });

    user.user.workout_types = data.workout_types;
    user.user.first_name = data.first_name;
    user.user.last_name = data.last_name;
    user.user.email = data.email;
    user.user.user_type = data.user_type;
    user.user.bio = data.bio;
    user.user.id = data.id;
    user.user.social_profile_url = data.social_profile_url;
    user.user.profile_picture = data.profile_picture;
    user.user.stripe_customer_id = data.stripe_customer_id;
    user.user.instagram_link =
      typeof undefined === data.instagram_link ? '@' : data.instagram_link;
    let deviceId = DeviceInfo.getDeviceId();
    const tokenResponse = yield call(getChatToken, {
      token: accessKey,
      user_id: data.id,
      deviceId: deviceId,
    });
    user.user.referral_code = data.referral_code;
    user.user.trainer_link = data.trainer_link;

    yield put({
      type: constants.CALENDAR_SET_USER,
      user: {
        ...user,
        accessToken: '',
        accessKey: accessKey,
        chatToken: tokenResponse.data.token,
      },
    });

    if (data.bio) {
      NavigationService.navigate('MainApp');
    } else {
      NavigationService.navigate('ProfileEdit');
    }
  } catch (error) {
    console.error(error.response.data);
    const err = error.response?.data?.non_field_errors;
    if (err) {
      Toast.show(err, Toast.LONG);
    } else if (error.message) {
      Toast.show(error.message, Toast.LONG);
    } else {
      Toast.show('Unknown error in login', Toast.LONG);
    }
  }
}

function* handleGoogleLogin() {
  try {
    yield call(GoogleSignin.hasPlayServices);
    if (yield call(GoogleSignin.isSignedIn)) {
      yield call(GoogleSignin.signOut);
    }

    GoogleSignin.configure({});

    const user = yield call(GoogleSignin.signIn);
    const {accessToken} = yield call(GoogleSignin.getTokens);

    const loginResponse = yield call(sendLogin, {access_token: accessToken});
    const accessKey = loginResponse.data.token;
    const {status, data} = yield call(getUserSelf, {token: accessKey});
    const {data: workoutTypes} = yield call(getWorkoutTypes);
    yield put({
      type: commonDataConstants.STORE_WORKOUT_TYPES,
      payload: workoutTypes,
    });

    yield call(Sentry.setUser, {
      email: data.email,
      user_name: `${data.first_name} ${data.last_name}`,
      id: data.id,
    });

    user.user.workout_types = data.workout_types;
    user.user.first_name = data.first_name;
    user.user.last_name = data.last_name;
    user.user.email = data.email;
    user.user.user_type = data.user_type;
    user.user.bio = data.bio;
    user.user.id = data.id;
    user.user.social_profile_url = data.social_profile_url;
    user.user.profile_picture = data.profile_picture;
    user.user.stripe_customer_id = data.stripe_customer_id;
    user.user.instagram_link =
      typeof undefined === data.instagram_link ? '@' : data.instagram_link;
    user.user.referral_code = data.referral_code;
    user.user.trainer_link = data.trainer_link;

    let deviceId = DeviceInfo.getDeviceId();
    const tokenResponse = yield call(getChatToken, {
      token: accessKey,
      user_id: data.id,
      deviceId: deviceId,
    });

    yield put({
      type: constants.CALENDAR_SET_USER,
      user: {
        ...user,
        accessToken,
        accessKey: accessKey,
        chatToken: tokenResponse.data.token,
      },
    });

    if (data.bio) {
      NavigationService.navigate('MainApp');
    } else {
      NavigationService.navigate('ProfileEdit');
    }
  } catch (error) {
    console.error(error);
    console.error(error?.response?.data);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      Toast.show('User canceled login flow..', Toast.LONG);
      yield put({
        type: constants.CALENDAR_GOOGLE_LOGIN_ERROR,
        error: 'User canceled login flow',
      });
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (f.e. sign in) is in progress already
      Toast.show('Sign in is in progress..', Toast.LONG);
      yield put({
        type: constants.CALENDAR_GOOGLE_LOGIN_ERROR,
        error: 'Sign in is in progress',
      });
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      Toast.show('Google calendar is not available..', Toast.LONG);
      yield put({
        type: constants.CALENDAR_GOOGLE_LOGIN_ERROR,
        error: 'Google calendar is not available',
      });
    } else {
      const err = error.response?.data?.non_field_errors;
      if (err) {
        Toast.show(err, Toast.LONG);
      } else if (error.message) {
        Toast.show(error.message, Toast.LONG);
      } else {
        Toast.show('Unknown error in login', Toast.LONG);
      }
      yield put({
        type: constants.CALENDAR_GOOGLE_LOGIN_ERROR,
        error: 'Unknown error in Calendar login',
      });
    }
  }
}

function* handleChatToken() {
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const user_id = yield select(state => state.Calendar.user.user.id);
    let deviceId = DeviceInfo.getDeviceId();
    const tokenResponse = yield call(getChatToken, {
      token: accessKey,
      user_id: user_id,
      deviceId: deviceId,
    });

    yield put({
      type: constants.CHAT_TOKEN_DATA_SUCCESS,
      chatToken: tokenResponse.data.token,
    });
    yield put({
      type: constants.CHAT_TOKEN_DATA_SUCCESS,
      chatToken: tokenResponse.data.token,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: constants.CHAT_TOKEN_DATA_ERROR,
      error: 'Error while fetching the Chat Token',
    });
  }
}

function* handleCalendarPostRequest(action) {
  try {
    const getSignedin = yield call(GoogleSignin.isSignedIn);
    console.log('getSignedIn::', getSignedin);

    const user = yield call(GoogleSignin.signInSilently);
    //console.log("user::",user);

    const {accessToken} = yield call(GoogleSignin.getTokens);

    const startTime = action.data.startTime;
    const endTime = action.data.endTime;
    const location = action.data.location;
    const description = action.data.description;
    const summary = action.data.title;
    const user1_email = yield select(state => state.Details.room.user_1.email);
    const user2_email = yield select(state => state.Details.room.user_2.email);
    const postCalender = yield call(
      postGoogleCalendarEvents,
      summary,
      startTime,
      endTime,
      location,
      description,
      user1_email,
      user2_email,
      accessToken,
    );
    yield put({
      type: constants.CALENDAR_ADD_EVENT_SUCCESS,
      data: postCalender.data,
    });
    NavigationService.goBack();
  } catch (error) {
    console.log(error);
    Toast.show('Error in adding event..', Toast.LONG);
    yield put({type: constants.CALENDAR_ADD_EVENT_ERROR, error: null});
    yield put({
      type: constants.CALENDAR_ADD_EVENT_ERROR,
      error: 'Error while fetching the Google Calendar Events with',
    });
  }
}

function* handleLogout() {
  try {
    yield call(AsyncStorage.removeItem, 'persist:root');
    yield call(GoogleSignin.revokeAccess);
    yield call(GoogleSignin.signOut);
  } catch (error) {
    console.error(error);
  } finally {
    yield put({type: 'STOP_POLLING'});
    yield put({type: constants.CALENDAR_GOOGLE_LOGOUT_SUCCESS});
    NavigationService.navigate('CalendarLogin');
  }
}

export default all([
  takeLatest(constants.CALENDAR_GOOGLE_LOGIN_REQUEST, handleGoogleLogin),
  takeLatest(constants.CALENDAR_APPLE_LOGIN_REQUEST, handleAppleLogin),
  takeLatest(constants.CHAT_TOKEN_DATA_REQUEST, handleChatToken),
  takeLatest(constants.CALENDAR_GOOGLE_LOGOUT_REQUEST, handleLogout),
  takeLatest(constants.CALENDAR_ADD_EVENT_REQUEST, handleCalendarPostRequest),
]);
