import {combinedReducers} from './mainReducer';
import {createStore, applyMiddleware, compose} from 'redux';
import {persistReducer} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import {mainSaga} from './mainSaga';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  blacklist: ['Classes'],
  storage: AsyncStorage,
};

const sagaMiddleware = createSagaMiddleware();
const persistedReducer = persistReducer(persistConfig, combinedReducers);
/**
 * this app uses React Native Debugger, but it works without it
 */

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [sagaMiddleware /** more middlewares if any goes here */];

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

sagaMiddleware.run(mainSaga);

export {store};
