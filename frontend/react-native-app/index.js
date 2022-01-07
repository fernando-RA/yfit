/**
 * @format
 * @flow strict-local
 */

import {AppRegistry} from 'react-native';
import 'url-search-params-polyfill';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
