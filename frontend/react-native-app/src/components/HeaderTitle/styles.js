import {StyleSheet} from 'react-native';
import DimensionUtils from '../../utils/DimensionUtils';

export default StyleSheet.create({
  root: {
    justifyContent: 'center',
    paddingTop: DimensionUtils.safeAreaTopHeight,
    height: 92,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
