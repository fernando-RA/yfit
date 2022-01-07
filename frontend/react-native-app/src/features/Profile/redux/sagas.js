import {
  all,
  takeLatest,
  put,
  call,
  select,
  take,
  fork,
  delay,
  race,
} from 'redux-saga/effects';

import * as NavigationService from '../../../navigator/NavigationService';
import * as constants from './constants';
import {request} from '../../../utils/http';
import Toast from 'react-native-simple-toast';
import * as actions from './actions';
import * as calendarConstants from '../../CalendarView/redux/constants';
import * as calendarActions from '../../CalendarView/redux/actions';

import {getUserSelf} from '../../../api/profile';

function addWorkoutTypes({workout_types, accessKey}) {
  const data = {ids: workout_types.map(type => type.id).join(',')};
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  request.defaults.headers.common['Content-Type'] = 'application/json';
  return request.post('/api/v1/profile/add_workout_types/', data);
}
function removeWorkoutTypes({workout_types, accessKey}) {
  const data = {ids: workout_types.map(type => type.id).join(',')};
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  request.defaults.headers.common['Content-Type'] = 'application/json';
  return request.post('/api/v1/profile/remove_workout_types/', data);
}

function findTypesToEdit(previousTypes, nextTypes, allTypes) {
  const toRemove = [];
  const toAdd = [];

  allTypes.forEach(type => {
    const matchOnPrevious = previousTypes.map(t => t.id).includes(type.id);
    const matchOnNext = nextTypes.map(t => t.id).includes(type.id);

    if (matchOnPrevious && !matchOnNext) {
      toRemove.push({...type});
    }

    if (!matchOnPrevious && matchOnNext) {
      toAdd.push({...type});
    }
  });

  return {toRemove, toAdd};
}

function updateProfileImage({data}) {
  return request.post('/api/v1/profile/set_profile_picture/', {
    image: data.image.data,
  });
}

function updateStripeID({user, accessKey}) {
  var bodyFormData = new FormData();
  bodyFormData.append('stripe_customer_id', user.stripe_customer_id);
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  request.defaults.headers.common['Content-Type'] = 'multipart/form-data';
  request.defaults.timeout = 50000;
  return request.patch('/api/v1/profile/' + user.id + '/', bodyFormData);
}

function postCardRequest({token, accessKey}) {
  var bodyFormData = new FormData();
  bodyFormData.append('token', token);
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  request.defaults.timeout = 50000;
  return request.post('/api/v1/payment/create_source/', bodyFormData);
}

function createSubscriptionRequest({data, accessKey}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  request.defaults.timeout = 50000;
  return request.post('/api/v1/payment/create_subscription/', data);
}

function cancelSubscriptionRequest({data, accessKey}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  request.defaults.timeout = 50000;
  return request.post('/api/v1/payment/cancel_subscription/', {id: data});
}

function deleteCardRequest({data, accessKey}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  request.defaults.timeout = 50000;
  return request.post('/api/v1/payment/delete_source/', data);
}

function updateProfile({user, accessKey}) {
  var bodyFormData = new FormData();
  bodyFormData.append('email', user.email);
  bodyFormData.append('first_name', user.first_name);
  bodyFormData.append('last_name', user.last_name);
  bodyFormData.append('bio', user.bio);
  bodyFormData.append('user_type', user.user_type);
  bodyFormData.append('instagram_link', user.instagram_link);
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  request.defaults.headers.common['Content-Type'] = 'multipart/form-data';
  request.defaults.timeout = 50000;
  return request.patch('/api/v1/profile/' + user.id + '/', bodyFormData);
}

function updateProfileUserType(userType, id) {
  return request.put(`/api/v1/profile/${id}/`, {user_type: userType});
}

function putUserReferral(referral, id) {
  return request.put(`/api/v1/profile/${id}/`, {referral_code: referral});
}

