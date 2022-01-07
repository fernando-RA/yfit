import {all, takeLatest, put, call, select} from 'redux-saga/effects';

import * as NavigationService from '../../../navigator/NavigationService';
import * as actions from './actions';
import * as constants from './constants';
import {request} from '../../../utils/http';

function getChats({accessKey, user1, user2}) {
  request.defaults.headers.common.Authorization = 'Token ' + accessKey;
  const res = request.get(
    `/api/v1/chat/get_room?user_1=${user1}&user_2=${user2}`,
  );
  return res;
}

function* handleChatRoom(action) {
  try {
    yield put({
      type: constants.ROOM_GET_CLEAR,
      room: data,
    });
    const {user2, user1, destination = 'ChatScreen'} = action.data;
    const accessKey = yield select(state => state.Calendar.user.accessKey);
    const {status, data} = yield call(getChats, {
      accessKey,
      user1: user1,
      user2: user2,
    });
    if (status === 200) {
      yield put({
        type: constants.ROOM_GET_SUCCESS,
        payload: {room: data},
      });
      NavigationService.navigate(destination);
    }
  } catch (error) {
    console.error(error);
  }
}

const getTrainerClasses = id => {
  let res = request.get('api/v1/trainer-classes-page', {
    params: {
      trainer_id: id,
    },
  });
  return res;
};

function* handleGetTrainer(action) {
  try {
    yield put(actions.setTrainerFetching(true));
    const classesResponse = yield call(getTrainerClasses, action.payload);

    if (classesResponse.status === 200) {
      yield put(actions.setTrainerFetching(false));
      yield put(actions.setTrainerClasses(classesResponse.data));
    }

    // yield put(actions.setClassLink(classLink));
    // yield put(actions.setTrainerClasses(trainerClasses));
  } catch (error) {
    yield put(actions.getTrainerError());
    yield put(actions.setTrainerFetching(false));
    console.error(error);
  }
}

export default all([
  takeLatest(constants.CHAT_ROOM_GET, handleChatRoom),
  takeLatest(constants.GET_TRAINER_REQUEST, handleGetTrainer),
]);
