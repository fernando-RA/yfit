import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, TextInput} from 'react-native';

import {Button} from 'react-native-ui-kitten';
import Text from '../../../../components/Typography/index';
import Inputs from '../../../../components/Inputs/index';
import {withNavigation} from 'react-navigation';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../redux/actions';

const PROMO_TAGS = [10, 20, 25, 50, 100].map((value, i) => ({value, id: i}));

const PriceScreen = props => {
  const dispatch = useDispatch();
  const state = useSelector(RXState => RXState.Classes.classData);

  const [promoName, setPromoName] = useState('Promo');

  React.useEffect(() => {
    if (!state.promo_code.promo || !state.promo_code.discount) {
      dispatch(actions.setPromoConfirm(false));
    }
  }, [dispatch, state.promo_code.promo, state.promo_code.discount]);

  const changePromoValue = async value => {
    await setPromoName(value);
    dispatch(actions.setPromoValue([{...state.promo_code[0], promo: value}]));
  };

  const onTagSelect = percentage => {
    dispatch(
      actions.setPromoValue([
        {...state.promo_code[0], discount: percentage, promo: promoName},
      ]),
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text bold>Choose a promo</Text>
        <Text bodyMedium>
          Processing fees are calculated before promos are applied
        </Text>
      </View>
      <View style={styles.tags}>
        {PROMO_TAGS.map(tag => (
          <Inputs.Tag
            name={`${tag.value}% off`}
            onPress={() => onTagSelect(tag.value)}
            selected={Number(state.promo_code[0]?.discount) === tag.value}
            key={tag.id}
          />
        ))}
      </View>
      <Inputs.Input
        placeholder="Create a promo code (6 digit max.)"
        label="Promo name"
        value={
          state.promo_code[0]?.promo ? state.promo_code[0].promo : promoName
        }
        defaultValue="Promo"
        onChangeText={changePromoValue}
      />

      <TextInput keyboardType="numeric" />
    </ScrollView>
  );
};

export default withNavigation(PriceScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 15,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  button: {
    width: '30%',
    borderRadius: 20,
  },
});
