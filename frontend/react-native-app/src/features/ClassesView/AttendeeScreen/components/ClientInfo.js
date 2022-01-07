import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../../../../components/Typography/index';

const ClientInfo = props => {
  return (
    <View style={styles.container}>
      <Text bodyMedium bold>
        {`${props.first_name} ${props.last_name}`}
      </Text>
      <Text bodyMedium>{props.email_address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});

export default ClientInfo;
