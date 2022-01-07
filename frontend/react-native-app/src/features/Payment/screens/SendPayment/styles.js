import {StyleSheet, Dimensions, Platform} from 'react-native';

const screenSize = Dimensions.get('window');

import {scaleVertical, scale} from '../../../../utils/scale';
import DimensionUtils from '../../../../utils/DimensionUtils';

export const styles = StyleSheet.create({
  itemsContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingTop: DimensionUtils.safeAreaTopHeight,
  },
  image: {
    resizeMode: 'cover',
    marginBottom: scale(10),
    position: 'absolute',
    top: 0,
  },

  imageBg: {
    width: '100%',
    height: screenSize.width / 2.6,
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
    color: '#000000',
    fontSize: 16,
  },

  contentContainer: {
    width: '100%',
    paddingHorizontal: scale(15),
    alignItems: 'center',
  },

  marginSession: {
    marginTop: scaleVertical(30),
  },

  buttonContainer: {
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5FE487',
    height: 50,
    width: 276,
    marginTop: scaleVertical(8),
    marginBottom: scaleVertical(8),
  },

  buttonText: {
    fontSize: 15,
    color: '#fff',
  },

  input: {
    backgroundColor: 'white',
    //marginLeft: scale(10), marginRight: scale(10),
    marginTop: scaleVertical(5),
    marginBottom: scaleVertical(5),
    //borderRadius: 12,
    borderColor: '#E5E5E5',
    color: '#0A1F31',
  },
  label: {
    color: '#0A1F31',
    paddingStart: scale(10),
  },
  text: {
    color: '#0A1F31',
  },
  fieldContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: scaleVertical(8),
  },

  list: {
    marginVertical: scaleVertical(5),
  },
  cardFormContainer: {
    borderColor: '#DEDEDF',
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 0,
    paddingVertical: 20,
    paddingTop: 0,
  },
  cardForm: {
    borderColor: '#DEDEDF',
    backgroundColor: '#fff',
    width: '100%',
    padding: 35,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  addCardText: {
    fontSize: 14,
    color: '#6D7477',
    flex: 1,
    marginStart: 20,
  },
  cardRow: {
    flex: 0.48,
  },
  cardColumnFirst: {
    marginVertical: 15,
  },
  noCards: {
    marginTop: 12,
    alignSelf: 'center',
    color: '#303030',
  },
  visaIcon: {
    color: '#f2138a',
    fontSize: 25,
  },
  americanExpresssIcon: {
    color: '#1d47e0',
    fontSize: 25,
  },
  discoverIcon: {
    color: '#853046',
    fontSize: 25,
  },
  dinersIcon: {
    color: '#0767ae',
    fontSize: 25,
  },
  jcbIcon: {
    color: '#0767ae',
    fontSize: 25,
  },
  masterCardIcon: {
    color: '#231f20',
    fontSize: 25,
  },
  unionpayIcon: {
    height: screenSize.height * 0.04,
    width: screenSize.width * 0.08,
    resizeMode: 'contain',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: screenSize.height * 0.02,
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: screenSize.width,
  },
  cardItem: {
    marginLeft: screenSize.width * 0.05,
  },
  list: {
    marginTop: screenSize.height * 0.05,
    marginVertical: 25,
  },
  cardExpiry: {
    fontSize: 12,
    fontWeight: '400',
    color: 'gray',
  },
  itemLeft: {
    width: screenSize.width * 0.55,
    flexDirection: 'row',
  },
  payButton: {
    width: 50,
    backgroundColor: '#21c71e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pay: {
    color: '#fff',
    alignSelf: 'center',
  },
  delete: {
    color: 'red',
    alignSelf: 'center',
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});
