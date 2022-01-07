import {StyleSheet, Dimensions} from 'react-native';

const screenSize = Dimensions.get('window');

import {scaleVertical, scale} from '../../../utils/scale';
import DimensionUtils from '../../../utils/DimensionUtils';

export const styles = StyleSheet.create({
  itemsContainer: {
    justifyContent: 'flex-start',
    width: screenSize.width,
    backgroundColor: 'white',
    flex: 1,
    paddingTop: DimensionUtils.safeAreaTopHeight,
  },
  image: {
    resizeMode: 'cover',
    marginBottom: scale(10),
    position: 'absolute',
    top: 0,
  },
  cardView: {
    backgroundColor: '#fff',
    width: screenSize.width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    marginTop: 25,
    flex: 1,
  },
  marginBottom: {
    marginBottom: 36,
  },
  imageBg: {
    width: '100%',
    height: screenSize.width / 2.6,
  },
  header: {
    height: 80 + DimensionUtils.safeAreaTopHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#0A1F31',
    paddingHorizontal: scale(15),
    marginTop: scaleVertical(15),
  },
  heading: {
    paddingTop: scaleVertical(15),
    color: '#fff',
    fontSize: 26,
  },

  contentContainer: {
    width: '100%',
    paddingHorizontal: scale(15),
    alignItems: 'center',
  },

  marginSession: {
    marginTop: scaleVertical(30),
  },

  cardViewBtn: {
    width: screenSize.width - 40,
    padding: 20,
    marginVertical: 20,
    backgroundColor: '#fff',
  },
  earningsTable: {
    width: screenSize.width - 40,
    padding: 20,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5FE487',
    height: 50,
    width: '100%',
    marginTop: scaleVertical(2),
    marginBottom: scaleVertical(2),
  },
  buttonText: {
    fontSize: 15,
    color: '#fff',
  },

  buttonTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: 'white',
    marginTop: scaleVertical(5),
    marginBottom: scaleVertical(5),
    borderColor: '#E5E5E5',
    color: '#0A1F31',
  },
  labelName: {
    color: '#0A1F31',
    fontSize: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  label: {
    color: '#000000',
    paddingStart: scale(10),
    fontSize: 16,
    marginVertical: scaleVertical(5),
  },
  text: {
    color: '#0A1F31',
  },
  fieldContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: scaleVertical(8),
  },
  stripeText: {
    color: '#0A1F31',
    fontSize: 9,
    flex: 1,
    paddingEnd: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  cardText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  earningsContainer: {
    position: 'absolute',
    left: 20,
    top: -15,
  },
  breakLine: {
    height: 1,
    backgroundColor: '#E4E4E4',
    width: '100%',
    marginTop: 8,
    marginBottom: 9,
  },
  underlineText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  paymentsLabel: {
    color: '#0A1F31',
  },
  scrollView: {
    width: '100%',
    alignItems: 'center',
  },
  profileBlock: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    overflow: 'hidden',
    borderColor: '#00000030',
    borderWidth: 0.5,
    backgroundColor: '#5A76AB',
  },
  viewProfileLink: {
    color: '#5A76AB',
    padding: 8,
    marginVertical: 8,
    fontWeight: '600',
  },
  paymentSection: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  paymentText: {
    color: '#000',
    fontSize: 18,
  },
  stripeImage: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  thisMonth: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  signOut: {
    color: '#000000',
    padding: 20,
    fontWeight: '600',
  },
});
