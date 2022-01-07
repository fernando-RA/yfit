import React from 'react';
// import {StyleSheet} from 'react-native';
import {
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
interface Props {
  children: React.ReactChildren;
  footerButtonComponent: React.ReactNode;
}

const KeyboardAvoidContainer: React.FC<Props> = ({
  children,
  footerButtonComponent,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {children}
          </ScrollView>
          {footerButtonComponent}
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
    flex: 1,
  },
  scrollViewContainer: {flex: 0},
});
