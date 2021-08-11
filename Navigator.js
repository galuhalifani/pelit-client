import React, { useState, useEffect } from "react";
// import { StatusBar } from 'expo-status-bar';
import { Provider } from "react-redux";
import store from "./store";
import Login from "./screens/Login.jsx";
import Register from "./screens/Register.jsx";
import Home from "./screens/Home.jsx";
import AddExpense from "./screens/AddExpense.jsx";
import EditExpense from "./screens/EditExpense";
import Dashboard from "./screens/Dashboard.jsx";
import MyProfile from "./screens/MyProfile.jsx";
import Navigation from "./screens/Navigation.jsx";
import ExpenseReport from "./screens/ExpenseReport.jsx";
import { StyleSheet, Text, View, Button, Image, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AddRecord from "./screens/AddRecord";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Drawer from "react-native-drawer";
import { Icon, Overlay } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationActions } from "react-navigation";
import { StackActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, setAllTransactionUser, setTransactionByDate, setTransactionByCategoty } from "./store/actionsFaisal";
import { setUser } from "./store/actionsGaluh";
// import Reactotron, { asyncStorage } from 'reactotron-react-native'
import {LogBox } from 'react-native';
import LoadingScreen from "./screens/LoadingScreen";

const drawerStyles = {
  drawer: {
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 3,
    flex: 0.2,
  },
  main: { paddingLeft: 0 },
};

