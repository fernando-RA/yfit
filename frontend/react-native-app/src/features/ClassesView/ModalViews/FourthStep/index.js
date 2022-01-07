import React from 'react';
import {withNavigation} from 'react-navigation';
import {Dimensions} from 'react-native';

import {TabView} from 'react-native-tab-view';
import PriceScreen from './PriceScreen';
import PromoScreen from './PromoScreen';

import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../redux/actions';

const {width} = Dimensions.get('window');

const initialLayout = {width};

const FourthStep = props => {
  const dispatch = useDispatch();
  const state = useSelector(RXState => RXState.Classes.classData);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([{key: 'priceScreen'}, {key: 'promoScreen'}]);

  const onPromoConfirm = () => {
    if (!state.promo_code) {
      dispatch(actions.setPromoConfirm(true));
    }
    dispatch(actions.setPromoConfirm(true));
  };

  const updateIndex = selectedIndexUpdated => {
    setIndex(selectedIndexUpdated);
    if (selectedIndexUpdated === 1) {
      props.navigation.setParams({
        goToPriceStep: () => {
          setIndex(0);
          props.navigation.setParams({
            goToPriceStep: undefined,
          });
        },
        confirmPromo: onPromoConfirm,
      });
    }
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'priceScreen':
        return (
          <PriceScreen
            updateIndexOfScreen={updateIndex}
            updateIndexOfStage={props.updateIndex}
            currentIndex={props.currentIndex}
          />
        );
      case 'promoScreen':
        return <PromoScreen />;
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

export default withNavigation(FourthStep);
