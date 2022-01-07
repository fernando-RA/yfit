import React from 'react';
import {StyleSheet, View, ScrollView, FlatList} from 'react-native';
import {withNavigation} from 'react-navigation';
import {useSelector} from 'react-redux';
import Text from '../../../components/Typography/index';
import ClassCard from '../ClassCard';

const Past = props => {
  const state = useSelector(RXState => RXState.Classes);

  const renderClassCard = ({item}) => {
    return (
      <ClassCard
        {...item.classData}
        past
        id={item.id}
        navigation={props.navigation}
      />
    );
  };

  if (state.pastClasses.length === 0) {
    return (
      <View style={styles.root}>
        <Text h2>No past classes</Text>
      </View>
    );
  }
  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.root}>
        <FlatList
          data={state.pastClasses}
          renderItem={renderClassCard}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
};

export default withNavigation(Past);

const styles = StyleSheet.create({
  root: {
    marginTop: 14,
    marginHorizontal: 16,
  },
});
