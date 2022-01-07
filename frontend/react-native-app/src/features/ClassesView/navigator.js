import {createStackNavigator} from 'react-navigation-stack';
import AttendeeScreen from './AttendeeScreen';
import ClassPreview from './ClassPreview';
import ShareScreen from './ShareScreen';

import CreatingModal from './ModalViews';

export default createStackNavigator(
  {
    Modal: {
      screen: CreatingModal,
    },
    PreviewScreen: {
      screen: ClassPreview,
    },
    AttendeeScreen: {
      screen: AttendeeScreen,
    },
    ShareScreen: {
      screen: ShareScreen,
    },
  },
  {mode: 'card', initialRouteName: 'Modal'},
);
