import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

type Props = {
  onPress: () => void;
  text: string;
  disabled: boolean;
  loading?: boolean;
};

const DefaultButton = (props: Props) => {
  const {onPress, text, disabled = false, loading = false} = props;
  const styles = stylesFunc(props);
  return (
    <TouchableOpacity onPress={onPress} style={styles.root} disabled={disabled}>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default DefaultButton;

const stylesFunc = (props: Props) =>
  StyleSheet.create({
    root: {
      backgroundColor: props.disabled ? '#E0E0E0' : '#5FE487',
      borderRadius: 24,
      height: 48,
      justifyContent: 'center',
      padding: 16,
      position: 'relative',
      zIndex: 1,
      width: 300,
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
