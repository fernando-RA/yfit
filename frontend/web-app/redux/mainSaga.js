import { all } from "redux-saga/effects";

import classSaga from "./details/sagas";
import trainerSaga from "./trainer/sagas";

export default function* mainSaga() {
    yield all([classSaga, trainerSaga]);
}
