import {StyleSheet, Dimensions} from 'react-native'

const screenSize = Dimensions.get('window');

import {scaleVertical, scale} from "../../../utils/scale";
import DimensionUtils from '../../../utils/DimensionUtils';

export const styles = StyleSheet.create({
    itemsContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "#F7F7F7",
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
    header: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    },
    heading: {
        paddingTop: scaleVertical(15),
        color: "#fff",
        fontSize: 26
    },
    buttonContainer: {
      borderRadius: 23,
      alignItems: "center",
      justifyContent: 'center',
      backgroundColor: "#EC5E53",
      height: 50,
      flex:0.48,
      borderWidth:2,
      borderColor: "#EC5E53",
      marginTop: scaleVertical(20),
      marginBottom: scaleVertical(30)
  },
  buttonText: {
      fontSize: 15,
      color: "#fff"
  },

});
