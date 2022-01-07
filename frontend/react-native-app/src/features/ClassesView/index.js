import React from 'react';
import {View, Dimensions, StatusBar} from 'react-native';
import HeaderTitle from '../../components/HeaderTitle';
import {ButtonGroup} from 'react-native-elements';
import {TabView} from 'react-native-tab-view';
import Text from '../../components/Typography';

import Drafts from './stages/Drafts';
import Upcoming from './stages/Upcoming';
import Past from './stages/Past';

import styles from './styles';
import ClassModal from './ClassModal';
import CreateClassModal from './CreateClassModal';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../components/Loader';
import Fallback from '../../components/ErrorBoundary/Fallback';
import * as actions from './redux/actions';
import DefaultButton from '../../components/Buttons/DefaultButton';
import ClassesSearch from '../Profile/ClassesSearch';

const initialLayout = {width: Dimensions.get('window').width};

function Classes(props) {
  const classesInit = useSelector(RXState => RXState.Classes.init);
  const userType = useSelector(RXState => RXState.Calendar.user.user.user_type);
  const dispatch = useDispatch();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'upcoming', title: 'Upcoming'},
    {key: 'past', title: 'Past'},
    {key: 'drafts', title: 'Drafts'},
  ]);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [
    isCreateClassModalVisible,
    setCreateClassModalVisible,
  ] = React.useState(false);
  const [duplicateMode, setDuplicateMode] = React.useState(false);

  React.useEffect(() => {
    if (!classesInit.init && userType === 'trainer') {
      dispatch(actions.getClasses());
    }
  }, [classesInit.init, dispatch, userType]);

  React.useEffect(() => {
    if (props.navigation.getParam('onModalOpen')) {
      setTimeout(() => toggleModal(), 200);
      props.navigation.setParams({
        onModalOpen: undefined,
      });
    }
  }, [props.navigation, toggleModal]);

  const toggleModal = React.useCallback(() => {
    setModalVisible(!isModalVisible);
  }, [isModalVisible]);

  const toggleCreateClassModal = React.useCallback(() => {
    setCreateClassModalVisible(!isCreateClassModalVisible);
  }, [isCreateClassModalVisible]);

  const updateIndex = selectedIndexUpdated => {
    setIndex(selectedIndexUpdated);
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'upcoming':
        return (
          <Upcoming
            duplicateMode={duplicateMode}
            setDuplicateMode={setDuplicateMode}
            toggleCreateClassModal={toggleCreateClassModal}
          />
        );
      case 'past':
        return <Past />;
      case 'drafts':
        return <Drafts />;
      default:
        return null;
    }
  };

  const renderTabBar = props => {
    return (
      <ButtonGroup
        onPress={updateIndex}
        disabled={duplicateMode}
        selectedIndex={index}
        buttons={routes.map(item => item.title)}
        containerStyle={{height: 40, borderRadius: 12}}
        textStyle={{fontWeight: 'bold'}}
        selectedButtonStyle={{backgroundColor: '#333333'}}
      />
    );
  };

  if (userType === 'client') {
    return (
      <View style={styles.root}>
        <HeaderTitle header="Classes" headerStyle={styles.header} />
        <View style={styles.root}>
          <ClassesSearch
            filtersByWorkoutType={[]}
            scrollStyle={{paddingTop: 20}}
          />
        </View>
      </View>
    );
  }

  if (classesInit.error) {
    return (
      <Fallback
        subtitle="You can hit the button below or try logging out and log back in."
        buttonTitle="REFRESH"
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <HeaderTitle header="Classes" />
      {classesInit.init ? (
        <>
          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={updateIndex}
            initialLayout={initialLayout}
          />
          <ClassModal
            toggleModal={toggleModal}
            isModalVisible={isModalVisible}
          />
          <CreateClassModal
            isModalVisible={isCreateClassModalVisible}
            toggleModal={toggleCreateClassModal}
            navigation={props.navigation}
            setDuplicateMode={setDuplicateMode}
          />
        </>
      ) : (
        <Loader />
      )}
    </View>
  );
}

export default Classes;
