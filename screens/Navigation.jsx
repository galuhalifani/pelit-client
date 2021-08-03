import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Pressable,
  Button,
  ImageBackground
} from "react-native";
import { Camera } from "expo-camera";
import CameraPreview from "../components/CameraPreview";
import { useDispatch } from "react-redux";
import { postOcr } from "../store/actions";
import * as ImagePicker from "expo-image-picker";
let camera;

export default function Navigation({ navigation, route }) {

    function toHome() {
        navigation.navigate('Home')
    }

    function toProfile() {
        navigation.navigate('My Dashboard')
    }

    function toReport() {
        navigation.navigate('Report')
    }

  return (
    // <View style={styles.container}>
        <ImageBackground
         style={styles.container}
          //We are using online image to set background
          source={{
            uri: "https://wallpaperaccess.com/full/126397.jpg",
          }}
          //You can also set image from your project folder
          //require('./images/background_image.jpg')        //
        >
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: 'white'}}>Navigate to Page:</Text>
        <View style={{marginVertical:10, width: 200}}>
        <Button color={'black'} title='Home' onPress={toHome}/>
        </View>
        <View style={{marginVertical:10, width: 200}}>
        <Button color={'black'} title='My Profile' onPress={toProfile}/>
        </View>
        <View style={{marginVertical:10, width: 200}}>
        <Button color={'black'} title='Analytics Report' onPress={toReport}/>    
        </View>
        </ImageBackground>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
