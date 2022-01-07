import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';

import {useDispatch} from 'react-redux';
import {setLocationAction} from './../../redux/actions';
import {withNavigation} from 'react-navigation';
import axios from 'axios';
import {GOOGLE_API} from 'react-native-dotenv';

const LocationSearch = props => {
  const [locationValue, setLocationValue] = React.useState('');
  const [fetching, setFetching] = React.useState(false);

  const dispatch = useDispatch();
  const goToLocationStep = props.navigation.getParam('goToLocationStep');

  const onLocationHandle = React.useCallback(
    (location, locationDetails) => {
      dispatch(
        setLocationAction({
          location_name: location,
          lat: locationDetails.geometry.location.lat,
          lng: locationDetails.geometry.location.lng,
        }),
      );
      setLocationValue('');
      if (goToLocationStep) {
        goToLocationStep();
      }
    },
    [dispatch, goToLocationStep],
  );

  useEffect(() => {
    async function fetchGeocode(location) {
      try {
        const geocodeData = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              address: locationValue,
              key: GOOGLE_API,
            },
          },
        );
        setFetching(false);
        setLocationValue(locationValue);
        onLocationHandle(locationValue, geocodeData.data.results[0]);
      } catch (error) {
        setFetching(false);
        console.error(error);
      }
    }
    if (locationValue) {
      setFetching(true);
      fetchGeocode(locationValue);
    }
  }, [locationValue, onLocationHandle]);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        renderRow={data => (
          <TouchableOpacity
            style={styles.rowLocation}
            activeOpacity={0.6}
            onPress={() => {
              setLocationValue(data.description);
            }}>
            <EvilIcon
              name="location"
              color={'rgba(0, 0, 0, 0.4)'}
              size={30}
              style={{left: -15}}
            />
            <Text style={styles.rowText}>{data.description}</Text>
          </TouchableOpacity>
        )}
        value={locationValue}
        placeholder="Search"
        minLength={1}
        fetchDetails={true}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          separator: styles.separator,
        }}
        textInputProps={{
          InputComp: Input,
          inputContainerStyle: {
            borderRadius: 6,
            borderWidth: 1,
            paddingHorizontal: 12,
            borderColor: '#E0E0E0',
          },
          containerStyle: {paddingHorizontal: 0},
          leftIcon: () =>
            fetching ? (
              <ActivityIndicator />
            ) : (
              <FontAwesomeIcon name="search" size={21} />
            ),
          fontSize: 18,
          value: {locationValue},
        }}
        query={{
          /* available options: https://developers.google.com/places/web-service/autocomplete */
          key: GOOGLE_API,
          language: 'en',
          types: 'geocode',
          components: 'country:us',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
    height: '100%',
  },
  textInputContainer: {
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginBottom: 35,
    backgroundColor: 'transparent',
  },
  separator: {
    height: 0,
    backgroundColor: 'transparent',
  },
  textInput: {
    alignSelf: 'center',
    justifyContent: 'center',
    top: -3,
    left: -8,
  },
  rowLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 30,
    padding: 0,
  },
  rowText: {
    fontSize: 16,
    color: '#333333',
    top: -3,
    left: -7,
  },
});

export default withNavigation(LocationSearch);
