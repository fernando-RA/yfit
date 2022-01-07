import React from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import Text from './../../../../components/Typography/index';
import TimeText from './../../../ClassesView/ClassCard/TimeText';
import {useDispatch} from 'react-redux';
import * as actions from '../redux/actions';
import {Avatar} from 'react-native-elements';

const ClassCard = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        props.webOnOpen(props.class_link);
      }}>
      <View style={styles.container}>
        {!props.isProfile && (
          <View style={styles.row}>
            <Avatar
              source={{uri: props.author.profile_picture}}
              size="small"
              rounded
            />
            <Text bodyRegular bold style={{color: '#333333', marginLeft: 12}}>
              {props.author.first_name} {props.author.last_name}
            </Text>
          </View>
        )}

        <View style={styles.imageContainer}>
          {props.featured_photo ? (
            <Image
              style={styles.image}
              resizeMode="cover"
              source={{
                uri: props.featured_photo,
              }}
            />
          ) : null}
        </View>
        {props.isProfile ? (
          <View style={styles.bodyContainer}>
            <View style={styles.body}>
              <Text h6 style={styles.title}>
                {props.name ? props.name : null}
              </Text>
              <Text bodyMedium style={styles.text}>
                {props.location.location_name && props.type === 'in_person'
                  ? props.location.location_name
                  : 'Virtual'}
              </Text>
              <TimeText
                style={styles.text}
                duration={props.duration}
                startDate={props.start_time}
                bodyMedium
              />
              {props.equipment ? (
                <Text bodyMedium style={styles.footerText}>
                  {props.tags.length === 0
                    ? 'There are no tags'
                    : props.tags.join(', ')}
                </Text>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={styles.bodyContainer}>
            <View style={styles.body}>
              <Text h4 style={styles.title}>
                {props.name ? props.name : null}
              </Text>
              <Text bodyMedium style={styles.text}>
                {props.location.location_name && props.type === 'in_person'
                  ? props.location.location_name
                  : 'Virtual'}
              </Text>
              <TimeText
                style={styles.text}
                duration={props.duration}
                startDate={props.start_time}
                bodyMedium
              />
              {props.equipment ? (
                <Text bodyMedium style={styles.grayText}>
                  {props.tags.length === 0
                    ? 'There are no tags'
                    : props.tags.join(', ')}
                </Text>
              ) : null}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 6,

    fontWeight: 'bold',
    fontSize: 24,
  },
  text: {
    marginBottom: 4,
    fontSize: 14,
  },
  grayText: {
    color: '#828282',
    marginTop: 3,
    fontSize: 25,
    marginBottom: 20,
  },
  footerText: {
    marginTop: 3,
    fontSize: 25,
    marginBottom: 20,
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
    marginTop: 20,
  },
  imageContainer: {
    width: '100%',
    height: 240,
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
  row: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    paddingVertical: 11,
  },
});

export default ClassCard;
