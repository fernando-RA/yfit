import React, {useEffect} from 'react';
import {Bar} from 'react-native-progress';
import {StyleSheet, View, TouchableOpacity, Dimensions} from 'react-native';
import {TabView} from 'react-native-tab-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {withNavigation} from 'react-navigation';

import Text from '../../../components/Typography/index';

import SecondStep from './SecondStep';
import FirstStep from './FirstStep';
import ThirdStep from './ThirdStep/';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FourthStep from './FourthStep';
// import FifthStep from './FifthStep';
import DeviceInfo from 'react-native-device-info';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../redux/actions';

const {width} = Dimensions.get('window');

const initialLayout = {width};
const deviceId = DeviceInfo.getDeviceId();
const isIphone12 =
  deviceId === 'iPhone13,4' ||
  deviceId === 'iPhone13,3' ||
  deviceId === 'iPhone13,2';

const CreatingModal = props => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first'},
    {key: 'second'},
    {key: 'third'},
    {key: 'fourth'},
    // {key: 'fifth'},
  ]);

  const classState = useSelector(RXState => RXState.Classes.classData);
  const dispatch = useDispatch();
  const goToLocationStep = props.navigation.getParam('goToLocationStep');
  const goToPriceStep = props.navigation.getParam('goToPriceStep');
  const updateIndex = selectedIndexUpdated => {
    setIndex(selectedIndexUpdated);
  };

  useEffect(() => {
    props.navigation.setParams({
      currentStage: index,
      stepBack: () => setIndex(index - 1),
    });
    // I have to do that because it needs update stepBack function
    // only when index change, but in this case props.navigation also update and it calls infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    props.navigation.setParams({
      onSaveAndExit: () => {
        props.navigation.navigate('Home');
        dispatch(actions.saveDraftRequest(classState));
      },
    });
    // same that case above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classState]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <FirstStep updateIndex={updateIndex} currentIndex={index} />;
      case 'second':
        return <SecondStep updateIndex={updateIndex} currentIndex={index} />;
      case 'third':
        return <ThirdStep updateIndex={updateIndex} currentIndex={index} />;
      case 'fourth':
        return <FourthStep updateIndex={updateIndex} currentIndex={index} />;
      // case 'fifth':
      //   return <FifthStep />;
      default:
        return null;
    }
  };
  const styles = stylesFunc(props);
  return (
    <View style={styles.root}>
      {!goToPriceStep && !goToLocationStep && (
        <Bar
          animated
          color="#05FF00"
          progress={(index + 1) / routes.length}
          borderWidth={0}
          width={width}
          height={3}
          borderRadius={0}
        />
      )}
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={() => null}
        onIndexChange={updateIndex}
        initialLayout={initialLayout}
        swipeEnabled={false}
      />
    </View>
  );
};

CreatingModal.navigationOptions = props => {
  const {navigation} = props;
  const currentStage = props.navigation.getParam('currentStage');
  const stepBack = props.navigation.getParam('stepBack');
  const goToLocationStep = props.navigation.getParam('goToLocationStep');
  const goToPriceStep = props.navigation.getParam('goToPriceStep');
  const confirmPromo = props.navigation.getParam('confirmPromo');
  const onSaveAndExit = props.navigation.getParam('onSaveAndExit');
  const existingClass = props.navigation.getParam('existingClass');
  const saveDraft = props.navigation.getParam('saveDraft');
  const past = props.navigation.getParam('past');
  const duplicate = props.navigation.getParam('duplicate');
  const styles = stylesFunc(isIphone12);

  const headerLeftRender = () => {
    if (goToLocationStep) {
      return (
        <TouchableOpacity
          onPress={goToLocationStep}
          color="#000"
          style={styles.iphone12Arrows}>
          <AntDesignIcon name="arrowleft" size={26} color="#000" />
        </TouchableOpacity>
      );
    }
    if (goToPriceStep) {
      return (
        <TouchableOpacity
          onPress={goToPriceStep}
          color="#000"
          style={styles.iphone12Arrows}>
          <AntDesignIcon name="arrowleft" size={26} color="#000" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={stepBack}
        color="#000"
        style={styles.iphone12Arrows}>
        <AntDesignIcon name="arrowleft" size={26} color="#000" />
      </TouchableOpacity>
    );
  };

  const headerTitleRender = () => {
    if (goToLocationStep) {
      return (
        <Text bold h4>
          Add Location
        </Text>
      );
    }
    if (goToPriceStep) {
      return (
        <Text bold h4>
          Add promo code
        </Text>
      );
    }

    return null;
  };

  const heaederRightRender = () => {
    const styles = stylesFunc(isIphone12);

    if (goToPriceStep) {
      return (
        <TouchableOpacity
          style={styles.iphone12}
          onPress={() => {
            confirmPromo();
            goToPriceStep();
          }}>
          <Text bold bodyMedium style={styles.rightButton}>
            Apply
          </Text>
        </TouchableOpacity>
      );
    }
    if (goToLocationStep) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.iphone12}
        onPress={() => {
          if (duplicate) {
            props.navigation.navigate('PreviewScreen', {
              edited: true,
            });
            return;
          }
          if (past) {
            props.navigation.navigate('PreviewScreen', {
              edited: true,
              past: undefined,
            });
            return;
          }
          if (existingClass) {
            props.navigation.navigate('PreviewScreen', {
              existingClass,
              edited: true,
            });
            return;
          }
          if (saveDraft) {
            saveDraft();
            props.navigation.navigate('Home');
            return;
          }
          onSaveAndExit();
        }}>
        <Text bold bodyMedium style={styles.rightButton}>
          Save and Exit
        </Text>
      </TouchableOpacity>
    );
  };

  if (currentStage && currentStage !== 0) {
    return {
      headerLeft: headerLeftRender,
      headerRight: heaederRightRender,
      headerTitle: headerTitleRender,
    };
  }
  return {
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        color="#000"
        style={styles.iphone12Arrows}>
        <FontAwesome name="times" size={24} />
      </TouchableOpacity>
    ),
  };
};

export default withNavigation(CreatingModal);

const stylesFunc = StyleSheet.create(props => ({
  root: {
    flex: 1,
    // height: '100%',
  },
  rightButton: {
    textDecorationLine: 'underline',
    lineHeight: 14,
  },
  iphone12: {
    paddingHorizontal: 16,
    paddingTop: props ? 20 : 0,
    // height: DimensionsStyle.safeAreaTopHeight,
  },
  iphone12Arrows: {
    paddingHorizontal: 16,

    // height: DimensionsStyle.safeAreaTopHeight,
    paddingTop: props ? 13 : 0,
  },
}));
