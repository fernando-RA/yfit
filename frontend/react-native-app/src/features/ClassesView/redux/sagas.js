import {
  all,
  takeLatest,
  put,
  call,
  select,
  take,
  race,
  delay,
  fork,
} from 'redux-saga/effects';
import Toast from 'react-native-simple-toast';

import {request} from '../../../utils/http';
import * as constants from './constants';
import * as actions from './actions';
import {
  createFormFromClassData,
  sortClasses,
  transformServerClassesData,
} from './../utils';
import {navigate} from '../../../navigator/NavigationService';

const getClasses = ({accessKey}) => {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  let res = request.get('api/v1/trainer-class');
  return res;
};

function* handleGetTrainerClasses() {
  yield put({type: 'START_WATCHER_TASK'});
}

const publishNewClass = ({newClass, accessKey}) => {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  request.defaults.headers.common['Content-Type'] = 'application/json';
  return request.post(
    '/api/v1/trainer-class/',
    createFormFromClassData(newClass),
  );
};

function* handlePublishNewClass(action) {
  try {
    const newClass = action.data;
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const res = yield call(publishNewClass, {newClass, accessKey});
    if (res.status === 201) {
      yield put(actions.classFetching(false));
      yield put(actions.successPublishing(true));
      yield put(
        actions.publishNewClassSuccess(transformServerClassesData(res.data)),
      );
    }
  } catch (error) {
    console.error(error);
    yield put(actions.classFetching(false));
    Toast.show('Class publish failed...', Toast.LONG);
  }
}

function editExistingClass({id, editClassData, accessKey, draft}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  let res = request.put(
    `api/v1/trainer-class/${id}/`,
    createFormFromClassData(editClassData, draft),
  );
  return res;
}

function* handleEditExistingClass(action) {
  try {
    const {classData: editClassData, id} = action.data;
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {data, status} = yield call(editExistingClass, {
      id,
      editClassData,
      accessKey,
    });
    if (status === 200) {
      yield put(actions.successPublishing(true));
      yield put(actions.classFetching(false));
      yield put(
        actions.saveExistingClass({id: data.id, class_link: data.class_link}),
      );
    } else {
      Toast.show('Updating class failed...', Toast.LONG);
      yield put(actions.classFetching(false));
    }
  } catch (error) {
    Toast.show('Updating class failed...', Toast.LONG);
    yield put(actions.classFetching(false));
    console.error(error);
  }
}

function saveDraftClassRequest({draftClass, accessKey}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  let res = request.post('api/v1/trainer-class/', {
    ...createFormFromClassData(draftClass, true),
    published_at: null,
  });
  return res;
}

function* handleSaveDraftClass(action) {
  try {
    const draftClass = action.data;
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {data, status} = yield call(saveDraftClassRequest, {
      draftClass,
      accessKey,
    });
    if (status === 201) {
      yield put(
        actions.setInDrafts({id: data.id, class_link: data.class_link}),
      );
    } else {
      Toast.show('Save class failed...', Toast.LONG);
    }
  } catch (error) {
    Toast.show('Save class failed...', Toast.LONG);
    console.error(error);
  }
}

function* handleSaveExistingDraft(action) {
  try {
    const id = action.data;
    const editClassData = yield select(state => state.Classes.classData);
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {data, status} = yield call(editExistingClass, {
      id,
      editClassData,
      accessKey,
      draft: true,
    });
    if (status === 200) {
      yield put(
        actions.saveExistingDraft({id: data.id, class_link: data.class_link}),
      );
    } else {
      Toast.show('Updating class failed...', Toast.LONG);
    }
  } catch (error) {
    Toast.show('Updating class failed...', Toast.LONG);
    console.error(error);
  }
}

const getSignUpClients = classId => {
  let res = request.get(`api/v1/client-class/${classId}/attendees/`);
  return res;
};

function* handleGetSignUpClients(action) {
  try {
    const classId = action.data;
    const {data, status} = yield call(getSignUpClients, classId);
    if (status === 200) {
      yield put(actions.getSignUpClientsSuccess(data.results));
    }
  } catch (error) {
    console.error(error);
  }
}

function cancelClassRequest({id, accessKey}) {
  return request.post(`api/v1/trainer-class/${id}/cancel_training/`, null, {
    headers: {
      Authorization: 'Token ' + accessKey,
    },
  });
}

function* cancelClass(action) {
  try {
    yield put(actions.cancelClassLoading(true));
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(cancelClassRequest, {
      accessKey,
      id: action.payload,
    });
    navigate('Home', {
      onModalOpen: undefined,
    });
    yield call(Toast.show, data, Toast.LONG);
    yield put({type: 'STOP_WATCHER_TASK'});
    yield put(actions.getClasses());
  } catch (error) {
    if (error?.response?.data?.detail) {
      yield call(Toast.show, error.response?.data.detail, Toast.LONG);
    } else {
      yield call(Toast.show, 'Class cancel is failed', Toast.LONG);
    }
    yield call(console.error, error);
  } finally {
    yield put(actions.cancelClassLoading(false));
  }
}

function* pollTask() {
  while (true) {
    try {
      const accessKey = yield select(state => state.Calendar.user.accessKey);
      const {status, data} = yield call(getClasses, {accessKey});
      if (status === 200) {
        const sortedClasses = sortClasses(data.results);
        yield put(actions.getTrainerClassSuccess(sortedClasses));
      }
      yield delay(30000);
    } catch (error) {
      console.error(error);
      yield put(actions.getTrainerClassFailed());
      yield put({type: 'STOP_WATCHER_TASK', error});
    }
  }
}

function* pollTaskWatcher() {
  while (true) {
    yield take('START_WATCHER_TASK');
    yield race([
      call(pollTask),
      take('STOP_WATCHER_TASK'),
      take('STOP_POLLING'),
    ]);
  }
}

export default all([
  takeLatest(constants.GET_TRAINER_CLASSES_REQUEST, handleGetTrainerClasses),
  takeLatest(constants.PUBLISH_NEW_CLASS_REQUEST, handlePublishNewClass),
  takeLatest(constants.EDIT_TRAINER_CLASSES_REQUEST, handleEditExistingClass),
  takeLatest(constants.SAVE_DRAFT_REQUEST, handleSaveDraftClass),
  takeLatest(constants.SAVE_EXISTING_DRAFT_REQUEST, handleSaveExistingDraft),
  takeLatest(constants.GET_SIGNUP_CLIENTS, handleGetSignUpClients),
  takeLatest(constants.CANCEL_CLASS_REQUEST, cancelClass),
  fork(pollTaskWatcher),
]);
