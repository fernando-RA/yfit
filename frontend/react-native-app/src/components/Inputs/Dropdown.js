import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import PropTypes from 'prop-types';

import Text from '../Typography/Text';
import {number} from 'yup';

const Dropdown = props => {
  const {defaultValue, items, onChange, small, label, zIndex} = props;
  const styles = stylesFunc(props);
  return (
    <View style={styles.root}>
      <Text bodySmall={small} bold>
        {label}
      </Text>
      <DropDownPicker
        items={items}
        defaultValue={defaultValue}
        containerStyle={styles.containerStyle}
        style={styles.dropDownStyle}
        itemStyle={styles.itemStyle}
        dropDownStyle={styles.dropDownStyle}
        onChangeItem={onChange}
        selectedLabelStyle={styles.selectedLabelStyle}
        arrowSize={20}
        arrowStyle={styles.arrowStyle}
        zIndex={zIndex}
      />
      {/* <Picker selectedValue={defaultValue} onValueChange={onChange}>
        {items &&
          items.map(item => (
            <Picker.Item label={item.label} value={item.value} />
          ))}
      </Picker> */}
    </View>
  );
};

Dropdown.propTypes = {
  current: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  half: PropTypes.bool,
  label: PropTypes.string.isRequired,
  small: PropTypes.bool,
  zIndex: PropTypes.number,
};

export default Dropdown;

const stylesFunc = props =>
  StyleSheet.create({
    root: {
      width: props.half ? '48%' : '100%',
      zIndex: props.zIndex,
      position: 'relative',
    },
    dropDownStyle: {backgroundColor: '#fafafa'},
    containerStyle: {
      height: 44,
      marginTop: 8,
    },
    itemStyle: {
      justifyContent: 'flex-start',
      fontSize: 16,
    },
    selectedLabelStyle: {
      color: '#000',
      fontSize: 16,
    },
    arrowStyle: {
      marginTop: -4,
      marginBottom: -8,
    },
  });
