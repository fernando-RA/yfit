import { all, takeLatest, put, call, select } from "redux-saga/effects";

import { request } from "../../api/http";
import * as actionsTypes from "./actionsTypes";
import * as actions from "./actions";

const getClass = (classLink) => {
    let res = request.get(`api/v1/trainer-classes/${classLink}`);
    return res;
};

const getAllTrainersClasses = (classLink) => {
    let res = request.get(`/api/v1/trainer/hash/${classLink}/more/`);
    return res;
};

function* handleGetClass(action) {
    const classLink = action.data;
    try {
        yield put(actions.setClassFetching(true));
        const { status, data } = yield call(getClass, classLink);
        const { status: trainerStatus, data: trainerClasses } = yield call(
            getAllTrainersClasses,
            classLink,
        );
        // const classDetails = yield call(getClassDetails, data.id);

        // const trainerClasses = filterAllClassesByTrainerId(
        //   trainersClasses.results,
        //   data.author
        // );
        if (status === 200) {
            yield put(actions.getClassSuccess(data));
            yield put(actions.setClassFetching(false));
            yield put(actions.setClassLink(classLink));
            yield put(actions.setTrainerClasses(trainerClasses));
        } else {
            yield put(actions.getClassError());
            yield put(actions.setClassFetching(false));
        }
    } catch (error) {
        yield put(actions.getClassError());
        yield put(actions.setClassFetching(false));
        console.error(error);
    }
}

export default all([
    takeLatest(actionsTypes.GET_CLASS_REQUEST, handleGetClass),
]);
