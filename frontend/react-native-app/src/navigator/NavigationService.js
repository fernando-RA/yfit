import {NavigationActions, StackActions} from 'react-navigation';

const config = {};
export function setNavigator(nav) {
  if (nav) {
    config.navigator = nav;
  }
}

export function replace(routeName, params) {
  if (config.navigator && routeName) {
    let action = StackActions.replace({routeName, params});
    config.navigator.dispatch(action);
  }
}

/**
 * Above functions are helpers to navigate to a route without the
 * navigation prop from React Navigation, helpful in sagas or action dispatchers
 * Just include check EmailAuth saga as an example
 */
export function navigate(routeName, params) {
  if (config.navigator && routeName) {
    let action = NavigationActions.navigate({routeName, params});
    config.navigator.dispatch(action);
  }
}

export function push(routeName, params) {
  if (config.navigator && routeName) {
    console.log({routeName, params});
    let action = StackActions.push({routeName, params});
    config.navigator.dispatch(action);
  }
}

export function goBack() {
  if (config.navigator) {
    let action = NavigationActions.back({});
    config.navigator.dispatch(action);
  }
}

export function navigateAndResetStack(routeName, params) {
  if (config.navigator && routeName) {
    let action = NavigationActions.navigate({routeName, params});

    config.navigator.dispatch(
      StackActions.reset({
        index: 0,
        actions: [action],
      }),
    );
  }
}
