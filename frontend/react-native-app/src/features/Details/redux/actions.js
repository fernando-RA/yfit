import * as actionTypes from './constants';

export const geRoom = data => ({
  type: actionTypes.CHAT_ROOM_GET,
  data,
});

export const getTrainerRequest = payload => ({
  type: actionTypes.GET_TRAINER_REQUEST,
  payload,
});

export const setTrainerFetching = payload => ({
  type: actionTypes.SET_TRAINER_FETCHING,
  payload,
});

export const getTrainerSuccess = payload => ({
  type: actionTypes.GET_TRAINER_SUCCESS,
  payload,
});

export const getTrainerError = () => ({
  type: actionTypes.GET_TRAINER_ERROR,
});

export const setTrainerLink = payload => ({
  type: actionTypes.SET_TRAINER_LINK,
  payload,
});

export const setTrainer = payload => ({
  type: actionTypes.SET_TRAINER,
  payload,
});

export const setTrainerClasses = payload => ({
  type: actionTypes.SET_TRAINER_CLASSES,
  payload,
});

export const clearState = () => ({
  type: actionTypes.CLEAR_STATE,
});
