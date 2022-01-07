import React from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from '../../../components/Typography/index';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TimeText from './TimeText';
import {useDispatch} from 'react-redux';
import * as actions from '../redux/actions';
import TagLabel from './TagLabel';

const ClassCard = props => {
  const styles = StyleSheet.create({
    title: {
      marginBottom: 6,
    },
    text: {
      marginBottom: 4,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    footerContainer: {
      flexDirection: 'row',
      paddingVertical: 13,
      paddingHorizontal: 15,
    },
    bodyContainer: {
      borderBottomWidth: 1,
      borderBottomColor: '#BDBDBD',
    },
    body: {
      paddingTop: 16,
      paddingHorizontal: 15,
      paddingBottom: 11,
    },
    container: {
      borderWidth: 1,
      borderColor: '#BDBDBD',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 20,
    },
    imageContainer: {
      width: '100%',
      height: props.draft || props.past ? 140 : 240,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    noImage: {
      backgroundColor: '#E0E0E0',
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(196, 196, 196, 0.6)',
    },
    tagPosition: {
      position: 'absolute',
      top: 10,
      left: 15,
    },
  });
  const dispatch = useDispatch();

  const saveDraft = React.useCallback(() => {
    dispatch(actions.saveExistingDraftRequest(props.id));
  }, [dispatch, props.id]);

  const onSelect = React.useCallback(() => {
    if (props.past) {
      dispatch(actions.setPastClassForPreview(props.id));
      props.navigation.navigate('PreviewScreen', {past: true});
      return;
    }
    if (props.duplicateMode) {
      dispatch(actions.setClassForDuplicate(props.id));
      props.navigation.navigate('PreviewScreen', {
        duplicate: true,
      });
      props.setDuplicateMode(false);
      return;
    }
    if (!props.upcoming) {
      dispatch(actions.setDraftForEdit(props.id));
      props.navigation.navigate('Modal', {saveDraft});
      return;
    }

    dispatch(actions.setClassForPreview(props.id));
    props.navigation.navigate('PreviewScreen', {
      existingClass: props.id,
    });
  }, [dispatch, props, saveDraft]);

  const goToAttendees = React.useCallback(() => {
    props.navigation.navigate('AttendeeScreen', {
      classId: props.id,
      past: props.past,
    });
  }, [props.id, props.navigation, props.past]);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.6} onPress={onSelect}>
        <View>
          {props.draft && (
            <TagLabel
              label="DRAFT"
              backgroundColor="#E04444"
              style={styles.tagPosition}
            />
          )}
          {props.repeat !== 'never' && props.upcoming ? (
            <TagLabel
              label="RECURRING CLASS"
              backgroundColor="#5A76AB"
              style={styles.tagPosition}
            />
          ) : null}
          <View style={styles.imageContainer}>
            {props.featured_photo ? (
              <>
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  source={{
                    uri: !props.featured_photo.uri
                      ? props.featured_photo
                      : props.featured_photo.uri,
                  }}
                />
                {props.draft && (
                  <View style={[styles.imageOverlay, styles.image]} />
                )}
              </>
            ) : (
              <View style={[styles.noImage, styles.image]} />
            )}
          </View>
          <View style={props.draft ? {} : styles.bodyContainer}>
            <View style={styles.body}>
              <Text h4 bold style={styles.title}>
                {props.name ? props.name : 'Untitled'}
              </Text>
              <Text bodySmall style={styles.text}>
                {props.type === 1 ? 'Virtual' : ''}
                {props.location.location_name && props.type === 0
                  ? props.location.location_name
                  : props.typeOfClasses === 0 && 'No location'}
              </Text>
              <TimeText
                style={styles.text}
                duration={props.duration}
                startDate={props.start_time}
                bodySmall
              />
              {props.equipment ? (
                <Text bodySmall style={styles.text}>
                  {props.equipment.length > 45
                    ? props.equipment.slice(0, 45) + '...'
                    : props.equipment}
                </Text>
              ) : (
                <Text bodySmall style={styles.text}>
                  No description
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {!props.draft ? (
        <TouchableOpacity activeOpacity={0.6} onPress={goToAttendees}>
          <View style={styles.footerContainer}>
            <View style={styles.footerRow}>
              <FeatherIcon
                name="user"
                color="#828282"
                size={18}
                style={{marginRight: 8}}
              />
              <Text bodySmall>
                {!props.is_attendee_limit
                  ? `${props.clients} Spots booked`
                  : `${props.clients}/${
                      props.attend_limit_count.value
                    } Spots booked`}
              </Text>
            </View>
            <View style={styles.footerRow}>
              <FontAwesome
                name="dollar"
                color="#828282"
                size={18}
                style={{marginRight: 8}}
              />
              <Text bodySmall>
                {`$${parseFloat(props.earned / 100, 10).toFixed(2)} earned`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ClassCard;
