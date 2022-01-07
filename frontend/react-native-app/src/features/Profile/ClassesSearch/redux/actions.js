import * as constants from './constants';

export const getClassesRequest = payload => ({
  type: constants.GET_CLASSES_REQUEST,
  payload,
});

export const setClasses = payload => ({
  type: constants.SET_CLASSES,
  payload,
});

export const getClassesError = () => ({
  type: constants.GET_CLASSES_ERROR,
});

export const setFetching = payload => ({
  type: constants.SET_FETCHING,
  payload,
});

export const setMoreClassesLoading = payload => ({
  type: constants.SET_MORE_CLASSES_LOADING,
  payload,
});
