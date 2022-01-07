import React from 'react';
import PropTypes from 'prop-types';
import {Text, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

function normalize(number, factor = 0.25) {
  return moderateScale(number, factor);
}

const TextElement = props => {
  const {
    children,
    h1,
    h2,
    h3,
    h4,
    h1Style,
    h2Style,
    h3Style,
    h4Style,
    bodyLargeBold,
    bodyLarge,
    subtitle,
    bodyRegular,
    bodyMedium,
    bodySmall,
    style,
    bold,
    ...rest
  } = props;
  return (
    <Text
      style={StyleSheet.flatten([
        style,
        styles.text,
        bold && styles.bold,
        (h1 || h2 || h3 || subtitle || bodyLargeBold) && styles.bold,
        h1 && StyleSheet.flatten([{fontSize: normalize(36)}, h1Style]),
        h2 && StyleSheet.flatten([{fontSize: normalize(28)}, h2Style]),
        h3 && StyleSheet.flatten([{fontSize: normalize(16)}, h3Style]),
        h4 && StyleSheet.flatten([{fontSize: normalize(20)}, h4Style]),
        subtitle &&
          StyleSheet.flatten([
            {fontSize: normalize(20), textTransform: 'uppercase'},
            h4Style,
          ]),
        bodyRegular && StyleSheet.flatten([{fontSize: normalize(16)}, h4Style]),
        bodyMedium && StyleSheet.flatten([{fontSize: normalize(14)}, h4Style]),
        bodySmall && StyleSheet.flatten([{fontSize: normalize(12)}, h4Style]),
      ])}>
      {props.children}
    </Text>
  );
};

TextElement.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  h1: PropTypes.bool,
  h2: PropTypes.bool,
  h3: PropTypes.bool,
  h4: PropTypes.bool,
  bold: PropTypes.bool,
  h1Style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  h2Style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  h3Style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  h4Style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  bodyLargeBold: PropTypes.bool,
  bodyLarge: PropTypes.bool,
  bodyMedium: PropTypes.bool,
  bodySmall: PropTypes.bool,
  subtitle: PropTypes.bool,
  children: PropTypes.node,
};

TextElement.defaultProps = {
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  bold: false,
  bodyLargeBold: false,
  bodyLarge: false,
  bodyRegular: false,
  bodyMedium: false,
  bodySmall: false,
  subtitle: false,
  style: {},
  h1Style: {},
  h2Style: {},
  h3Style: {},
  h4Style: {},
  children: '',
};

export default TextElement;

const styles = {
  text: {
    fontSize: normalize(16),
  },
  bold: {
    fontWeight: 'bold',
  },
};