function* handleCreateProfileRequest(action) {
  try {
    const {user} = action.data;
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(updateProfile, {user, accessKey});
    if (status !== 400) {
      yield put({
        type: constants.CREATE_PROFILE_SUCCESS,
        user: {
          ...data,
        },
      });
      if (user.user_type === 'trainer') {
        NavigationService.replace('TrainerPreviewProfile');
      } else {
        NavigationService.navigate('MainApp');
      }
      Toast.show('Profile Updated...', Toast.LONG);
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.email) {
      Toast.show('Enter a valid email address.', Toast.LONG);
    } else {
      Toast.show('Error in saving profile...', Toast.LONG);
    }

    yield put({
      type: constants.CREATE_PROFILE_ERROR,
      error: 'Error in saving profile..',
    });
  }
}

function* handleStripeIDProfileRequest(action) {
  const user = action.data.user;
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(updateStripeID, {user, accessKey});
    yield put({
      type: constants.CREATE_PROFILE_SUCCESS,
      user: {
        ...user,
      },
    });
    Toast.show('Profile Stripe ID Updated...', Toast.LONG);
  } catch (error) {
    console.log(error);
    yield put({
      type: constants.CREATE_PROFILE_ERROR,
      error: 'Error in saving profile..',
    });
  }
}

function* handleProfileImage(action) {
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    // const user = yield select(state => state.Calendar.user.user);
    const {status, data} = yield call(updateProfileImage, {
      data: action.data,
      accessKey,
    });
    console.log('handleProfileImage::', data);
    Toast.show('Profile Picture Updated...', Toast.LONG);
    yield put({
      type: constants.PROFILE_IMAGE_UPLOAD_SUCCESS,
      profile_picture: data.profile_picture,
    });
  } catch (error) {
    console.log(error);
  }
}

function getProfilesRequest({
  query,
  accessKey,
  filters,
  limit,
  offset,
  user_type,
}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  let res = request.get('/api/v1/profile/page_search/', {
    params: {
      query,
      filters: filters.map(type => type.id).join(','),
      limit,
      offset,
      user_type: 'trainer',
    },
  });
  return res;
}

function getProfileByID({id, accessKey}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  let res = request.get(`/api/v1/profile/${id}/`);
  return res;
}

function accountStripeCreateRequest({accessKey, payment_country}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  // payment_country = payment_country ? payment_country : "US";
  // var bodyFormData = new FormData();
  // //bodyFormData.append("country", payment_country);
  //bodyFormData.append("country", "US");
  let res = request.post('api/v1/payment/create_stripe_account/');
  return res;
}

function accountStripeLoginRequest({accessKey}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  let res = request.post('api/v1/payment/gen_auth_link/');
  return res;
}

function accountStripeGETRequest({accessKey}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  let res = request.get('api/v1/payment/get_stripe_account/');
  return res;
}

function cardsStripeGETRequest({accessKey}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  let res = request.get('api/v1/payment/get_cards/');
  return res;
}

function* getProfiles(action) {
  yield put({type: 'STOP_POLLING_TRAINERS'});
  if (action.data.loadMore === true) {
    yield put(actions.loadMoreProfilesLoading(true));
  }
  yield delay(100);
  yield put({type: 'START_POLLING_TRAINERS', payload: action.data});
}

function* getProfile(action) {
  const {id} = action.data;
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(getProfileByID, {id, accessKey});
    if (status === 200) {
      yield put({type: constants.GET_PROFILE_SUCCESS, data: {profile: data}});
    }
  } catch (error) {
    const profile = yield select(state =>
      state.Calendar.profiles.find(profile => id === profile.id),
    );
    yield put({type: constants.GET_PROFILE_SUCCESS, data: {profile}});
    console.log(error);
  }
}

function* setMessages(action) {
  const user2 = action.data.user2;
  yield put({type: constants.MESSAGE_CHAT_SET_USER, user2: user2});
  NavigationService.navigate('ChatScreen');
}

