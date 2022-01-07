import { HYDRATE } from "next-redux-wrapper";
import * as actionTypes from "./actionsTypes";

export const initialState = {
    isFetching: true,
    classLink: null,
    error: false,
    classData: {},
    trainerData: {
        trainerInfo: {},
        trainerClasses: [],
    },
};

const classReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case HYDRATE:
            return { ...state, ...payload.classData };
        case actionTypes.SET_CLASS_FETCHING:
            return { ...state, isFetching: payload };
        case actionTypes.GET_CLASS_SUCCESS:
            return { ...state, classData: { ...payload } };
        case actionTypes.GET_CLASS_ERROR:
            return { ...state, error: true };
        case actionTypes.SET_CLASS_LINK:
            return { ...state, classLink: payload };
        case actionTypes.SET_TRAINER_CLASSES:
            return {
                ...state,
                trainerData: {
                    trainerInfo: state.trainerData.trainerInfo,
                    trainerClasses: payload,
                },
            };
        default:
            return state;
    }
};

export default classReducer;
