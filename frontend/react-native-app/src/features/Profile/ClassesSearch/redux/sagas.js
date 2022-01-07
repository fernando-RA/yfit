import {
  all,
  takeLatest,
  put,
  call,
  select,
  take,
  delay,
  race,
  fork,
} from 'redux-saga/effects';
import Toast from 'react-native-simple-toast';

import {request} from '../../../../utils/http';
import * as constants from './constants';
import * as actions from './actions';

const getClasses = ({limit, offset, query}) => {
  let res = request.get('api/v1/trainer-classes-page', {
    params: {
      limit,
      offset,
      query,
    },
  });
  return res;
};

function* handleGetClasses(action) {
  yield put({type: 'ALL_CLASSES_STOP_POLLING_WATCHER_TASK'});
  if (action.payload.loadMore === true) {
    yield put(actions.setMoreClassesLoading(true));
  }
  yield delay(100);
  yield put({
    type: 'ALL_CLASSES_START_POLLING_WATCHER_TASK',
    payload: action.payload,
  });
}
function* pollTask(action) {
  while (true) {
    try {
      const {limit, offset, query} = action.payload;
      const {status, data} = yield call(getClasses, {limit, offset, query});
      if (status === 200) {
        yield put(actions.setFetching(false));
        yield put(actions.setClasses(data));
      }
      if (data.limit === null && data.offset === null) {
        yield put(actions.setMoreClassesLoading(false));
      }
    } catch (error) {
      console.error(error);
      yield put({type: 'STOP_WATCHER_TASK', error});
      yield put(actions.getClassesError());
    } finally {
      yield put(actions.setMoreClassesLoading(false));
      yield delay(30000);
    }
  }
}

function* pollTaskWatcher() {
  while (true) {
    const action = yield take('ALL_CLASSES_START_POLLING_WATCHER_TASK');
    yield race([
      call(pollTask, action),
      take('ALL_CLASSES_STOP_POLLING_WATCHER_TASK'),
      take('STOP_POLLING'),
    ]);
  }
}

export default all([
  takeLatest(constants.GET_CLASSES_REQUEST, handleGetClasses),
  fork(pollTaskWatcher),
]);
