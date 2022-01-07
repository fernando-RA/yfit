import React from 'react';
import {FlatList, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../redux/actions';

import DefaultButton from '../../../components/Buttons/DefaultButton';
import ClassCard from '../ClassCard';

const Upcoming = props => {
  const state = useSelector(RXState => RXState.Classes);
  const dispatch = useDispatch();

  const navigate = () => {
    dispatch(actions.clearCurrentClass());
    props.navigation.navigate('CreatingModal');
  };

  const renderClassCard = ({item}) => {
    return (
      <ClassCard
        {...item.classData}
        id={item.id}
        upcoming
        navigation={props.navigation}
        duplicateMode={props.duplicateMode}
        setDuplicateMode={props.setDuplicateMode}
      />
    );
  };

  if (state.upcomingClasses.length === 0) {
    return (
      <View style={[styles.root, {flex: 1}]}>
        <View style={styles.noClassesCard}>
          <Text style={styles.noClassesCardText}>
            You have no upcoming classes
          </Text>
          <Text style={styles.noClassesCardDescription}>
            Get started in a few quick steps
          </Text>
          <View style={styles.button}>
            <DefaultButton text="+ CREATE A CLASS" onPress={navigate} />
          </View>
        </View>
      </View>
    );
  }
  return (
    <FlatList
      contentContainerStyle={styles.root}
      data={state.upcomingClasses}
      renderItem={renderClassCard}
      keyExtractor={item => item.id.toString()}
      ListFooterComponent={() => (
        <>
          <View style={[styles.button, {paddingBottom: 40}]}>
            <DefaultButton
              text="+ CREATE A CLASS"
              onPress={props.toggleCreateClassModal}
            />
          </View>
        </>
      )}
    />
  );
};

export default withNavigation(Upcoming);

const styles = StyleSheet.create({
  root: {
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
  },
  noClassesCard: {
    backgroundColor: '#F2F2F2',
    height: 280,
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  noClassesCardText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  noClassesCardDescription: {
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    width: '100%',
  },
});
