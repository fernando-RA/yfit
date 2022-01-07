import * as constants from './constants';

const initialState = {
  user2: null,
  stripe_account_data: null,
  stripeProfile: null,
  cards: [],
  createSubscription: null,
  subscriptions: [],
  payments: [],
  activePayment: false,
  payment_type: 'credit_card',
  payment_country: 'US',
  selectedMonthPayments: [],
  selectedUserPaymentsUser: [],
  paymentsLoading: {
    month: false,
    user: false,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.MESSAGE_CHAT_SET_USER:
      return {...state, user2: action.user2};
    case constants.CREATE_STRIPE_ACCOUNT_REQUEST_SUCCESS:
      return {...state, stripe_account_data: action.stripe_data};
    case constants.GET_STRIPE_ACCOUNT_REQUEST_SUCCESS:
      return {
        ...state,
        stripeProfile: action.stripe_data,
        activePayment: action.stripe_data.payouts_enabled,
      };
    case constants.GET_STRIPE_CARDS_REQUEST_SUCCESS:
      return {...state, cards: action.cards};
    case constants.POST_STRIPE_CARD_SUCCESS:
      return {...state, payment_type: action.payment_type};
    case constants.CREATE_SUBSCRIPTIONS_REQUEST_SUCCESS:
      return {...state, createSubscription: action.response};
    case constants.GET_SUBSCRIPTION_REQUEST_SUCCESS:
      return {
        ...state,
        subscriptions: action.subscriptions,
        payments: action.payments,
      };
    case constants.CALENDAR_ADD_EVENT_CLEAR:
      return {
        ...state,
        createSubscription: null,
      };
    case constants.PROFILE_PAYMENT_COUNTRY_UPDATE:
      return {
        ...state,
        payment_country: action.data.payment_country,
      };
    case constants.GET_PAYMENTS_FOR_MONTH_SUCCESS:
      return {
        ...state,
        selectedMonthPayments: action.payload,
      };
    case constants.RESET_PAYMENTS_FOR_MONTH:
      return {
        ...state,
        selectedMonthPayments: [],
      };
    case constants.GET_PAYMENTS_FOR_USER_SUCCESS:
      return {
        ...state,
        selectedUserPayments: action.payload,
      };
    case constants.RESET_PAYMENTS_FOR_USER:
      return {
        ...state,
        selectedUserPayments: [],
      };
    case constants.SET_PAYMENTS_LOADING:
      const {month, user} = action.payload;
      return {
        ...state,
        paymentsLoading: {
          ...state.paymentsLoading,
          month: month !== undefined ? month : state.paymentsLoading.month,
          user: user !== undefined ? user : state.paymentsLoading.user,
        },
      };
    case 'CALENDAR/GOOGLE_LOGOUT/SUCCESS':
      return initialState;
    default:
      return state;
  }
};
