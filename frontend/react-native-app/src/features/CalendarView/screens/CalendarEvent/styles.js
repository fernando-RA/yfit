import {StyleSheet, Platform} from 'react-native';
import DimensionUtils from '../../../../utils/DimensionUtils';

import {scaleVertical, scale} from '../../../../utils/scale';

export const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  itemsContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingTop: DimensionUtils.safeAreaTopHeight,
  },
  header: {
    height: 63 + DimensionUtils.safeAreaTopHeight,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#E5E5E5',
    paddingHorizontal: scale(15),
    marginTop: scaleVertical(15),
    paddingBottom: Platform.OS === 'android' ? 0 : scaleVertical(20),
  },
  heading: {
    color: '#000',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    //marginLeft: scale(10), marginRight: scale(10),
    marginTop: scaleVertical(5),
    marginBottom: scaleVertical(5),
    //borderRadius: 12,
    borderColor: '#E5E5E5',
    color: '#0A1F31',
    width: '100%',
  },

  text: {
    color: '#0A1F31',
  },
  label: {
    color: '#0A1F31',
    paddingStart: scale(10),
    fontSize: 12,
  },
  fieldContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: scaleVertical(8),
  },
  contentContainer: {
    width: '100%',
    paddingBottom: scaleVertical(20),
    paddingHorizontal: scale(15),
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5FE487',
    height: 50,
    width: 276,
    marginTop: scaleVertical(20),
    marginBottom: scaleVertical(8),
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },
});
