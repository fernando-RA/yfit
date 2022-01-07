import {all} from 'redux-saga/effects';

//@BlueprintReduxSagaImportInsertion
import CalendarViewSaga from '../features/CalendarView/redux/sagas';
import ProfileSaga from '../features/Profile/redux/sagas';
import DetailsSaga from '../features/Details/redux/sagas';
import ClassesSaga from '../features/ClassesView/redux/sagas';
import ClientClassesSaga from '../features/Profile/ClassesSearch/redux/sagas';

export function* mainSaga() {
  yield all([
    //@BlueprintReduxSagaMainInsertion
    CalendarViewSaga,
    ProfileSaga,
    DetailsSaga,
    ClassesSaga,
    ClientClassesSaga,
  ]);
}
