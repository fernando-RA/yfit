import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import Modal from 'react-native-modal';
import {useDispatch} from 'react-redux';
import * as actions from '../redux/actions';

const CreateClassModal = (props) => {
  const dispatch = useDispatch();

  return (
    <Modal
      style={styles.modalContainer}
      backdropOpacity={0.5}
      isVisible={props.isModalVisible}
      swipeDirection={['down']}
      onSwipeComplete={props.toggleModal}
      onBackdropPress={props.toggleModal}>
      <View style={styles.modal}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.modalRow, styles.modalBottomBorder]}
          onPress={() => {
            props.toggleModal();
            setTimeout(() => {
              dispatch(actions.clearCurrentClass());
              props.navigation.navigate('Modal');
              props.setDuplicateMode(false);
            }, 0);
          }}>
          <Text style={styles.modalText}>Create new class</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.modalRow}
          onPress={() => {
            props.toggleModal();
            props.setDuplicateMode(true);
          }}>
          <Text style={styles.modalText}>Duplicate existing class</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 135,
    margin: 0,
  },
  modal: {
    width: '96%',
    backgroundColor: 'rgba(242, 242, 242, 0.8)',
  },
  modalText: {
    fontSize: 20,
    color: '#000',
  },
  modalRow: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  modalBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default CreateClassModal;
