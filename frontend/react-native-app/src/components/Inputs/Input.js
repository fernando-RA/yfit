import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {Input} from 'react-native-elements';
import Text from '../Typography';

const InputsCustom = props => {
  const {
    value,
    limit,
    label,
    sublabel,
    placeholder,
    onChangeText,
    disabled = false,
    pointerEvents = 'auto',
    small = false,
    fontSize = 16,
    bold,
    rightIcon,
    errors,
    touched,
    leftIcon,
    ...rest
  } = props;
  const styles = stylesFunc(props);
  return (
    <View style={styles.wrapper} pointerEvents={pointerEvents}>
      <Input
        label={
          <>
            <Text
              style={styles.label}
              bodyLargeBold={!small}
              bodySmall={small}
              bold={bold}>
              {label}
            </Text>
            {sublabel && (
              <Text bodyMedium style={styles.sublabel}>
                {sublabel}
              </Text>
            )}
          </>
        }
        value={value}
        placeholder={placeholder}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        onChangeText={onChangeText}
        disabled={disabled}
        fontSize={fontSize}
        rightIcon={rightIcon}
        leftIcon={leftIcon}
        maxLength={limit}
        {...rest}
      />
      {errors && touched ? (
        <Text style={styles.errorMessage} bodySmall>
          {errors}
        </Text>
      ) : null}
    </View>
  );
};

export default InputsCustom;

const stylesFunc = props =>
  StyleSheet.create({
    inputContainerStyle: {
      borderRadius: 6,
      borderWidth: 1,
      paddingHorizontal: 12,
      borderColor: '#E0E0E0',
    },
    containerStyle: {
      paddingHorizontal: 0,
    },
    label: {
      paddingBottom: props.sublabel ? 0 : 8,
    },
    sublabel: {
      paddingBottom: 8,
    },
    wrapper: {
      width: props.half ? '48%' : '100%',
    },
    errorMessage: {
      position: 'absolute',
      bottom: 5,
      left: 3,
      color: '#FB1B1B',
    },
  });
