import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisterUser } from "../store/actionsFaisal";
import * as ImagePicker from "expo-image-picker";

export default function Register({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [balance, setBalance] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const keyboardVerticalOffset = Platform.OS === "android" ? -25 : 0;
  const loading = useSelector((state) => state.loadingTransaction);

  async function imagePickerHandler() {
    // console.log('gottem')
    // (async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }
    //   })();

    const photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!photo.cancelled) {
      console.log("imagePicker photo", photo);
      setCapturedImage(photo);
    }
  }

  function handleRegisterButton() {
    let message = [];
    if (!fullName) message.push("full name");
    if (!email) message.push("email");
    if (!password) message.push("password");
    if (!email || !password || !fullName) {
      Alert.alert(`Please input your ${message.join(", ")}`);
    } else {
      const payload = new FormData();
      if (capturedImage) {
        payload.append("photoProfile", {
          uri: capturedImage.uri,
          name: "photoProfile",
          type: "image/jpeg",
        });
      }
      payload.append("fullName", fullName);
      payload.append("email", email);
      payload.append("balance", balance);
      payload.append("password", password);
      console.log(payload, 'FORM DATA REGISTER');
      dispatch(fetchRegisterUser(payload)).then((message) => {
        if (message === "Registered Successfully") {
          // console.log(fullName.split)
          Alert.alert("Success!", `${fullName.split(" ")[0]}, you can now login`);
          navigation.navigate("Login");
        } else {
          Alert.alert(message);
        }
        console.log(message, "ini data");
      })
      .catch((err) => {
        console.log(err, 'error register')
      })
    }
  }

  return (
    <>
    {loading ? (
        <View style={styles.containerLoading}>
          <Text style={{ color: "white", marginBottom: 10, fontSize: 16 }}>
            Adding You to the Books ...
          </Text>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <Image
          style={styles.logo}
          source={{
            uri: "https://ik.imagekit.io/77pzczg37zw/Pelit__7__Vcs5VVGWI.png?updatedAt=1627559688674",
          }}
        />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text}>Full Name*</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(e) => setFullName(e)}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text}>Email*</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(e) => setEmail(e)}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text}>Balance</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(e) => setBalance(e)}
          ></TextInput>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text}>Photo</Text>
          {!capturedImage ? (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={imagePickerHandler}
                style={{
                  width: 200,
                  marginBottom: 10,
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Select Photo Profile
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={imagePickerHandler}
                style={{
                  width: 200,
                  borderRadius: 10,
                  backgroundColor: "green",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text}>Password*</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            onChangeText={(e) => setPassword(e)}
          ></TextInput>
        </View>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={handleRegisterButton}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "midnightblue",
    alignItems: "center",
    paddingTop: 50,
  },
  logo: {
    width: 150,
    height: 150,
    marginLeft: 90,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    width: 100,
  },
  textInput: {
    fontSize: 15,
    width: 200,
    height: 30,
    marginTop: 15,
    backgroundColor: "#E8F0F2",
    color: "black",
    borderColor: "#053742",
    textAlign: "left",
    paddingLeft: 10,
    borderRadius: 10,
  },
  buttonRegister: {
    width: 300,
    height: 32,
    paddingVertical: 2,
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 40,
    backgroundColor: "#77ACF1",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  containerLoading: {
    flex: 1,
    backgroundColor: "midnightblue",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
});
