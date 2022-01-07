import React from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import ClassWebView from '..';
import WebHeader from './components/WebHeader';

const WebModalWindow = props => {
  const ref = React.useRef(null);

  const goForward = () => {
    ref.current.goForward();
  };

  const goBack = () => {
    ref.current.goBack();
  };

  return (
    <Modal isVisible={props.isVisible} style={styles.container}>
      <WebHeader
        onClose={props.onClose}
        goForward={goForward}
        goBack={goBack}
      />
      <ClassWebView classLink={props.classLink} ref={ref} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
  },
});

export default WebModalWindow;
