import React from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import WebModalWindow from './../ClassWebView/WebModalWindow/';
import Text from './../../../components/Typography/index';
import ClassCard from './components/ClassCard';
import ListFooter from './components/ListFooter';

import * as actions from './redux/actions';
import {filterByWorkoutType} from './utils';

const ClassesSearch = props => {
  const dispatch = useDispatch();
  const state = useSelector(RXState => RXState.ClientClassesState);
  const [webIsVisible, setWebIsVisible] = React.useState(false);
  const [classLink, setClassLink] = React.useState('');
  const [filteredClasses, setFilteredClasses] = React.useState(state.classes);

  const makeRequest = obj => {
    const objectToPush = {
      limit: state.limit,
      offset: 0,
      query: props.query,
      ...obj,
    };
    dispatch(actions.getClassesRequest(objectToPush));
  };

  React.useEffect(() => {
    dispatch(actions.setFetching(true));
    makeRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.query]);

  React.useEffect(() => {
    setFilteredClasses(state.classes);
  }, [state.classes]);

  React.useEffect(() => {
    if (props.filtersByWorkoutType.length === 0) {
      setFilteredClasses(state.classes);
      return;
    }
    const filteredByWorkoutType = filterByWorkoutType(
      props.filtersByWorkoutType,
      state.classes,
    );
    setFilteredClasses(filteredByWorkoutType);
  }, [props.filtersByWorkoutType, state.classes]);

  const webOnClose = () => {
    setWebIsVisible(false);
  };

  const webOnOpen = link => {
    setWebIsVisible(true);
    setClassLink(link);
  };

  const renderClassCard = ({item}) => {
    return <ClassCard {...item} id={item.id} webOnOpen={webOnOpen} />;
  };

  const loadMoreClasses = () => {
    if (state.loadMoreClassesLoading === true) {
      return null;
    }
    if (state.limit !== null && state.limit > 0) {
      const objectToPush = {
        limit: state.limit + 10,
        loadMore: true,
      };
      makeRequest(objectToPush);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {state.isFetching ? (
          <ActivityIndicator color="#5FE487" style={{marginTop: 20}} />
        ) : (
          <>
            <FlatList
              style={styles.root}
              ListHeaderComponent={props.ListHeaderComponent}
              data={filteredClasses}
              renderItem={renderClassCard}
              keyExtractor={item => item.id.toString()}
              onEndReachedThreshold={0.9}
              onEndReached={loadMoreClasses}
              ListFooter={
                <ListFooter isLoading={state.loadMoreClassesLoading} />
              }
            />
          </>
        )}
      </View>
      <WebModalWindow
        isVisible={webIsVisible}
        onClose={webOnClose}
        classLink={classLink}
      />
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    width: '100%',
  },
});

export default ClassesSearch;
