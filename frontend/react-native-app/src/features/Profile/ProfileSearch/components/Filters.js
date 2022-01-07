import React, {useState} from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ButtonFilter from './ButtonFilter';
import GeoLocationFilter from './GeoLocationFilter';
import {geoFilters} from './../constants';
const Filters = props => {
  const [activeGeoLocation, setActiveGeoLocation] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {props.workout_types.length > 0 &&
          props.workout_types.map(type => {
            const selectedType = props.filters.includes(type);
            return (
              <ButtonFilter
                isSelected={selectedType}
                onPress={props.changeFilters}
                type={type}
                key={type.id}
              />
            );
          })}
        <View />
      </View>

      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        {geoFilters.map(item => {
          return (
            <GeoLocationFilter
              onPress={setActiveGeoLocation}
              key={item.value}
              activeGeoLocation={activeGeoLocation}
              displayName={item.displayName}
              value={item.value}
            />
          );
        })}
      </ScrollView>
      {props.filters.length > 0 && (
        <View style={styles.clearFilters}>
          <TouchableOpacity onPress={props.clearFilters}>
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Filters;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    marginBottom: 25,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  button: {
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    marginTop: 16,
  },
  boxingIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  clearFilters: {
    marginTop: 20,
  },
  clearFiltersText: {
    color: '#5a76ab',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});
