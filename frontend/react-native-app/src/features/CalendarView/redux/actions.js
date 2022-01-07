import * as actions from './constants';

export const googleSignIn = _ => ({
  type: actions.CALENDAR_GOOGLE_LOGIN_REQUEST,
});

export const googleLOGOUT = _ => ({
  type: actions.CALENDAR_GOOGLE_LOGOUT_REQUEST,
});

export const createProfile = _ => ({
  type: actions.CREATE_PROFILE_REQUEST,
});

export const setGoogleToken = token => ({
  type: actions.SET_GOOGLE_TOKEN,
  token,
});

export const getChatToken = _ => ({
  type: actions.CHAT_TOKEN_DATA_REQUEST,
});

export const addEvent = data => ({
  type: actions.CALENDAR_ADD_EVENT_REQUEST,
  data,
});

export const clearRecentEvent = _ => ({
  type: actions.CALENDAR_ADD_EVENT_CLEAR,
});

export const appleSignIn = data => ({
  type: actions.CALENDAR_APPLE_LOGIN_REQUEST,
  data: data,
});

export const setUser = payload => ({
  type: actions.CALENDAR_SET_USER,
  user: payload,
});
