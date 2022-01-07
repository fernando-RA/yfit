import * as constants from './constants';

const initialState = {
  workout_types: [],
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case constants.STORE_WORKOUT_TYPES:
      return {...state, workout_types: payload};

    default:
      return state;
  }
};
