import {createStackNavigator} from 'react-navigation-stack';

import Edit from './Edit';
import TrainerEditProfile from './TrainerEditProfile';
import TrainerPreviewProfile from './TrainerPreviewProfile';
import TransactionView from './ProfileView/TransactionView';
import UserPaymentsView from './ProfileView/UserPaymentsView';

const MainNavigator = createStackNavigator(
  {
    TrainerEditProfile: {
      screen: TrainerEditProfile,
      navigationOptions: {
        header: null, // Will hide header for HomePage
      },
    },
    ProfileEdit: {
      screen: Edit,
      navigationOptions: {
        header: null, // Will hide header for HomePage
      },
    },
    TrainerPreviewProfile: {
      screen: TrainerPreviewProfile,
      navigationOptions: {
        header: null, // Will hide header for HomePage
      },
    },
    PaymentDetails: {
      screen: TransactionView,
      navigationOptions: {
        header: null, // Will hide header for HomePage
      },
    },
    UserPaymentsView: {
      screen: UserPaymentsView,
      navigationOptions: {
        header: null, // Will hide header for HomePage
      },
    },
  },
  {
    initialRouteName: 'TrainerPreviewProfile',
    defaultNavigationOptions: {
      gesturesEnabled: false,
      gestureEnabled: false,
    },
  },
);

export default MainNavigator;
