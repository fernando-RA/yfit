import React from 'react';
import {StyleSheet, TouchableOpacity, Clipboard} from 'react-native';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import Text from '../../../components/Typography/index';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinkBoard from '../../../components/LinkBoard';
import SocialLinks from '../components/SocialLinks';
import {withNavigation} from 'react-navigation';
import {useSelector} from 'react-redux';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment-timezone';

const ClassModal = props => {
  // this peace of code need to check past class like as it been created(reduce creation time flow)
  const classData = useSelector(RXState => RXState.Classes.classData);
  // const classData = useSelector(
  //   RXState => RXState.Classes.pastClasses[0].classData,
  // );

  const addToCalendar = async () => {
    const eventConfig = {
      title: `${classData.name} - ${classData.repeat}`,
      startDate: moment(classData.start_time).format(
        'YYYY-MM-DDTHH:mm:ss.sssZ',
      ),
      endDate: moment(classData.start_time)
        .add(classData.duration, 'minute')
        .format('YYYY-MM-DDTHH:mm:ss.sssZ'),
      notes: classData.details,
      location: classData.location.location_name,
      url: classData.class_link,
      // and other options
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when { action: 'CANCELED' } is returned, the dialog was dismissed
        console.warn(JSON.stringify(eventInfo));
      })
      .catch(error => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };

  return (
    <Modal
      isVisible={props.isModalVisible}
      backdropOpacity={0.5}
      swipeDirection={['down']}
      style={styles.modalContainer}
      onSwipeComplete={props.toggleModal}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.6}
          onPress={props.toggleModal}>
          <AntDesign name="close" size={24} color="#333333" />
        </TouchableOpacity>
        <Text h2 bold style={{marginBottom: 13}}>
          Your class is live
        </Text>
        <Text bodyRegular>Get the word out to your followers.</Text>
        <LinkBoard text={`${classData.class_link}`} />
        <SocialLinks classData={classData} />
        <TouchableOpacity
          activeOpacity={0.6}
          style={{marginTop: 15}}
          onPress={addToCalendar}>
          <Text bodyRegular style={styles.underlineText}>
            +Add to calendar
          </Text>
        </TouchableOpacity>
        <View style={{marginTop: 35}}>
          <Text bodyRegular bold style={{marginBottom: 15}}>
            What happens now?
          </Text>
          <Text bodyRegular style={styles.paragraph}>
            Leave the rest to us!
          </Text>
          <Text bodyRegular style={styles.paragraph}>
            We’ll notify you when an attendee signs up for your class (or
            cancels).
          </Text>
          <Text bodyRegular style={styles.paragraph}>
            Your attendees will receive an email confirmation as soon as they
            book, and a reminder 12 hours before class.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 10,
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  modal: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 20,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default withNavigation(ClassModal);
