import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../../../components/Typography/index';

const TagLabel = props => {
  const styles = StyleSheet.create({
    tag: {
      zIndex: 100,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 3,
      backgroundColor: props.backgroundColor || '#5FE487',
    },
    tagText: {
      color: '#fff',
    },
  });

  return (
    <View style={[styles.tag, props.style]}>
      <Text bodySmall bold style={styles.tagText}>
        {props.label}
      </Text>
    </View>
  );
};

export default TagLabel;
