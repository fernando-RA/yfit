import {StyleSheet, Dimensions} from 'react-native';

const screenSize = Dimensions.get('window');
import DimensionUtils from '../../../utils/DimensionUtils';

import {scaleVertical, scale} from '../../../utils/scale';

export const styles = StyleSheet.create({
  itemsContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#EC5E53',
  },
  heading: {
    paddingTop: scaleVertical(15),
    color: '#fff',
    fontSize: 16,
    marginBottom: scaleVertical(15),
  },
  MapContainer: {
    width: '100%',
    overflow: 'hidden',
    height: 300,
    borderRadius: 15,
    borderWidth: 0,
    borderColor: 'transparent',
    marginTop: scaleVertical(15),
  },
  mapView: {
    width: '100%',
    overflow: 'hidden',
    height: 300,
    borderRadius: 15,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  locationtextContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    paddingBottom: scaleVertical(30),
  },
  locationtextHeader: {
    fontSize: 26,
    color: '#0A1F31',
    marginTop: scaleVertical(15),
  },
  locationtextDetails: {
    fontSize: 18,
    color: '#0A1F31',
    marginTop: scaleVertical(20),
  },
  sendMessage: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5FE487',
    marginTop: 5,
    marginStart: 15,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
  },
});

export const geoLocationStyles = StyleSheet.create({
  container:{
    padding:8,
    backgroundColor:"#BDBDBD",
    color:'#ffff',
    alignItems:'center',
    width:88,
    marginRight: 8,
    marginLeft: 8,
    borderRadius:80,
    justifyContent:'center',
    marginTop:20
  },
  text:{
    color:'white'
  },

  active:{
    backgroundColor:"#5FE487",
    color:'#000000'
  }
})
