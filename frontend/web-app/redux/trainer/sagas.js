import { all, takeLatest, put, call, select } from "redux-saga/effects";

import { request } from "../../api/http";
import * as actionsTypes from "./actionsTypes";
import * as actions from "./actions";

const getTrainer = (link) => {
    let res = request.get(`api/v1/trainer/${link}`);
    return res;
};

const getTrainerClasses = (id) => {
    let res = request.get("/api/v1/trainer-classes-upcoming-page/", {
        params: {
            trainer_id: id,
        },
    });
    return res;
};

function* handleGetTrainer(action) {
    try {
        yield put(actions.setTrainerFetching(true));
        const { status, data } = yield call(getTrainer, action.payload);

        if (status === 200) {
            const classesResponse = yield call(getTrainerClasses, data.id);
            if (classesResponse.status === 200) {
                yield put(actions.getTrainerSuccess(data));
                yield put(actions.setTrainerFetching(false));
                yield put(actions.setTrainerClasses(classesResponse.data));
            }

            // yield put(actions.setClassLink(classLink));
            // yield put(actions.setTrainerClasses(trainerClasses));
        } else {
            yield put(actions.getTrainerError());
            yield put(actions.setTrainerFetching(false));
        }
    } catch (error) {
        yield put(actions.getTrainerError());
        yield put(actions.setTrainerFetching(false));
        console.error(error);
    }
}

export default all([
    takeLatest(actionsTypes.GET_TRAINER_REQUEST, handleGetTrainer),
]);
