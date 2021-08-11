import React, { useState } from "react";
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
import SideMenu from "./components/SideMenu.jsx";
import ExpenseReport from "./screens/ExpenseReport.jsx";
import Navigator from "./Navigator.js";
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
import { setIsLogin, setAllTransactionUser } from "./store/actionsFaisal";
// import Reactotron, { asyncStorage } from 'reactotron-react-native'

const drawerStyles = {
  drawer: {
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 3,
    flex: 0.2,
  },
  main: { paddingLeft: 0 },
};

// if(__DEV__) {
//   import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
// }

export default function App() {
  const Stack = createStackNavigator();
  const [drawer, setDrawer] = useState(false);
  // closeControlPanel = () => {
  //   this._drawer.close()
  // };
  // openControlPanel = () => {
  //   this._drawer.open()
  // };

  function toggleDrawer() {
    setDrawer(!drawer);
  }

  async function logout(navigation) {
    // const dispatch = useDispatch();
    await AsyncStorage.removeItem("@dataUser");
    // dispatch(setIsLogin(false));
    // dispatch(setAllTransactionUser({}));
    navigation.navigate("Login");
  }

  // console.log(drawer);

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
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
