import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

import {geoLocationStyles} from './../styles';

const GeoLocationFilter = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress(props.value);
      }}
      style={{
        ...geoLocationStyles.container,
        ...(props.activeGeoLocation == props.value && geoLocationStyles.active),
      }}>
      <Text style={geoLocationStyles.text}>{props.displayName}</Text>
    </TouchableOpacity>
  );
};

export default GeoLocationFilter;
