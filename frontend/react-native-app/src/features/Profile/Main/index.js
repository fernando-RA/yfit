import React, {Component} from "react";
import {
    StyleSheet,
    Image,
    View,
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from "react-native";
import {Text, Button, List, Card, CardHeader} from "react-native-ui-kitten";

import {connect} from 'react-redux';
import {styles} from './styles'
import headerImage from "../assets/menu_top.png"
import personImage from "../assets/profile.png"
import nextImage from "../assets/next.png"
import {ScrollView, FlatList} from "react-native-gesture-handler";
import Swipeable from 'react-native-swipeable-row';

const windowWidth = Dimensions
    .get('window')
    .width;
const windowHeight = Dimensions
    .get('window')
    .height;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {}
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

    UNSAFE_componentWillMount() {}

    UNSAFE_componentWillReceiveProps(nextProps) {}

    header() {
        return (
            <View style={styles.header}>

                <View
                    style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={styles.heading}>{"Profile"}</Text>
                </View>

            </View>
        )
    }

    render() {
        return (
            <View style={styles.itemsContainer}>

                {this.renderImage()}
                <View
                    resizeMode={"contain"}
                    style={{
                    marginTop: 0,
                    width: windowWidth *1.3,
                    height: (windowHeight * .5),
                    justifyContent: 'center',
                    position: 'absolute',
                    height:100,
                    backgroundColor:"#0A1F31"
                }}></View>

                {this.header()}

                <View
                    style={{
                    flex: 1,
                    width: '100%'
                }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                        flex: 1,
                        paddingBottom: 15
                    }}>
                      <View style={{width:'100%'}}>
                          <TouchableOpacity onPress={()=>{this.props.navigation.navigate("ProfileEdit")}} activeOpacity={.9} style={{width:'100%',backgroundColor:"#FFFFFF",height:115,flexDirection:'row',borderBottomColor:'#EDEDED',borderBottomWidth:1,justifyContent:'flex-start',alignItems:'center',paddingHorizontal:30,paddingVertical:15}}>
                            <Image style={{width:84,height:84,marginEnd:15}} source={personImage}/>
                            <View style={{flex:1}}>
                              <Text style={{fontSize:21,color:"#3B424F",marginBottom:10}}>John Retrick</Text>
                              <Text  style={{fontSize:14,color:"#0A1F31"}}>Total Delivered: 192</Text>
                            </View>
                            <Image  source={nextImage}/>
                          </TouchableOpacity>
                          
                          <View style={{marginVertical:15}}></View>
                          {this.renderOption('Security')}
                          {this.renderOption('Language')}
                          <View style={{marginVertical:15}}></View>
                          {this.renderOption('Clear Cache')}
                          {this.renderOption('Terms & Privacy Policy')}
                          {this.renderOption('Contact Us','ContactUs')}
                          <View style={{marginVertical:15}}></View>
                          {this.renderLogout()}
                          <View style={{marginVertical:15}}></View>
                      </View>

                    </ScrollView>
                </View>

            </View>
        );
    }

    renderOption(label,screen){
      return(
        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("ContactUs")}} activeOpacity={.9} style={{width:'100%',backgroundColor:"#FFFFFF",height:68,flexDirection:'row',borderBottomColor:'#EDEDED',borderBottomWidth:1,justifyContent:'space-between',alignItems:'center',paddingHorizontal:30,paddingVertical:15}}>
           <Text style={{fontSize:18,color:"#3B424F"}}>{label}</Text>
          <Image  source={nextImage}/>
        </TouchableOpacity>
      )
    }

    renderLogout(){
      return(
        <TouchableOpacity activeOpacity={.9} style={{width:'100%',backgroundColor:"#FFFFFF",height:74,flexDirection:'row',borderBottomColor:'#EDEDED',borderBottomWidth:1,justifyContent:'center',alignItems:'center',paddingHorizontal:30,paddingVertical:15}}>
          <Text style={{fontSize:21,color:"#FD6F80",fontWeight:'bold'}}>Logout</Text>
        </TouchableOpacity>
      )
    }

}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
