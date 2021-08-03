import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Button,
} from "react-native";
import { dateFormatter } from "../helpers/dateFormatter.js";
import { Tab, TabView, Text } from "react-native-elements";
import MyProfile from "./MyProfile";
import ExpenseReport from "./ExpenseReport";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetails,
  getAllBadges,
  getUserActiveTarget,
} from "../store/actionsGaluh";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Separator = () => <View style={styles.separator} />;

export default function Dashboard({ navigation, route }) {
  const dispatch = useDispatch();
  const select = useSelector;
  const today = dateFormatter(new Date());
  const [index, setIndex] = React.useState(0);
  const user = select((state) => state.user);
  const earnedBadges = select((state) => state.earnedBadges);
  const allBadges = select((state) => state.allBadges);
  const activeTarget = select((state) => state.activeTarget);
  const loadingProfile = select((state) => state.loadingProfile);
  const [dataUser, setDataUser] = useState("");

  async function getItem() {
    // AsyncStorage.setItem("@dataUser", '12');
    const dataUserAsync = await AsyncStorage.getItem("@dataUser");
    console.log(dataUser)
    setDataUser(JSON.parse(dataUserAsync));
  }

  useEffect(() => {
    getItem();
  }, []);

  // console.log(dataUser.access_token);

  useEffect(() => {
    if (dataUser.access_token) {
      dispatch(getUserDetails(+dataUser.data.id)); // 2
      dispatch(getAllBadges());
      dispatch(getUserActiveTarget(+dataUser.data.id));
    }
  }, [dataUser]);

  return (
    <>
      {loadingProfile ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <>
          <Tab value={index} onChange={setIndex}>
            <Tab.Item title="my profile" titleStyle={{ fontSize: 14 }} />
            <Tab.Item title="expense report" titleStyle={{ fontSize: 14 }} />
          </Tab>

          {index == 0 ? (
            <ScrollView contentContainerStyle={styles.pageViewContainer}>
              <MyProfile
                user={user}
                earnedBadges={earnedBadges}
                allBadges={allBadges}
                activeTarget={activeTarget}
              />
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={styles.pageViewContainer}>
              <ExpenseReport />
            </ScrollView>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04009A",
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginVertical: 7,
    borderBottomColor: "lightgrey",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pageScrollContainer: {
    flexGrow: 1,
  },
  pageViewContainer: {
    flexGrow: 1,
    backgroundColor: "#04009A",
  },
  pageTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "white",
    alignItems: "center",
  },
  pageTitleName: {
    color: "white",
    fontSize: 18,
    marginTop: 15,
    fontWeight: "bold",
  },
  pageTitleDate: {
    color: "white",
    fontSize: 18,
    marginTop: 15,
    fontWeight: "bold",
    marginRight: 10,
  },
  userProfilePicture: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "white",
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    color: "white",
  },
  userDetailTexts: {
    flex: 1,
    marginLeft: 15,
    // borderWidth: 1,
    // borderColor: 'white',
  },
  userName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  userBalance: {
    color: "white",
    fontSize: 16,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  userBadgeTitle: {
    color: "white",
    fontSize: 14,
    marginRight: 10,
  },
  badgeImage: {
    borderColor: "gold",
    borderWidth: 2,
    borderRadius: 10,
    width: 20,
    height: 20,
    resizeMode: "cover",
    marginRight: 5,
  },
  seeBadges: {
    backgroundColor: "green",
    borderRadius: 15,
    padding: 5,
    elevation: 2,
    shadowColor: "white",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
  },
  seeBadgesText: {
    fontSize: 9,
    color: "gold",
  },
});
