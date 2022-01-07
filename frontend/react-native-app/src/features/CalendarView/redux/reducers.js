import * as actions from './constants';
import * as actionsProfile from '../../Profile/redux/constants';

const initialState = {
  user: null,
  errors: {
    CalendarLogin: null,
    CalenderADDError: null,
  },
  events: {},
  profiles: [],
  count: 0,
  limit: 20,
  offset: 0,
  createdCalenderEvent: null,
  sessionCount: 0,
  chatToken: null,
  profile: {},
  loadMoreLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CALENDAR_SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actions.CREATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          user: {
            ...action.user,
          },
        },
      };
    case actions.PROFILE_IMAGE_UPLOAD_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          user: {
            ...state.user.user,
            profile_picture: action.profile_picture,
          },
        },
      };

    case actions.SET_GOOGLE_TOKEN:
      return {
        ...state,
        user: state.user,
      };
    case actions.CHAT_TOKEN_DATA_SUCCESS:
      return {
        ...state,
        user: state.user,
        chatToken: action.chatToken,
      };
    case actions.SEARCH_PROFILE_SUCCESS:
      return {
        ...state,
        profiles: action.profiles.results,
        count: action.profiles.count,
        limit: action.profiles.limit,
        offset: action.profiles.offset,
        errors: {
          ...state.errors,
        },
      };
    case actionsProfile.LOAD_MORE_PROFILES_LOADING:
      return {
        ...state,
        loadMoreLoading: action.payload,
      };
    case actions.GET_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.data.profile,
      };
    case actions.CALENDAR_ADD_EVENT_SUCCESS:
      return {
        ...state,
        createdCalenderEvent: action.data,
      };
    case actions.CALENDAR_ADD_EVENT_CLEAR:
      return {
        ...state,
        createdCalenderEvent: null,
      };
    case actions.CALENDAR_GOOGLE_LOGIN_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          CalendarLogin: action.error,
        },
      };
    case actions.CALENDAR_DATA_SUCCESS:
      return {
        ...state,
        events: action.events,
        sessionCount: action.count,
      };

    case actions.CALENDAR_ADD_EVENT_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          CalenderADDError: action.error,
        },
      };
    case actions.CALENDAR_DATA_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          CalendarLogin: action.error,
        },
      };
    case actions.CALENDAR_GOOGLE_LOGOUT_SUCCESS:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
