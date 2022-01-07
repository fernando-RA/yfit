import React from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';

const SocialLinks = props => {
  const {classData} = props;
  const onInstagramPress = async () => {
    const shareOptions = {
      method: Share.InstagramStories.SHARE_STICKER_IMAGE,
      backgroundBottomColor: '#fff',
      backgroundTopColor: '#000',
      stickerImage: classData.featured_photo,
      social: Share.Social.INSTAGRAM_STORIES,
    };
    try {
      const shareResponse = await Share.shareSingle(shareOptions);
      console.log(shareResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const onTwitterPress = async () => {
    const shareOptions = {
      title: classData.name,
      message: classData.details,
      url: `${classData.class_link}`,
      social: Share.Social.TWITTER,
    };
    try {
      const shareResponse = await Share.shareSingle(shareOptions);
      console.log(shareResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const onFacebookPress = async () => {
    const shareOptions = {
      method: Share.FacebookStories.SHARE_STICKER_IMAGE,
      stickerImage: classData.featured_photo,
      social: Share.Social.FACEBOOK_STORIES,
      appId: '219376304',
    };
    try {
      const shareResponse = await Share.shareSingle(shareOptions);
      console.log(shareResponse);
    } catch (error) {
      console.error(error);
    }
  };

  const onWhatsappPress = async () => {
    const shareOptions = {
      title: 'Share via',
      message: classData.details,
      url: `${classData.class_link}`,
      social: Share.Social.WHATSAPP,
    };
    try {
      const shareResponse = await Share.shareSingle(shareOptions);
      console.log(shareResponse);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.socialContainer}>
      {/* <TouchableOpacity
        activeOpacity={0.6}
        onPress={onInstagramPress}
        style={styles.socialLink}>
        <AntDesign name="instagram" size={26} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onFacebookPress}
        style={styles.socialLink}>
        <EntypoIcon name="facebook" size={26} color="#000" />
      </TouchableOpacity> */}

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onTwitterPress}
        style={styles.socialLink}>
        <AntDesign name="twitter" size={26} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onWhatsappPress}
        style={styles.socialLink}>
        <FontAwesome name="whatsapp" size={26} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  socialLink: {
    marginRight: 15,
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
});

export default SocialLinks;
