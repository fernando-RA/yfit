import React from "react";
import { View, StyleSheet, ActivityIndicator ,Dimensions } from "react-native";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Loader = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size='large' color='black' />
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        flex:1,
        zIndex: 10,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        alignItems: "center",
        position: 'absolute',
    }
})
