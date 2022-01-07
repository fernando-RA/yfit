import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';

import Text from '../../../components/Typography/Text';
import LinkBoard from '../../../components/LinkBoard';
import SocialLinks from '../components/SocialLinks';
import DeviceInfo from 'react-native-device-info';

const deviceId = DeviceInfo.getDeviceId();
const isIphone12 =
  deviceId === 'iPhone13,4' ||
  deviceId === 'iPhone13,3' ||
  deviceId === 'iPhone13,2';
const ShareScreen = () => {
  const classData = useSelector(RXState => RXState.Classes.classData);
  return (
    <View style={styles.container}>
      <Text h1>Get the word out to your followers</Text>
      <LinkBoard text={`${classData.class_link}`} />
      <SocialLinks classData={classData} />
    </View>
  );
};

ShareScreen.navigationOptions = props => {
  const headerLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={
          isIphone12
            ? {
                paddingTop: 10,
                paddingHorizontal: 16,
              }
            : {paddingHorizontal: 16}
        }>
        <AntDesignIcon name="arrowleft" size={26} color="#323232" />
      </TouchableOpacity>
    );
  };

  return {
    headerLeft,
    headerTitle: 'Share',
  };
};

export default ShareScreen;

const styles = StyleSheet.create({
  container: {
    padding: 22,
  },
});