function* createStripeAccount() {
  try {
    yield put({
      type: constants.CREATE_STRIPE_ACCOUNT_REQUEST_SUCCESS,
      stripe_data: null,
    });
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(accountStripeCreateRequest, {accessKey});
    if (status === 200) {
      console.log('createStripeAccount::', data);
      yield put({
        type: constants.CREATE_STRIPE_ACCOUNT_REQUEST_SUCCESS,
        stripe_data: data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* loginStripeAccount() {
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(accountStripeLoginRequest, {accessKey});
    if (status === 200) {
      yield put({
        type: constants.CREATE_STRIPE_ACCOUNT_REQUEST_SUCCESS,
        stripe_data: data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* getStripeAccount() {
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(accountStripeGETRequest, {accessKey});
    if (status === 200) {
      yield put({
        type: constants.GET_STRIPE_ACCOUNT_REQUEST_SUCCESS,
        stripe_data: data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* getStripeCards() {
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(cardsStripeGETRequest, {accessKey});
    if (status === 200) {
      yield put({
        type: constants.GET_STRIPE_CARDS_REQUEST_SUCCESS,
        cards: data.data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* postStripeCards(action) {
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(postCardRequest, {
      token: action.data.token,
      accessKey,
    });
    if (status === 200) {
      yield put({
        type: constants.POST_STRIPE_CARD_SUCCESS,
        payment_type: action.data.type,
      });
      yield put({type: constants.GET_STRIPE_CARDS_REQUEST});
    }
  } catch (error) {
    console.log(error);
  }
}

function* createSubscriptions(action) {
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(createSubscriptionRequest, {
      data: action.data,
      accessKey,
    });

    if (status === 200) {
      Toast.show('Payment sent..', Toast.LONG);
      yield put({
        type: constants.CREATE_SUBSCRIPTIONS_REQUEST_SUCCESS,
        response: data,
      });
      NavigationService.goBack();
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: constants.CREATE_SUBSCRIPTIONS_REQUEST_SUCCESS,
      response: 'error',
    });
    yield put({
      type: constants.CREATE_SUBSCRIPTIONS_REQUEST_SUCCESS,
      response: null,
    });
    Toast.show('There was an error on the payment.', Toast.LONG);
  }
}

function* deleteCard(action) {
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(deleteCardRequest, {
      data: action.data,
      accessKey,
    });
    if (status === 200) {
      yield put({type: constants.GET_STRIPE_CARDS_REQUEST});
    }
  } catch (error) {
    console.log(error);
    Toast.show('Error in Deleting Card..', Toast.LONG);
  }
}

function* getSubscriptions(action) {
  yield put({type: 'START_POLLING_EARNINGS'});
}

function* cancelSubscriptions(action) {
  try {
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    if (!action.data.stripe_subscription) {
      throw new Error('This payment is not a subscription');
    }
    const {status, data} = yield call(cancelSubscriptionRequest, {
      data: action.data.stripe_subscription.id,
      accessKey,
    });
    if (status === 200) {
      yield put({type: constants.GET_SUBSCRIPTION_REQUEST});
      Toast.show('Subscription cancelled...', Toast.LONG);
    }
  } catch (error) {
    if (error.message === 'This payment is not a subscription') {
      Toast.show(error.message, Toast.LONG);
    } else {
      Toast.show('Error in cancelling...', Toast.LONG);
    }
    console.error(error);
  }
}

function* saveTrainerProfile(action) {
  const userRX = yield select(state => state.Calendar.user.user);
  const user = {...userRX, ...action.payload};
  yield put(actions.createProfile({user}));
  yield put(actions.setWorkoutType(action.payload.workout_types));
}

function* setWorkoutTypesRequest(action) {
  try {
    const {accessKey, user} = yield select(state => state.Calendar.user);
    const wholeUser = yield select(state => state.Calendar.user);
    const allWorkoutTypes = yield select(
      state => state.CommonData.workout_types,
    );
    const currentTypes = user.workout_types;
    const editedTypes = action.payload;
    const {toAdd, toRemove} = findTypesToEdit(
      currentTypes,
      editedTypes,
      allWorkoutTypes,
    );
    if (toAdd.length > 0) {
      try {
        yield call(addWorkoutTypes, {
          accessKey,
          workout_types: toAdd,
        });
      } catch (error) {
        Toast.show('Error occurred while adding workout types...', Toast.LONG);
        console.error(error);
      }
    }
    if (toRemove.length > 0) {
      try {
        yield call(removeWorkoutTypes, {
          accessKey,
          workout_types: toRemove,
        });
      } catch (error) {
        Toast.show(
          'Error occurred while removing workout types...',
          Toast.LONG,
        );
        console.error(error);
      }
    }

    const {status, data: newUser} = yield call(getUserSelf, {token: accessKey});
    if (status !== 400) {
      yield put({
        type: calendarConstants.CALENDAR_SET_USER,
        user: {
          ...wholeUser,
          user: newUser,
        },
      });
    }
  } catch (error) {
    Toast.show('Error occurred while editing workout types...', Toast.LONG);
    console.error(error);
  }
}

function* setUserTypeRequest(action) {
  try {
    const userId = yield select(state => state.Calendar.user.user.id);
    const res = yield call(updateProfileUserType, action.payload, userId);
    if (res.status !== 400) {
      yield put(calendarActions.googleLOGOUT());
    }
  } catch (error) {
    Toast.show('Error occurred while switching user type...', Toast.LONG);
    console.error(error);
  }
}

function* putReferralUserRequest(action) {
  try {
    const userId = yield select(state => state.Calendar.user.user.id);
    const res = yield call(putUserReferral, action.payload, userId);
    if (res.status !== 400) {
      const user = yield select(state => state.Calendar.user);
      user.user.referral_code = res.data.referral_code;
      yield put({
        type: calendarConstants.CALENDAR_SET_USER,
        user: {
          ...user,
        },
      });
      if (res.data.referral_code !== '') {
        yield call(Toast.show, 'Referral accepted', Toast.LONG);
      }
    }
  } catch (error) {
    Toast.show('Error occurred while adding referral user...', Toast.LONG);
    console.error(error);
  }
}

function getPaymentsRequest({accessKey, user_type}) {
  const res = request.get(
    user_type === 'trainer'
      ? '/api/v1/payment/payments_received_trainer/'
      : '/api/v1/payment/payments_received_client/',
    {
      headers: {
        Authorization: 'Token ' + accessKey,
      },
    },
  );
  return res;
}

function* pollEarningTask() {
  while (true) {
    try {
      const accessKey = yield select(state => state.Calendar.user.accessKey);
      const user_type = yield select(
        state => state.Calendar.user.user.user_type,
      );
      const payments = yield call(getPaymentsRequest, {
        accessKey,
        user_type,
      });

      if (payments.status === 200) {
        yield put({
          type: constants.GET_SUBSCRIPTION_REQUEST_SUCCESS,
          payments: payments.data,
        });
      }
      yield delay(30000);
    } catch (error) {
      console.error(error);
      yield put({type: 'STOP_POLLING_EARNINGS', error});
    }
  }
}

function* pollEarningTaskWatcher() {
  while (true) {
    yield take('START_POLLING_EARNINGS');
    yield race([
      call(pollEarningTask),
      take('STOP_POLLING_EARNINGS'),
      take('STOP_POLLING'),
    ]);
  }
}

function* pollTrainersTask(action) {
  while (true) {
    const {query, filters, offset, limit, loadMore} = action.payload;
    try {
      const user_type = yield select(
        state => state.Calendar.user?.user.user_type,
      );
      const accessKey = yield select(state => state.Calendar.user?.accessKey);
      if (!accessKey) {
        throw new Error("accessKey hasn't been provided");
      }
      const {status, data} = yield call(getProfilesRequest, {
        query,
        accessKey,
        filters,
        offset,
        limit,
        user_type,
      });
      if (status === 200) {
        yield put({type: constants.SEARCH_PROFILE_SUCCESS, profiles: data});
      }
      if (data.limit === null && data.offset === null) {
        yield put(actions.loadMoreProfilesLoading(false));
      }
    } catch (error) {
      yield put({type: 'STOP_POLLING_TRAINERS', error});
      console.error(error);
    } finally {
      yield put(actions.loadMoreProfilesLoading(false));
      yield delay(30000);
    }
  }
}

function* pollTrainerWatch() {
  while (true) {
    const action = yield take('START_POLLING_TRAINERS');
    yield race([
      call(pollTrainersTask, action),
      take('STOP_POLLING_TRAINERS'),
      take('STOP_POLLING'),
    ]);
  }
}

function getPaymentsForMonthRequest({accessKey, link, user_type, recurring}) {
  const isTrainer = user_type === 'trainer';
  const url = isTrainer
    ? '/api/v1/payment/payments_received_trainer/'
    : '/api/v1/payment/payments_received_client/';
  const res = request.get(url, {
    headers: {
      Authorization: 'Token ' + accessKey,
    },
    params: {
      recurring: recurring ? 'True' : 'False',
      date: link,
    },
  });
  return res;
}

function* getPaymentsForMonth(action) {
  try {
    yield put(actions.setPaymentsLoading({month: true}));
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const user_type = yield select(state => state.Calendar.user.user.user_type);
    const paymentsRecurring = yield call(getPaymentsForMonthRequest, {
      accessKey,
      user_type,
      link: action.payload.link,
      recurring: true,
    });
    const paymentsSingle = yield call(getPaymentsForMonthRequest, {
      accessKey,
      user_type,
      link: action.payload.link,
      recurring: false,
    });
    const allPayments = [...paymentsRecurring.data, ...paymentsSingle.data];
    yield put(actions.getPaymentsForMonthSuccess(allPayments));
  } catch (error) {
    console.error(error);
  } finally {
    yield put(actions.setPaymentsLoading({month: false}));
  }
}

function getPaymentsForUserRequest({accessKey, id, user_type, isClass}) {
  const isTrainer = user_type === 'trainer';
  let idKey = isTrainer
    ? isClass
      ? 'client_class_id'
      : 'client_id'
    : 'trainer_id';
  const params = {
    [idKey]: id,
  };
  const url = isTrainer
    ? '/api/v1/payment/payments_received_trainer/'
    : '/api/v1/payment/payments_received_client/';
  const res = request.get(url, {
    headers: {
      Authorization: 'Token ' + accessKey,
    },
    params,
  });
  return res;
}

function* getPaymentsForUser(action) {
  try {
    yield put(actions.setPaymentsLoading({user: true}));

    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const user_type = yield select(state => state.Calendar.user.user.user_type);
    const allPayments = yield call(getPaymentsForUserRequest, {
      accessKey,
      user_type,
      id: action.payload.id,
      isClass: action.payload.isClass,
    });
    yield put(actions.getPaymentsForUserSuccess(allPayments.data));
  } catch (error) {
    console.error(error);
  } finally {
    yield put(actions.setPaymentsLoading({user: false}));
  }
}

export default all([
  takeLatest(constants.CREATE_PROFILE_REQUEST, handleCreateProfileRequest),
  takeLatest(
    constants.UPDATE_STRIPE_ID_PROFILE_REQUEST,
    handleStripeIDProfileRequest,
  ),
  takeLatest(constants.SEARCH_PROFILE_REQUEST, getProfiles),
  takeLatest(constants.GET_PROFILE_REQUEST, getProfile),
  takeLatest(constants.MESSAGE_CHAT_OPEN, setMessages),
  takeLatest(constants.UPDATEPROFILEIMAGE_REQUEST_SUCCESS, handleProfileImage),
  takeLatest(constants.CREATE_STRIPE_ACCOUNT_REQUEST, createStripeAccount),
  takeLatest(constants.LOGIN_STRIPE_ACCOUNT_REQUEST, loginStripeAccount),
  takeLatest(constants.GET_STRIPE_ACCOUNT_REQUEST, getStripeAccount),
  takeLatest(constants.GET_STRIPE_CARDS_REQUEST, getStripeCards),
  takeLatest(constants.POST_STRIPE_CARDS_REQUEST, postStripeCards),
  takeLatest(constants.CREATE_SUBSCRIPTIONS_REQUEST, createSubscriptions),
  takeLatest(constants.DELETE_STRIPE_CARDS_REQUEST, deleteCard),
  takeLatest(constants.GET_SUBSCRIPTION_REQUEST, getSubscriptions),
  takeLatest(constants.CANCEL_SUBSCRIPTION_REQUEST, cancelSubscriptions),
  takeLatest(constants.SAVE_TRAINER_PROFILE, saveTrainerProfile),
  takeLatest(constants.SET_WORKOUT_TYPES, setWorkoutTypesRequest),
  takeLatest(constants.SET_USER_TYPE, setUserTypeRequest),
  takeLatest(constants.PUT_REFERRAL_USER, putReferralUserRequest),
  takeLatest(constants.GET_PAYMENTS_FOR_MONTH, getPaymentsForMonth),
  takeLatest(constants.GET_PAYMENTS_FOR_USER, getPaymentsForUser),
  fork(pollEarningTaskWatcher),
  fork(pollTrainerWatch),
]);
