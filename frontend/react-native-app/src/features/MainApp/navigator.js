import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import Home from './index';
import CreatingModalStack from '../ClassesView/navigator';

export default (CalendarNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: null,
      },
    },
    CreatingModal: {
      screen: CreatingModalStack,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'Home',
    mode: 'modal',
  },
));
