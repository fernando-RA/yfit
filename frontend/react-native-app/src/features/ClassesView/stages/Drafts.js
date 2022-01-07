import React from 'react';
import {StyleSheet, ScrollView, View, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import ClassCard from '../ClassCard';
import Text from '../../../components/Typography/index';
import {withNavigation} from 'react-navigation';

const Drafts = props => {
  const state = useSelector(RXState => RXState.Classes);

  const renderClassCard = ({item}) => {
    return (
      <ClassCard
        {...item.classData}
        draft
        id={item.id}
        navigation={props.navigation}
      />
    );
  };

  if (state.draftClasses.length === 0) {
    return (
      <View style={styles.root}>
        <Text h2>No draft classes</Text>
      </View>
    );
  }
  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.root}>
        <FlatList
          data={state.draftClasses}
          renderItem={renderClassCard}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
};

export default withNavigation(Drafts);

const styles = StyleSheet.create({
  root: {
    marginTop: 14,
    marginHorizontal: 16,
  },
});
