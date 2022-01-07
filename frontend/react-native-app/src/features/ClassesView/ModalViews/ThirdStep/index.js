import React from 'react';
import {withNavigation} from 'react-navigation';
import {Dimensions} from 'react-native';

import {TabView} from 'react-native-tab-view';
import LocationScreen from './LocationScreen';
import LocationSearch from './LocationSearch';

const {width} = Dimensions.get('window');

const initialLayout = {width};

const ThirdStep = props => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'locationScreen'},
    {key: 'locationSearch'},
  ]);

  const updateIndex = selectedIndexUpdated => {
    setIndex(selectedIndexUpdated);
    if (selectedIndexUpdated === 1) {
      props.navigation.setParams({
        goToLocationStep: () => {
          setIndex(0);
          props.navigation.setParams({
            goToLocationStep: undefined,
          });
        },
      });
    }
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'locationScreen':
        return (
          <LocationScreen
            updateIndexOfScreen={updateIndex}
            updateIndexOfStage={props.updateIndex}
            currentIndex={props.currentIndex}
          />
        );
      case 'locationSearch':
        return <LocationSearch updateIndex={updateIndex} />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={() => null}
      onIndexChange={updateIndex}
      initialLayout={initialLayout}
      swipeEnabled={false}
    />
  );
};

export default withNavigation(ThirdStep);
