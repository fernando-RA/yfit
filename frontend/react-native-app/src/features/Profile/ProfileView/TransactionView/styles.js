import {StyleSheet, Dimensions} from 'react-native';

const screenSize = Dimensions.get('window');

import DimensionUtils from '../../../../utils/DimensionUtils';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    width: screenSize.width,
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'stretch',
  },
  contentContainer: {
    marginTop: 30,
  },
  text: {
    color: '#000000',
    padding: 4,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  textBold: {
    color: '#333333',
    padding: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  underlineText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  alignContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
