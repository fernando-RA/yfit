import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

interface Props {
  isLoading: boolean;
}

const ListFooter = (props: Props) => {
  if(!props.isLoading){
    return null;
  }
  return (
    <View style={styles.root}>
      <ActivityIndicator size="small" />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 5,
    paddingBottom: 5
  },
});

export default ListFooter
