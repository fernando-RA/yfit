import * as actionTypes from "./actionsTypes";

export const setClassFetching = (payload) => ({
    type: actionTypes.SET_CLASS_FETCHING,
    payload,
});

export const getClassRequest = (payload) => ({
    type: actionTypes.GET_CLASS_REQUEST,
    data: payload,
});

export const getClassSuccess = (payload) => ({
    type: actionTypes.GET_CLASS_SUCCESS,
    payload,
});

export const getClassError = () => ({
    type: actionTypes.GET_CLASS_ERROR,
});

export const setClassLink = (payload) => ({
    type: actionTypes.SET_CLASS_LINK,
    payload,
});

export const setTrainerClasses = (payload) => ({
    type: actionTypes.SET_TRAINER_CLASSES,
    payload,
});
