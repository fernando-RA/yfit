import {StyleSheet} from 'react-native';
import DimensionUtils from '../../../../utils/DimensionUtils';

export const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: DimensionUtils.safeAreaTopHeight + 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 20,
  },
  backgroundSetup: {
    height: 90,
    position: 'absolute',
    backgroundColor: '#fff',
  },
  underlineText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 12,
  },
  backContainer: {
    paddingLeft: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  earningsText: {
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 999,
    textAlign: 'center',
  },
});
