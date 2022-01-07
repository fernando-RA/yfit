import {Dimensions, Platform} from 'react-native';
import {NativeModules} from 'react-native';

export function isIphoneX() {
  const iphoneXLength = 812;
  const iphoneXSMaxLength = 896;
  const IPHONE12_H = 844;
  const IPHONE11_H = 844;
  const IPHONE12_Max = 926;
  const IPHONE12_Mini = 780;
  const windowDimensions = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (windowDimensions.width === iphoneXLength ||
      windowDimensions.height === iphoneXLength ||
      windowDimensions.width === iphoneXSMaxLength ||
      windowDimensions.height === iphoneXSMaxLength ||
      windowDimensions.width === IPHONE12_H ||
      windowDimensions.height === IPHONE12_H ||
      windowDimensions.width === IPHONE12_Max ||
      windowDimensions.height === IPHONE12_Max ||
      windowDimensions.width === IPHONE12_Mini ||
      windowDimensions.height === IPHONE12_Mini)
  );
}

const DimensionsStyle = {
  safeAreaTopHeight: Platform.OS === 'ios' ? (isIphoneX() ? 44 : 20) : 0,
  safeAreaBottomHeight: Platform.OS === 'ios' && isIphoneX() ? 20 : 0,
  tabBarHeight: Platform.OS === 'ios' ? 17 : 20,
  bottomAreaHeight: Platform.OS === 'ios' && isIphoneX() ? 34 : 0,
};

export default DimensionsStyle;
