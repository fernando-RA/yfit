import { HYDRATE } from "next-redux-wrapper";
import * as actionTypes from "./actionsTypes";

const initialState = {
    isFetching: false,
    trainerData: {},
    error: false,
    trainerClasses: { count: 0, limit: null, offset: null, results: [] },
};

const trainerReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case HYDRATE:
            return { ...state, ...payload.trainer };
        case actionTypes.SET_TRAINER_FETCHING:
            return { ...state, isFetching: payload };
        case actionTypes.GET_TRAINER_SUCCESS:
            return { ...state, trainerData: { ...payload } };
        case actionTypes.GET_TRAINER_ERROR:
            return { ...state, error: true };
        case actionTypes.SET_TRAINER_CLASSES:
            return { ...state, trainerClasses: payload };
        default:
            return state;
    }
};

export default trainerReducer;
