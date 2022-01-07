import React from 'react';
import Text from '../../../components/Typography/index';
import moment from 'moment-timezone';

const TimeText = props => {
  if (!props.startDate) {
    return null;
  }
  const timeZone = moment.tz
    .zone(moment.tz.guess())
    .abbr(new Date().getTimezoneOffset());

  const dateTime = moment(props.startDate).format('ddd, MMM DD - hh:mma');

  return (
    <Text style={props.style} {...props}>
      {`${dateTime} ${timeZone}`},{` ${props.duration}min`}
    </Text>
  );
};

export default TimeText;
