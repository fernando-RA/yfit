import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import * as actions from './../redux/actions';
import Text from '../../../components/Typography/index';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import LinkBoard from '../../../components/LinkBoard';
import ClientInfo from './components/ClientInfo';
import DimensionsStyle from '../../../utils/DimensionUtils';
import SocialLinks from '../components/SocialLinks';

const AttendeeScreen = props => {
  const dispatch = useDispatch();
  const classId = props.navigation.getParam('classId');
  const isPast = props.navigation.getParam('past');
  const classes = useSelector(RXState =>
    isPast ? RXState.Classes.pastClasses : RXState.Classes.upcomingClasses,
  );

  const signUpClients = useSelector(RXState => RXState.Classes.signUpClients);

  const selectedClass = classes.find(classData => classData.id === classId);
  const [isFetching, setIsFetching] = React.useState(true);

  React.useEffect(() => {
    if (selectedClass.classData.clients > 0) {
      dispatch(actions.signUpClientsRequest(classId));
    }
  }, [classId, dispatch, selectedClass.classData.clients]);

  React.useEffect(() => {
    if (signUpClients.length > 0) {
      setIsFetching(false);
    }
  }, [dispatch, signUpClients.length]);

  const renderClientInfo = ({item}) => {
    return <ClientInfo {...item} />;
  };

  const renderClientsList = React.useCallback(() => {
    return (
      <>
        {isFetching ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            contentContainerStyle={styles.root}
            data={signUpClients}
            renderItem={renderClientInfo}
            keyExtractor={item => item.id.toString()}
          />
        )}
      </>
    );
  }, [isFetching, signUpClients]);

  return (
    <ScrollView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      {selectedClass.classData.clients === 0 ? (
        <View style={styles.root}>
          <Text h1 bold style={{marginBottom: 6}}>
            You have no attendees yet.
          </Text>
          <Text bodyRegular>Get the word out to your followers.</Text>
          <LinkBoard text={`${selectedClass.classData.class_link}`} />
          <SocialLinks classData={selectedClass.classData} />
        </View>
      ) : (
        renderClientsList()
      )}
    </ScrollView>
  );
};

AttendeeScreen.navigationOptions = props => {
  return {
    headerTitle: () => (
      <Text h4 bold>
        Attendees
      </Text>
    ),
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Home')}
        style={{marginHorizontal: 16}}>
        <AntDesignIcon name="arrowleft" size={26} color="#000" />
      </TouchableOpacity>
    ),
  };
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 22,
    paddingBottom: DimensionsStyle.safeAreaBottomHeight,
  },
});

export default AttendeeScreen;
