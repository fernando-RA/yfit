import React from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import * as NavigationService from '../../../../navigator/NavigationService';
import {styles} from './styles';

export const PaymentHeader = ({headerTitle}) => {
  return (
    <View>
      <ImageBackground style={styles.backgroundSetup} resizeMode={'contain'} />
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => NavigationService.navigate('MainApp')}>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../../assets/icons/Vector.png')}
          />
        </TouchableOpacity>
        <Text style={styles.earningsText}>{headerTitle}</Text>
        <View style={styles.rightContainer} />
      </View>
    </View>
  );
};

export default PaymentHeader;
