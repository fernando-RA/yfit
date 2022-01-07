import React from 'react';
import {Text, View} from 'react-native';

import styles from './styles';

const HeaderTitle = ({header, loader, headerStyle}) => {
  return (
    <View style={[styles.root, headerStyle]}>
      <Text style={styles.headerText}>{header}</Text>
    </View>
  );
};

export default HeaderTitle;
