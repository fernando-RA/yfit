import * as actions from './constants';

export const createProfile = data => ({
  type: actions.CREATE_PROFILE_REQUEST,
  data: data,
});

export const searchProfiles = data => ({
  type: actions.SEARCH_PROFILE_REQUEST,
  data: data,
});

export const setChatUIWithUser = data => ({
  type: actions.MESSAGE_CHAT_OPEN,
  data: data,
});

export const setProfileImage = data => ({
  type: actions.UPDATEPROFILEIMAGE_REQUEST_SUCCESS,
  data,
});

export const updatePaymentCountry = data => ({
  type: actions.PROFILE_PAYMENT_COUNTRY_UPDATE,
  data,
});

//Payment
export const createStripeAccount = data => ({
  type: actions.CREATE_STRIPE_ACCOUNT_REQUEST,
});

export const loginStripeAccount = data => ({
  type: actions.LOGIN_STRIPE_ACCOUNT_REQUEST,
});

export const getStripeAccount = data => ({
  type: actions.GET_STRIPE_ACCOUNT_REQUEST,
});

export const getStripeCards = data => ({
  type: actions.GET_STRIPE_CARDS_REQUEST,
});

export const addCardSource = data => ({
  type: actions.POST_STRIPE_CARDS_REQUEST,
  data: data,
});

export const deleteCard = data => ({
  type: actions.DELETE_STRIPE_CARDS_REQUEST,
  data: data,
});

export const addSubscriptions = data => ({
  type: actions.CREATE_SUBSCRIPTIONS_REQUEST,
  data: data,
});

export const getSubscriptions = _ => ({
  type: actions.GET_SUBSCRIPTION_REQUEST,
});

export const cancelSubscriptions = data => ({
  type: actions.CANCEL_SUBSCRIPTION_REQUEST,
  data: data,
});

export const setWorkoutType = payload => ({
  type: actions.SET_WORKOUT_TYPES,
  payload,
});

export const setUserType = payload => ({
  type: actions.SET_USER_TYPE,
  payload,
});

export const putReferralUser = payload => ({
  type: actions.PUT_REFERRAL_USER,
  payload,
});

export const loadMoreProfilesLoading = payload => ({
  type: actions.LOAD_MORE_PROFILES_LOADING,
  payload,
});

export const loadMoreProfiles = payload => ({
  type: actions.LOAD_MORE_PROFILES,
  limit: payload,
});

export const getPaymentsForMonth = payload => ({
  type: actions.GET_PAYMENTS_FOR_MONTH,
  payload,
});

export const getPaymentsForMonthSuccess = payload => ({
  type: actions.GET_PAYMENTS_FOR_MONTH_SUCCESS,
  payload,
});

export const getPaymentsForMonthFailure = payload => ({
  type: actions.GET_PAYMENTS_FOR_MONTH_FAILURE,
  payload,
});

export const getPaymentsForUser = payload => ({
  type: actions.GET_PAYMENTS_FOR_USER,
  payload,
});

export const getPaymentsForUserSuccess = payload => ({
  type: actions.GET_PAYMENTS_FOR_USER_SUCCESS,
  payload,
});

export const getPaymentsForUserFailure = payload => ({
  type: actions.GET_PAYMENTS_FOR_USER_FAILURE,
  payload,
});

export const setPaymentsLoading = payload => ({
  type: actions.SET_PAYMENTS_LOADING,
  payload,
});

export const resetPaymentsForMonth = () => ({
  type: actions.RESET_PAYMENTS_FOR_MONTH,
});

export const resetPaymentsForUser = () => ({
  type: actions.RESET_PAYMENTS_FOR_USER,
});
