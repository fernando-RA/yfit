import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';

import SplashScreen from '../features/SplashScreen';
import SideMenu from './sideMenu';
//@BlueprintImportInsertion
import CalendarViewNavigator from '../features/CalendarView/navigator';
import CalendarEvent from '../features/CalendarView/screens/CalendarEvent';
import ProfileNavigator from '../features/Profile/navigator';
import PaymentAccount from '../features/Profile/WebView/';
import SendPayment from '../features/Payment/screens/SendPayment/';
import Home from '../features/MainApp/navigator';
import Details from '../features/Details';

/**
 * new navigators can be imported here
 */

const AppNavigator = {
  //@BlueprintNavigationInsertion
  CalendarView: {
    screen: CalendarViewNavigator,
  },
  Profile: {
    screen: ProfileNavigator,
  },

  EventScreen: {
    screen: CalendarEvent,
  },
  PaymentAccount: {
    screen: PaymentAccount,
  },

  /** new navigators can be added here */
  SplashScreen: {
    screen: SplashScreen,
  },
  MainApp: {
    screen: Home,
  },
  SendPayment: {
    screen: SendPayment,
  },
  Details: {
    screen: Details,
  },
};

const DrawerAppNavigator = createStackNavigator(
  {
    ...AppNavigator,
  },
  {
    // initialRouteName: 'Profile',
    initialRouteName: 'CalendarView',
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: false,
      gestureEnabled: false,
    },
  },
);

const AppContainer = createAppContainer(DrawerAppNavigator);

export default AppContainer;
