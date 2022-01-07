import React, {Component} from "react";
import {
    StyleSheet,
    Image,
    View,
    TouchableOpacity,
    Dimensions,
    FlatList,
    TextInput
} from "react-native";
import {Text} from "react-native-ui-kitten";

import {connect} from 'react-redux';

import * as reduxActions from '../redux/actions';
import {styles} from './styles'

const windowWidth = Dimensions
    .get('window')
    .width;
const windowHeight = Dimensions
    .get('window')
    .height;

class App extends Component {

    state = {
        DATA: []
    }

    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        const {actions: {
                searchProfiles
            }} = this.props;
        searchProfiles({query: ""});
        this.setState({profiles: this.props.profiles})
    }

    renderImage = () => {
        const screenSize = Dimensions.get('window');
        const imageSize = {
            width: screenSize.width,
            height: screenSize.height
        };
        return (<Image
            style={[styles.image, imageSize]}
            source={require('../assets/auth_bg.png')}/>);
    };

    header() {
        return (
            <View style={styles.header}>

                <Text style={styles.heading}>Select Profile</Text>

            </View>
        )
    }

    render() {
        return (
            <View style={styles.itemsContainer}>

                {this.renderImage()}

                {this.header()}
                <View
                    style={{
                    height: 60,
                    flexDirection: 'row',
                    width: '100%',
                    paddingHorizontal: 35,
                    alignItems: 'center'
                }}>

                    <Image
                        style={{
                        width: 16,
                        height: 16,
                        marginEnd:8
                    }}
                        source={require("../assets/search.png")}/>

                    <TextInput
                        style={{
                        fontSize: 18
                    }}  
                    onChangeText={(val)=>{
                      const {actions: {
                              searchProfiles
                          }} = this.props;
                      searchProfiles({query: val});
                    }}
                        placeholder={"Search"}/>
                </View>
                <FlatList
                    style={{
                    flex: 1,
                    width: '100%'
                }}
                    data={this.props.profiles}
                    renderItem={this.renderItems}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    keyExtractor={item => item.id}/>

            </View>
        );
    }

    renderItems = ({item}) => {
        console.log(item)
        return (
            <View
                style={{
                flexDirection: 'row',
                paddingHorizontal: 35,
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                justifyContent: 'space-between',
                flex: 1,
                height: 80
            }}>
                <TouchableOpacity
                    onPress={() => {
                }}
                    style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Image
                        style={{
                        width: 45,
                        height: 45,
                        backgroundColor:"grey",
                        borderRadius:30
                    }}
                        source={{
                        uri: item.photo
                    }}/>
                    <View >
                        <Text
                            style={{
                            fontSize: 16,
                            color: "#0A1F31",
                            marginStart: 15
                        }}>{item.first_name + " " + item.last_name}</Text>
                        <Text
                            style={{
                            fontSize: 14,
                            color: "grey",
                            marginStart: 15
                        }}>Boxing Trainer</Text>
                        
                        <Text
                            style={{
                            fontSize: 16,
                            color: "green",
                            marginTop:5,
                            marginStart: 15
                        }}>Send a message</Text>
                    </View>
                </TouchableOpacity>
                <Text
                    style={{
                    color: '#009AED',
                    fontSize: 18
                }}>{item.description}</Text>
            </View>
        )
    }

    FlatListItemSeparator = () => {
        return (<View
            style={{
            height: 1,
            width: "100%",
            backgroundColor: "#E6E6E6"
        }}/>);
    }

}

const mapStateToProps = state => ({profiles: state.Calendar.profiles});

const mapDispatchToProps = dispatch => ({
    actions: {
        searchProfiles: (data) => {
            dispatch(reduxActions.searchProfiles(data));
        }
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
