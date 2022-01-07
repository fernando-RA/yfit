import {combineReducers} from 'redux';

/**
 * You can import more reducers here
 */

//@BlueprintReduxImportInsertion
import CalendarReducer from '../features/CalendarView/redux/reducers';
import ProfileReducer from '../features/Profile/redux/reducers';
import Details from '../features/Details/redux/reducers';
import commonDataReduce from './commonDataReduce';
import ClassesReducer from '../features/ClassesView/redux/reducer';
import ClientClassesReducer from '../features/Profile/ClassesSearch/redux/reducer';

export const combinedReducers = combineReducers({
  blank: (state, action) => {
    if (state == null) {
      state = [];
    }
    return state;
  },

  //@BlueprintReduxCombineInsertion
  Calendar: CalendarReducer,
  Profile: ProfileReducer,
  Details,
  CommonData: commonDataReduce,
  Classes: ClassesReducer,
  ClientClassesState: ClientClassesReducer,
});
