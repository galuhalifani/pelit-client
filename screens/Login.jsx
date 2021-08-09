import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch
} from "react-native";
import { fetchLoginUser } from "../store/actionsFaisal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addPushToken } from "../store/actionsGaluh";
import { setErrorLogin } from "../store/actionsFaisal";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPasswordl] = useState("");
  const isLogin = useSelector((state) => state.isLogin);
  const loading = useSelector((state) => state.loadingTransaction);
  const errorLogin = useSelector((state) => state.errorLogin);
  const keyboardVerticalOffset = Platform.OS === "android" ? 100 : 0;
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [user, setUser] = useState(0);
  const [showPassword, setShowPassword] = useState(false)

  // console.log(email, password, 'EMAIL', 'PASSWORD')

  useEffect(() => {
    if (user.data) {
      //  console.log(user.data.id)
      sendPushNotification(expoPushToken);
      dispatch(addPushToken(expoPushToken, user.data.id));
    }
  }, [user]);

  // useEffect(() => {
  //   dispatch(fetchLoginUser(email, password));
  // }, [email, password, dispatch]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function getUserId() {
    let userSync = await AsyncStorage.getItem("@dataUser");
    setUser(JSON.parse(userSync));
  }

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: `Pelit App - Welcome Back ${user.data.firstName}!`,
      body: "Track, Record, and Manage Your Finance",
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  // console.log(isLogin, 'ISLOGIN')
  async function handleLoginButton() {
    if (!email && !password)
      Alert.alert("Please input your email and password");
    else if (!email) Alert.alert("Please input your email");
    else if (!password) Alert.alert("Please input your password");
    else {
      dispatch(fetchLoginUser(email, password));
    }
  }

  useEffect(() => {
    if (isLogin) {
      getUserId();
      navigation.navigate("Home");
    }
  }, [isLogin, errorLogin]);

  function handleRegisterButton() {
    navigation.navigate("Register");
  }

  function toggleSwitch() {
    setShowPassword(!showPassword)
    // this.setState({ showPassword: !this.state.showPassword });
  }

  return (
    <>
      {loading ? (
        <View style={styles.containerLoading}>
          <Text style={{ color: "white", marginBottom: 10, fontSize: 16 }}>
            Arranging Stuff ...
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

            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(e) => setEmail(e)}
            ></TextInput>
            <View style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={styles.text}>Password</Text>
              <View style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                <Text style={styles.textMini}>Hide/Show</Text>
                <Switch
                  trackColor={{ false: "grey", true: "green" }}
                  onValueChange={toggleSwitch}
                  value={showPassword}
                  style={{marginTop: 20}}
                /> 
              </View>
            </View>
            <TextInput
              secureTextEntry={!showPassword}
              style={styles.textInput}
              onChangeText={(e) => setPasswordl(e)}
            ></TextInput>
          </KeyboardAvoidingView>
          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={handleLoginButton}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonRegister}
            onPress={handleRegisterButton}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
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
  containerLoading: {
    flex: 1,
    backgroundColor: "#04009A",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  logo: {
    width: 130,
    height: 130,
    marginLeft: 90,
  },
  text: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginTop: 35,
    marginBottom: 20,
  },
  textMini: {
    fontSize: 9,
    color: "lightgrey",
    marginTop: 40,
    marginBottom: 20,
    marginRight: 5,
  },
  textInput: {
    fontSize: 15,
    width: 300,
    height: 40,
    backgroundColor: "#E8F0F2",
    color: "black",
    borderColor: "#053742",
    textAlign: "left",
    paddingLeft: 10,
    borderRadius: 10,
  },
  buttonLogin: {
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 40,
    marginBottom: 20,
    backgroundColor: "#77ACF1",
    width: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  buttonRegister: {
    borderRadius: 10,
    paddingVertical: 10,
    width: 300,
    backgroundColor: "#3C8DAD",
  },
});
