import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Inputs from '../../../../components/Inputs';
import Text from '../../../../components/Typography';

import * as actions from '../../redux/actions';

const isSelectedTag = (type, selectedTags) => selectedTags.includes(type.name);

const Tags = props => {
  const dispatch = useDispatch();
  const state = useSelector(RXState => RXState.Classes);

  const onTagPress = type => () => {
    const isSelected = isSelectedTag(type, state.classData.tags);

    if (isSelected) {
      dispatch(actions.removeTag(type.name));
    } else {
      if (state.classData.tags.length >= 4) {
        return;
      }
      dispatch(actions.addTag(type.name));
    }
  };

  return (
    <View>
      <Text bodySmall bold>
        Add some tags (max. 4 tags)
      </Text>
      <View style={styles.tags}>
        {state.tags.map(tag => (
          <Inputs.Tag
            name={tag.name}
            onPress={onTagPress(tag)}
            selected={isSelectedTag(tag, state.classData.tags)}
            key={tag.id}
          />
        ))}
      </View>
    </View>
  );
};

export default Tags;

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    marginTop: 14,
  },
});