export default function Navigator() {
  LogBox.ignoreLogs(['Reanimated 2']);
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.isLogin);
  const errorLogin = useSelector((state) => state.errorLogin);
  const user = useSelector((state) => state.user);
  const allTransaction = useSelector((state) => state.allTransaction);
  const transByDate = useSelector((state) => state.transByDate);
  const transByCategory = useSelector((state) => state.transByCategory);
  const Stack = createStackNavigator();
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState("");

  function toggleDrawer(navigation) {
    navigation.navigate("Navigation");
  }

  async function logout(navigation) {
    await AsyncStorage.removeItem("@dataUser");
    const dataUserAsync = await AsyncStorage.getItem("@dataUser");
    // console.log(dataUserAsync, 'DATA USER ASYNC NIH')
    // Reactotron.log(dataUserAsync, 'ASYNC STORAGE NAVIGATOR LOGOUT')
    await dispatch(setIsLogin(false));
    // Reactotron.log(isLogin, 'ISLOGIN LOGOUT')
    await dispatch(setAllTransactionUser({}));
    // Reactotron.log(allTransaction, 'ALLTRANS LOGOUT')
    await dispatch(setTransactionByDate({}));
    // Reactotron.log(transByDate, 'TRANSBYDATE LOGOUT')
    await dispatch(setTransactionByCategoty({}));
    // Reactotron.log(transByCategory, 'TRANSBYCAT LOGOUT')
    await dispatch(setUser({}));
    // Reactotron.log(user, 'USER LOGOUT')
    navigation.navigate("Login");
  }

  async function getItem() {
    const dataUser = await AsyncStorage.getItem("@dataUser");
    if(dataUser) {
      // console.log('data User OK di Navigator, set login true')
      setIsLogin(true)
    }
    setDataUser(JSON.parse(dataUser));
    setLoading(false)
  }

  useEffect(() => {
    getItem();
  }, []);

  return (
    <>
    {
      loading
      ?
      null
      :
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={dataUser || isLogin ? "Home": "Login"}
          // initialRouteName="Loading"
          screenOptions={({ navigation }) => ({
            headerStyle: {
              backgroundColor: "white",
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "black",
            },
          })}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={({ navigation }) => ({
              title: "Home",
              headerLeft: () => (
                <View style={{ marginLeft: 5 }}>
                  <Icon
                    name="menu"
                    style={{ marginLeft: 15 }}
                    onPress={() => toggleDrawer(navigation)}
                  />
                </View>
              ),
              headerRight: () => (
                <Pressable onPress={() => logout(navigation)}>
                  <Text style={{ color: "black", marginRight: 10 }}>
                    Logout
                  </Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpense}
            options={{ title: "Add a Record" }}
            options={({ navigation }) => ({
              title: "Add a Record",
              headerLeft: () => (
                <View style={{ marginLeft: 5 }}>
                  <Icon
                    name="menu"
                    style={{ marginLeft: 15 }}
                    onPress={() => toggleDrawer(navigation)}
                  />
                </View>
              ),
              headerRight: () => (
                <Pressable onPress={() => logout(navigation)}>
                  <Text style={{ color: "black", marginRight: 10 }}>
                    Logout
                  </Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="EditExpense"
            component={EditExpense}
            options={{ title: "Edit Record" }}
            options={({ navigation }) => ({
              title: "Edit Record",
              headerLeft: () => (
                <View style={{ marginLeft: 5 }}>
                  <Icon
                    name="menu"
                    style={{ marginLeft: 15 }}
                    onPress={() => toggleDrawer(navigation)}
                  />
                </View>
              ),
              headerRight: () => (
                <Pressable onPress={() => logout(navigation)}>
                  <Text style={{ color: "black", marginRight: 10 }}>
                    Logout
                  </Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="MyProfile"
            component={MyProfile}
            options={{ title: "My Profile" }}
            options={({ navigation }) => ({
              title: "My Profile",
              headerLeft: () => (
                <View style={{ marginLeft: 5 }}>
                  <Icon
                    name="menu"
                    style={{ marginLeft: 15 }}
                    onPress={() => toggleDrawer(navigation)}
                  />
                </View>
              ),
              headerRight: () => (
                <Pressable onPress={() => logout(navigation)}>
                  <Text style={{ color: "black", marginRight: 10 }}>
                    Logout
                  </Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="Report"
            component={ExpenseReport}
            options={{ title: "Analytics" }}
            options={({ navigation }) => ({
              title: "Analytics",
              headerLeft: () => (
                <View style={{ marginLeft: 5 }}>
                  <Icon
                    name="menu"
                    style={{ marginLeft: 15 }}
                    onPress={() => toggleDrawer(navigation)}
                  />
                </View>
              ),
              headerRight: () => (
                <Pressable onPress={() => logout(navigation)}>
                  <Text style={{ color: "black", marginRight: 10 }}>
                    Logout
                  </Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="My Dashboard"
            component={Dashboard}
            options={{ title: "My Dashboard" }}
            options={({ navigation }) => ({
              headerLeft: () => (
                <View style={{ marginLeft: 5 }}>
                  <Icon
                    name="menu"
                    style={{ marginLeft: 15 }}
                    onPress={() => toggleDrawer(navigation)}
                  />
                </View>
              ),
              headerRight: () => (
                <Pressable onPress={() => logout(navigation)}>
                  <Text style={{ color: "black", marginRight: 10 }}>
                    Logout
                  </Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="AddRecord"
            component={AddRecord}
            options={{ title: "Add a Record" }}
            options={({ navigation }) => ({
              title: "Add a Record",
              headerLeft: () => (
                <View style={{ marginLeft: 5 }}>
                  <Icon
                    name="menu"
                    style={{ marginLeft: 15 }}
                    onPress={() => toggleDrawer(navigation)}
                  />
                </View>
              ),
              headerRight: () => (
                <Pressable onPress={() => logout(navigation)}>
                  <Text style={{ color: "black", marginRight: 10 }}>
                    Logout
                  </Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="Navigation"
            component={Navigation}
            options={({ navigation: { goBack } }) => ({
              headerLeft: () => (
                <View style={{ marginLeft: 5 }}>
                  <Icon
                    name="menu"
                    style={{ marginLeft: 15 }}
                    onPress={() => goBack()}
                  />
                </View>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
      }
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
