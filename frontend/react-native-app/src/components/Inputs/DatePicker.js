import React, {useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Platform} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import PropTypes from 'prop-types';

import Input from './Input';
import Dropdown from './Dropdown';

const durations = [
  {
    label: '30 mins',
    value: 30,
  },
  {
    label: '45 mins',
    value: 45,
  },
  {
    label: '60 mins',
    value: 60,
  },
  {
    label: '75 mins',
    value: 75,
  },
  {
    label: '90 mins',
    value: 90,
  },
];

const recurring = [
  {
    label: 'Never',
    value: 'never',
  },
  {
    label: 'Every day',
    value: 'daily',
  },
  {
    label: 'Every week',
    value: 'weekly',
  },
  {
    label: 'Every month',
    value: 'monthly',
  },
];

const DatePicker = props => {
  const {date, onChange, endDate, onDateOfEndChange} = props;
  const dateValue = useMemo(() => moment(date).format('ddd, MMM DD, YYYY'), [
    date,
  ]);
  const timeValue = useMemo(() => moment(date).format('hh:mm A'), [date]);
  const dateOfEndValue = useMemo(
    () => moment(endDate).format('ddd, MMM DD, YYYY'),
    [endDate],
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDateOfEndPickerVisible, setIsDateOfEndPickerVisible] = useState(
    false,
  );
  const [durationState, setDurationState] = useState(30);
  const [recurringState, setRecurringState] = useState('never');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const showDateOfEndPicker = () => {
    setIsDateOfEndPickerVisible(true);
  };

  const hideDateOfEndPicker = () => {
    setIsDateOfEndPickerVisible(false);
  };

  const handleDateOfEndConfirm = dateNew => {
    onDateOfEndChange(dateNew);
    hideDateOfEndPicker();
  };

  const handleDateConfirm = dateNew => {
    const year = moment(dateNew).year();
    const month = moment(dateNew).month();
    const day = moment(dateNew).date();
    const fullDate = date
      ? moment(date)
          .year(year)
          .month(month)
          .date(day)
      : dateNew;
    onChange(fullDate);
    hideDatePicker();
  };

  const onDurationChange = item => {
    setDurationState(item.value);
    props.onDurationChange(item.value);
  };

  const onRecurringChange = item => {
    setRecurringState(item.value);
    props.onRepeatChange(item.value);
  };

  const handleTimeConfirm = dateNew => {
    const hours = moment(dateNew).hours();
    const minutes = moment(dateNew).minutes();
    onChange(
      moment(date)
        .hour(hours)
        .minute(minutes),
    );
    hideTimePicker();
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatePicker}>
        <Input
          value={dateValue}
          label="Date and time"
          editable={false}
          pointerEvents="none"
          rightIcon={
            <MaterialCommunityIcons name="calendar-blank-outline" size={20} />
          }
        />
      </TouchableOpacity>
      <View
        style={{
          ...styles.row,
          ...(Platform.OS !== 'android' && {
            zIndex: 3000,
          }),
        }}>
        <TouchableOpacity onPress={showTimePicker} style={styles.half}>
          <Input
            pointerEvents="none"
            value={timeValue}
            label="Start time"
            small
            bold
            editable={false}
          />
        </TouchableOpacity>
        <Dropdown
          onChange={onDurationChange}
          items={durations}
          defaultValue={durationState}
          half
          label="Duration"
          small
        />
      </View>
      {/* <Dropdown
        onChange={onRecurringChange}
        items={recurring}
        defaultValue={recurringState}
        label="Repeat"
        small
      /> */}
      {recurringState !== 'never' ? (
        <TouchableOpacity onPress={showDateOfEndPicker} style={{marginTop: 20}}>
          <Input
            pointerEvents="none"
            value={dateOfEndValue}
            label="End repeat"
            small
            bold
            editable={false}
          />
        </TouchableOpacity>
      ) : null}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        minuteInterval={15}
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
      <DateTimePickerModal
        isVisible={isDateOfEndPickerVisible}
        mode="date"
        minimumDate={new Date(date)}
        onConfirm={handleDateOfEndConfirm}
        onCancel={hideDateOfEndPicker}
      />
    </View>
  );
};

DatePicker.propTypes = {
  date: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

DatePicker.defaultProps = {
  date: moment(),
};

export default DatePicker;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },
});
