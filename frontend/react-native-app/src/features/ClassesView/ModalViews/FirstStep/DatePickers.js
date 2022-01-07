import React from 'react';
import {View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Inputs from '../../../../components/Inputs';
import * as actions from '../../redux/actions';

const DatePickers = () => {
  const state = useSelector(stateRX => stateRX.Classes.classData);
  const dispatch = useDispatch();

  const onStartDateChange = dateNew => {
    dispatch(actions.setStartDate(dateNew));
  };
  const onDurationChange = duration => {
    dispatch(actions.setDuration(duration));
  };
  const onRepeatChange = repeat => {
    dispatch(actions.setRepeat(repeat));
  };
  const onDateOfEndChange = dateNew => {
    dispatch(actions.setEndOfRepeat(dateNew));
  };

  return (
    <View>
      <Inputs.DatePicker
        date={state.start_time || new Date()}
        endDate={state.end_repeat || new Date()}
        onChange={onStartDateChange}
        onDurationChange={onDurationChange}
        onRepeatChange={onRepeatChange}
        onDateOfEndChange={onDateOfEndChange}
      />
    </View>
  );
};

export default DatePickers;
