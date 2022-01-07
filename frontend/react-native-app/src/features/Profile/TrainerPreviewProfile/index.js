import React from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconEntypo from 'react-native-vector-icons/Entypo';
import Swiper from 'react-native-swiper';
import {Web} from 'react-native-openanything';
import DimensionUtils from '../../../utils/DimensionUtils';
import {Text} from 'react-native-elements';
import ViewMoreText from 'react-native-view-more-text';
import {useSelector} from 'react-redux';
import {withNavigationFocus} from 'react-navigation';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinkBoard from '../../../components/LinkBoard';

import CircleButton from '../../../components/Buttons/CircleButton';
import {styles} from './styles';

// const renderPagination = (index, total, context) => {
//   return (
//     <View style={styles.paginationStyle}>
//       <Text style={{color: 'white'}}>
//         <Text style={styles.paginationText}>{index + 1}</Text> of {total}
//       </Text>
//     </View>
//   );
// };

const openInstagramLink = link => {
  Web(link).catch(err => {
    alert('Something went wrong, please try again later');
    console.error(err);
  });
};

const TrainerPreviewProfile = props => {
  const {navigation} = props;
  const user = useSelector(state => state.Calendar?.user?.user);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  if (!user) {
    return null;
  }
  const {
    profile_picture,
    first_name,
    last_name,
    instagram_link,
    workout_types,
    bio,
    social_profile_url,
    photo,
  } = user;

  const renderViewMore = onPress => {
    return (
      <Text onPress={onPress} style={styles.highlightedText}>
        See more
      </Text>
    );
  };
  const renderViewLess = onPress => {
    return (
      <Text onPress={onPress} style={styles.highlightedText}>
        See less
      </Text>
    );
  };

  const onPressEdit = () => {
    navigation.replace('TrainerEditProfile');
  };

  const toggleModal = () => {
    console.log(user);
    setIsModalVisible(state => !state);
  };

  return (
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
          <LinkBoard text={`${user.trainer_link}`} />
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.container}>
        <CircleButton
          onPress={() => navigation.navigate('Home')}
          circleDiameter={32}
          top={DimensionUtils.safeAreaBottomHeight + 45}
          left={12}>
          <Icon
            name="chevron-left"
            size={18}
            color="#333333"
            style={{alignSelf: 'center'}}
          />
        </CircleButton>

        <CircleButton
          onPress={toggleModal}
          circleDiameter={32}
          top={DimensionUtils.safeAreaBottomHeight + 45}
          right={108}>
          <IconEntypo
            name="share-alternative"
            size={18}
            color="#333333"
            style={{alignSelf: 'center'}}
          />
        </CircleButton>
        <CircleButton
          onPress={onPressEdit}
          circleDiameter={32}
          ellipsis
          top={DimensionUtils.safeAreaBottomHeight + 45}
          right={24}>
          <Text style={styles.editButtonText}>Edit</Text>
        </CircleButton>

        <Swiper
          containerStyle={styles.wrapper}
          // renderPagination={renderPagination}
          loop={false}
          height={300}>
          <View style={styles.slide}>
            <ImageBackground
              style={styles.image}
              source={{
                uri: profile_picture ? profile_picture : social_profile_url,
              }}
            />
          </View>
        </Swiper>

        <View style={styles.userInfo}>
          <Text h3>
            {first_name} {last_name}
          </Text>
          {instagram_link && instagram_link.split('/').pop() != undefined ? (
            <Text
              onPress={() => openInstagramLink(instagram_link)}
              style={{paddingVertical: 10}}>
              <Icon name="instagram" size={16} />
              <Text style={styles.highlightedText}>
                {' '}
                @{instagram_link.split('/').pop()}
              </Text>
            </Text>
          ) : (
            <Text style={{paddingVertical: 10}} />
          )}
          <Text>
            {workout_types.length > 0 &&
              workout_types.map(type => type.workout_type).join(', ')}
          </Text>
          <Text h4 style={{paddingTop: 24}}>
            About
          </Text>
          <ViewMoreText
            numberOfLines={3}
            renderViewMore={renderViewMore}
            renderViewLess={renderViewLess}
            textStyle={{textAlign: 'justify'}}>
            <Text>{bio}</Text>
          </ViewMoreText>
        </View>
      </ScrollView>
    </>
  );
};

export default withNavigationFocus(TrainerPreviewProfile);
