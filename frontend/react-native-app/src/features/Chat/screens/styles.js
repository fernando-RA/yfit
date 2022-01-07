import {StyleSheet, Dimensions} from 'react-native'

const screenSize = Dimensions.get('window');
import DimensionUtils from '../../../utils/DimensionUtils';


import {scaleVertical, scale} from "../../../utils/scale";

export const styles = StyleSheet.create({
    itemsContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "#fff",
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
        height: 63 + DimensionUtils.safeAreaTopHeight,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        width: '100%',
        backgroundColor:"#EC5E53"
    },
    heading: {
        paddingTop: scaleVertical(15),
        color: "#fff",
        fontSize: 16,
        marginBottom:scaleVertical(15)
    },
    MapContainer: {
        width: '100%',
        overflow: 'hidden',
        height: 300,
        borderRadius: 15,
        borderWidth: .6,
        borderColor: 'transparent',
        marginTop: scaleVertical(15)
    },
    mapView: {
        width: '100%',
        overflow: 'hidden',
        height: 300,
        borderRadius: 15,
        borderWidth: .6,
        borderColor: 'transparent'
    },
    locationtextContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        paddingBottom:scaleVertical(30)
    },
    locationtextHeader: {
        fontSize: 26,
        color: "#0A1F31",
        marginTop: scaleVertical(15)
    },
    locationtextDetails: {
        fontSize: 18,
        color: "#0A1F31",
        marginTop: scaleVertical(20)
    }
});
