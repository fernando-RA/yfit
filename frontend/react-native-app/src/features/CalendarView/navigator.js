import {createStackNavigator} from 'react-navigation-stack';

import CalendarLoginScreen from './screens/CalendarLogin';
import CalendarEvent from './screens/CalendarEvent';

export default createStackNavigator(
  {
    CalendarLogin: {
      screen: CalendarLoginScreen,
      navigationOptions: {
        header: null, // Will hide header for HomePage
      },
    },
    CalendarEvent: {
      screen: CalendarEvent,
      navigationOptions: {
        header: null, // Will hide header for HomePage
      },
    },
  },
  {initialRouteName: 'CalendarLogin'},
);
