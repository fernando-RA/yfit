import React, {useEffect} from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import WebModalWindow from '../Profile/ClassWebView/WebModalWindow';
import Modal from 'react-native-modal';
import IconEntypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import LinkBoard from '../../components/LinkBoard';
import {Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';
import {Web} from 'react-native-openanything';

import DimensionUtils from '../../utils/DimensionUtils';
import {Text} from 'react-native-elements';
import ViewMoreText from 'react-native-view-more-text';
import {useDispatch, useSelector} from 'react-redux';
// import Share from 'react-native-share';
import ClassCard from '../Profile/ClassesSearch/components/ClassCard';
import TimeText from '../ClassesView/ClassCard/TimeText';
import CircleButton from '../../components/Buttons/CircleButton';
import * as actions from './redux/actions';
import ActionButton from './ActionButton';
import {styles} from './styles';
import {GET_PROFILE_REQUEST} from '../Profile/redux/constants';
import Loader from '../../components/Loader';
import {Alert} from 'react-native';

const PAY = 'PAY';
const SCHEDULE = 'SCHEDULE';

// const shareOptions = Platform.select({
//   ios: {
//     activityItemSources: [
//       {
//         // For sharing url with custom title.
//         placeholderItem: {type: 'url', content: ""},
//         item: {
//           default: {type: 'url', content: url},
//         },
//         subject: {
//           default: title,
//         },
//         linkMetadata: {originalUrl: url, url, title},
//       },
//     ],
//   },
//   default: {
//     title,
//     subject: title,
//     message: `${message} ${url}`,
//   },
// });

const renderPagination = (index, total, context) => {
  return (
    <View style={styles.paginationStyle}>
      <Text style={{color: 'white'}}>
        <Text style={styles.paginationText}>{index + 1}</Text> of {total}
      </Text>
    </View>
  );
};

const openInstagramLink = () => {
  Web('https://www.instagram.com/meganbongfit/').catch(err => {
    alert('Something went wrong, please try again later');
    console.error(err);
  });
};

const Details = ({navigation}) => {
  const {goBack} = navigation;
  const data = navigation.getParam('data');
  const dispatch = useDispatch();
  const profile = useSelector(state => state.Calendar.profile);
  const classes = useSelector(state => state.Details.trainerClasses.results);
  const [webIsVisible, setWebIsVisible] = React.useState(false);
  const [classLink, setClassLink] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const webOnClose = () => {
    setWebIsVisible(false);
  };

  const onPressActions = actionType => () => {
    switch (actionType) {
      case PAY:
        dispatch(actions.geRoom({...data, destination: 'SendPayment'}));
        break;
      case SCHEDULE:
        dispatch(
          actions.geRoom({
            ...data,
            destination: 'EventScreen',
          }),
        );
        break;

      default:
        alert('Something went wrong, please try again later');
        break;
    }
  };

  const goback = async () => {
    await dispatch(actions.clearState());
    goBack();
  };

  const onSharePress = async () => {
    try {
      // const isOpen = await Share.open(shareOptions);
      // console.log(isOpen);
    } catch (error) {
      alert('Something went wrong, please try again later');
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(actions.getTrainerRequest(profile.id));
  }, [dispatch, profile.id]);

  useEffect(() => {
    dispatch({type: GET_PROFILE_REQUEST, data: {id: data.user2}});
  }, [data.user2, dispatch]);

  const renderViewMore = onPress => {
    return (
      <Text onPress={onPress} style={styles.highlightedText}>
        See more
      </Text>
    );
  };
  const webOnOpen = link => {
    setWebIsVisible(true);
    setClassLink(link);
  };
  const toggleModal = () => {
    setIsModalVisible(state => !state);
  };

  const renderClassCard = ({item}) => {
    return <ClassCard {...item} id={item.id} webOnOpen={webOnOpen} isProfile />;
  };

  const renderViewLess = onPress => {
    return (
      <Text onPress={onPress} style={styles.highlightedText}>
        See less
      </Text>
    );
  };
  if (!profile) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  }
  if (!profile.bio || !profile.first_name) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <>
        <Modal
          isVisible={isModalVisible}
          backdropOpacity={0.5}
          swipeDirection={['down']}
          style={styles.modalContainer}
          onSwipeComplete={toggleModal}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.6}
              onPress={toggleModal}>
              <AntDesign name="close" size={24} color="#333333" />
            </TouchableOpacity>
            <Text h2 bold style={styles.linkTitleText}>
              Sharing is caring
            </Text>
            <Text bodyRegular style={styles.linkBodyText}>
              Copy the link and post or send it.
            </Text>
            <LinkBoard text={`${profile.trainer_link}`} />
          </View>
        </Modal>
        <CircleButton
          onPress={goback}
          circleDiameter={32}
          top={DimensionUtils.safeAreaBottomHeight + 45}
          left={30}>
          <Icon
            name="chevron-left"
            size={18}
            color="#333333"
            style={{alignSelf: 'center'}}
          />
        </CircleButton>
        <Swiper containerStyle={styles.wrapper} loop={false} height={300}>
          <View style={styles.slide}>
            <ImageBackground
              style={styles.image}
              source={{
                uri: profile.profile_picture || profile.social_profile_url,
              }}
            />

            <CircleButton
              onPress={toggleModal}
              circleDiameter={32}
              top={DimensionUtils.safeAreaBottomHeight + 45}
              right={30}>
              <IconEntypo
                name="share-alternative"
                size={18}
                color="#333333"
                style={{alignSelf: 'center'}}
              />
            </CircleButton>
          </View>
        </Swiper>
        <View style={styles.userInfo}>
          <Text h3>
            {profile.first_name} {profile.last_name}
          </Text>
          {profile.instagramLink && (
            <Text onPress={openInstagramLink} style={{paddingVertical: 10}}>
              <Icon name="instagram" size={16} />
              <Text style={styles.highlightedText}>
                @{profile.instagram_link.split('/').pop()}
              </Text>
            </Text>
          )}
          <Text>
            {profile.workout_types.map(wt => wt.workout_type).join(', ')}
          </Text>

          <Text h4 style={{paddingTop: 24}}>
            About
          </Text>
          <ViewMoreText
            numberOfLines={3}
            renderViewMore={renderViewMore}
            renderViewLess={renderViewLess}
            textStyle={{textAlign: 'justify'}}>
            <Text>{profile.bio}</Text>
          </ViewMoreText>
        </View>

        <>
          <FlatList
            style={styles.root}
            data={classes}
            renderItem={renderClassCard}
            keyExtractor={item => item.id.toString()}
          />
        </>
        <WebModalWindow
          isVisible={webIsVisible}
          onClose={webOnClose}
          classLink={classLink}
        />

        <View style={styles.actionsSection}>
          {profile.user_type === 'trainer' && (
            <ActionButton
              onPress={onPressActions(PAY)}
              icon={() => <Icon name="dollar-sign" size={16} color="#fff" />}
              text="Pay"
            />
          )}

          <ActionButton
            onPress={onPressActions(SCHEDULE)}
            text="Schedule"
            icon={() => (
              <MaterialCommunityIcons name="calendar" size={16} color="#fff" />
            )}
          />
        </View>
      </>
    </View>
  );
};

export default Details;
