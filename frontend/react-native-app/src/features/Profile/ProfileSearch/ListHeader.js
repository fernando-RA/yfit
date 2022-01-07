import React from 'react';
import {View} from 'react-native';

import Filters from './components/Filters';
import HeaderButtonGroup from './components/HeaderButtonGroup';

export default function ListHeader(props) {
  return (
    <View>
      <Filters
        workout_types={props.workout_types}
        changeFilters={props.changeFilters}
        clearFilters={props.clearFilters}
        filters={props.filters}
      />

      <HeaderButtonGroup
        toggleSearchType={props.toggleSearchType}
        selectedSearchType={props.selectedSearchType}
      />
    </View>
  );
}
