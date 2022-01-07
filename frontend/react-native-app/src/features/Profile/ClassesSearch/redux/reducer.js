import * as types from './constants';

const initialState = {
  isFetching: true,
  error: false,
  classes: [],
  filters: [],
  distanceFilter: '',
  count: 0,
  limit: 10,
  offset: 0,
  loadMoreClassesLoading: false,
};

const ClassesState = (state = initialState, {payload, type}) => {
  switch (type) {
    case types.SET_FETCHING:
      return {...state, isFetching: payload};
    case types.SET_CLASSES:
      return {
        ...state,
        classes: payload.results,
        count: payload.count,
        limit: payload.limit,
        offset: payload.offset,
      };
    case types.SET_MORE_CLASSES_LOADING:
      return {
        ...state,
        loadMoreClassesLoading: payload,
      };
    default:
      return state;
  }
};

export default ClassesState;
