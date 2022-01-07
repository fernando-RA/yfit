import * as actionTypes from './constants';

const initialState = {
  room: null,
  rooms: [],
  isFetching: false,
  trainerData: {},
  error: false,
  trainerClasses: {count: 0, limit: null, offset: null, results: []},
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case actionTypes.ROOM_GET_CLEAR:
      return {...state, room: null};
    case actionTypes.ROOM_GET_SUCCESS:
      return {...state, room: payload.room};
    case 'CALENDAR/GOOGLE_LOGOUT/SUCCESS':
      return {
        room: null,
        rooms: [],
      };

    case actionTypes.CLEAR_STATE:
      return {
        ...state,
        trainerClasses: {
          count: 0,
          limit: null,
          offset: null,
          results: [],
        },
      };

    case actionTypes.SET_TRAINER_FETCHING:
      return {...state, isFetching: payload};
    case actionTypes.GET_TRAINER_SUCCESS:
      return {...state, trainerData: {...payload}};
    case actionTypes.GET_TRAINER_ERROR:
      return {...state, error: true};
    case actionTypes.SET_TRAINER_CLASSES:
      return {...state, trainerClasses: payload};
    default:
      return state;
  }
};
