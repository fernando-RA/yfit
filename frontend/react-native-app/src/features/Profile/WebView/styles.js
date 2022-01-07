import { StyleSheet, Dimensions } from 'react-native'

const screenSize = Dimensions.get('window');

import { scaleVertical, scale } from "../../../utils/scale";
import DimensionUtils from '../../../utils/DimensionUtils';
const windowWidth = Dimensions
  .get('window')
  .width;
const windowHeight = Dimensions
  .get('window')
  .height;


export const styles = StyleSheet.create({
  itemsContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    paddingTop: DimensionUtils.safeAreaTopHeight
  },
  image: {
    resizeMode: "cover",
    marginBottom: scale(10),
    position: 'absolute',
    top: 0
  },

  imageBg: {
    width: '100%',
    height: screenSize.width / 2.6
  },
  headerBg: {
    marginTop: 0,
    width: windowWidth * 1.3,
    height: (windowHeight * .5),
    justifyContent: 'center',
    position: 'absolute',
    height: 100 + DimensionUtils.safeAreaTopHeight,
    backgroundColor: "#E5E5E5",
  },
  header: {
    height: 63 + DimensionUtils.safeAreaTopHeight,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: "#E5E5E5",
    paddingHorizontal: scale(15),
    marginTop: scaleVertical(15),
    paddingBottom: scaleVertical(20)
  },
  heading: {
    color: "#000",
    fontSize: 16
  },

  contentContainer: {
    width: '100%',
    paddingBottom: scaleVertical(20),
    paddingHorizontal: scale(15),
    alignItems: 'center',
    marginVertical: scaleVertical(15)
  },

  marginSession: {
    marginTop: scaleVertical(30)
  },

  buttonContainer: {
    borderRadius: 23,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#EC5E53",
    height: 50,
    width: 276,
    marginTop: scaleVertical(8),
    marginBottom: scaleVertical(8)
  },
  buttonText: {
    fontSize: 15,
    color: "#fff"
  },

  input: {
    backgroundColor: 'white',
    //marginLeft: scale(10), marginRight: scale(10),
    marginTop: scaleVertical(5),
    marginBottom: scaleVertical(5),
    //borderRadius: 12,
    borderColor: '#E5E5E5',
    color: "#0A1F31"
  },
  label: {
    color: "#0A1F31",
    paddingStart: scale(10)
  },
  text: {
    color: "#0A1F31"
  },
  fieldContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: scaleVertical(8)
  },
});
