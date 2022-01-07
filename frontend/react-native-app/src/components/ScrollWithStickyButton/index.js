import React from 'react';
import {ScrollView, View, Animated, Dimensions} from 'react-native';
import DefaultButton from '../Buttons/DefaultButton';

const ScrollWithStickyButton = props => {
  const positionAnim = React.useRef(new Animated.Value(0)).current;
  const containerHeight = React.useRef(null);
  const contentHeight = React.useRef(null);

  const position = positionAnim.interpolate({
    inputRange:
      containerHeight.current &&
      contentHeight.current &&
      contentHeight.current - containerHeight.current + 175 > 0
        ? [0, contentHeight.current - containerHeight.current + 175]
        : [0, 0],
    outputRange:
      contentHeight.current &&
      contentHeight.current &&
      contentHeight.current - containerHeight.current + 175 > 0
        ? [contentHeight.current - containerHeight.current + 175, 0]
        : [0, 0],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  return (
    <View style={{flex: 1}}>
      <Animated.ScrollView
        contentContainerStyle={props.contentContainerStyle}
        style={props.scrollStyle}
        scrollEventThrottle={16}
        onLayout={e => (containerHeight.current = e.nativeEvent.layout.height)}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: positionAnim}}}],
          {useNativeDriver: false},
        )}>
        <View
          onLayout={e => (contentHeight.current = e.nativeEvent.layout.height)}>
          {props.children}
        </View>
        <Animated.View
          style={[
            props.buttonContainerStyle,
            {
              position: 'relative',
              bottom: position ? position : 0,
            },
          ]}>
          <DefaultButton {...props.buttonProps} />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default ScrollWithStickyButton;
