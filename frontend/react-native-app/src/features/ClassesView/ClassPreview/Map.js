import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const Map = props => {
  return (
    <MapView
      initialRegion={{
        latitude: props.location.lat,
        longitude: props.location.lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      zoo
      style={{height: 185, width: '100%'}}>
      <Marker
        coordinate={{
          latitude: props.location.lat,
          longitude: props.location.lng,
        }}>
        <EntypoIcon name="location-pin" color="#05FF00" size={50} />
      </Marker>
    </MapView>
  );
};

export default Map;
