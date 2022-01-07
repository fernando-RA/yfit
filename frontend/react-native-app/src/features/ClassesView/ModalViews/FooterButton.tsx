import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import DefaultButton from '../../../components/Buttons/DefaultButton';

interface Props {
  goForward: () => void;
  currentIndex: number;
}

const FooterButton: React.FC<Props> = ({goForward, currentIndex}) => {
  const classState = useSelector((RXState: any) => RXState.Classes.classData);

  const disabledLastStep: boolean = React.useMemo(() => {
    if (classState.free) {
      return false;
    }
    return (
      classState.price.error ||
      (!classState.is_attendee_limit
        ? false
        : classState.attend_limit_count.error) ||
      !classState.price.value ||
      (!classState.is_attendee_limit
        ? false
        : !classState.attend_limit_count.value)
    );
  }, [
    classState.free,
    classState.price.error,
    classState.price.value,
    classState.is_attendee_limit,
    classState.attend_limit_count.error,
    classState.attend_limit_count.value,
  ]);

  const calculateDisabled = (): boolean => {
    switch (currentIndex) {
      case 0:
        return (
          !classState.name ||
          !classState.start_time ||
          !classState.duration ||
          !classState.repeat
        );
      case 1:
        return (
          !classState.details ||
          !classState.equipment ||
          !classState.featured_photo
        );
      case 2:
        return !classState.type
          ? !classState.location || !classState.safety_protocol
          : !!classState.link.error || !classState.link.value;
      case 3:
        return disabledLastStep;
      default:
        return false;
    }
  };
  return (
    <View style={styles.button}>
      <DefaultButton
        text={currentIndex === 3 ? 'Finish' : 'Next'}
        onPress={goForward}
        disabled={calculateDisabled()}
      />
    </View>
  );
};

export default FooterButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
    bottom: 20,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
});
