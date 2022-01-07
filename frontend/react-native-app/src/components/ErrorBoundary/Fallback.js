import AsyncStorage from '@react-native-community/async-storage';
import React, {useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import RNRestart from 'react-native-restart';
import Button from '../Buttons/DefaultButton';

import styles from './styles';

const Fallback = props => {
  const {
    title = 'There’s been a glitch...',
    subtitle = 'Tap the button below. Then close and reopen your app.',
    buttonTitle = 'REFRESH',
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const reset = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('persist:root');
      RNRestart.Restart();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>We’re not sure what went wrong.</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.marginTop} />
        <Button text={buttonTitle} onPress={reset} loading={isLoading} />
      </View>
    </SafeAreaView>
  );
};

export default Fallback;
