import React from 'react';
import {mapping} from '@eva-design/eva';
import {
  ApplicationProvider,
  Layout,
  Text,
  IconRegistry,
} from 'react-native-ui-kitten';
import {Provider as ReduxProvider} from 'react-redux';
import {Alert, Linking, BackHandler, PermissionsAndroid} from 'react-native';
import {Platform, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';

import SplashScreen from './src/features/SplashScreen';
import {store} from './src/redux/store';
import NavigatorProvider from './src/navigator/mainNavigator';
import {setupHttpConfig} from './src/utils/http';
import {crowdboticsTheme} from './src/config/crowdboticsTheme';
import * as NavigationService from './src/navigator/NavigationService';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import VersionCheck from 'react-native-version-check';
import Geolocation from 'react-native-geolocation-service';
import * as Sentry from '@sentry/react-native';

import ErrorBoundary from './src/components/ErrorBoundary';

Sentry.init({
  dsn: 'https://f25995a2b1204b75b8dad9024868a819@o525489.ingest.sentry.io/5696591',
});

let persistor = persistStore(store);
export default class App extends React.Component {
  state = {
    isLoaded: false,
    userGeoposition: null,
  };

  async UNSAFE_componentWillMount() {
    /**
     * add any aditional app config here,
     * don't use blocking requests here like HTTP requests since they block UI feedback
     * create HTTP requests and other blocking requests using redux saga
     */
    await this.loadAssets();
    setupHttpConfig();
  }

  componentDidMount() {
    GoogleSignin.configure({});
    NavigationService.setNavigator(this.navigator);
    this.getUserGeolocation();
    this.checkVersion();
  }

  checkVersion = async () => {
    try {
      const needUpdate = await VersionCheck.needUpdate();
      if (needUpdate && needUpdate.isNeeded) {
        Alert.alert(
          'Please update application',
          'You will have to update your app to the latest version to continue using',
          [
            {
              text: 'Update',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(needUpdate.storeUrl);
              },
            },
            {text: 'Ask me later'},
          ],
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  getUserGeolocation = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        this.getGeoPosition();
      }
    }
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getGeoPosition();
      }
    }
  };

  getGeoPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          userGeoposition: position,
        });
      },
      (error) => {
        console.error(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  loadAssets = async () => {
    // add any loading assets here
    this.setState({isLoaded: true});
  };

  renderLoading = () => (
    <Layout style={[styles.flex]}>
      <Text>Loading</Text>
    </Layout>
  );

  renderApp = () => (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider mapping={mapping} theme={crowdboticsTheme}>
          <NavigatorProvider
            style={[styles.flex]}
            ref={(nav) => {
              NavigationService.setNavigator(nav);
            }}>
            <Layout style={[styles.flex]}>
              <SplashScreen />
            </Layout>
          </NavigatorProvider>
        </ApplicationProvider>
      </PersistGate>
    </ReduxProvider>
  );

  render = () => (
    <ErrorBoundary>
      {this.state.isLoaded ? this.renderApp() : this.renderLoading()}
    </ErrorBoundary>
  );
}

const styles = {
  flex: {
    flex: 1,
  },
};
