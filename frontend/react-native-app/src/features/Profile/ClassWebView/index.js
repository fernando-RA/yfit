import React from 'react';
import WebView from 'react-native-webview';

const ClassWebView = React.forwardRef((props, ref) => {
  return (
    <WebView
      originWhitelist={['*']}
      contentMode="mobile"
      source={{uri: props.classLink}}
      ref={ref}
    />
  );
});

export default ClassWebView;
