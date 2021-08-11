import React, { useState, useRef } from "react";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Modal
} from "react-native";
import DateCard from "../components/DateCard";
import { monthYearFormatter } from "../helpers/dateFormatter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import CategoryCard from "../components/CatogeryCard";
import NumberFormat from "react-number-format";
import { Banner } from "react-native-paper";
import { Icon } from "react-native-elements";
import { Avatar, Button, Card, Title, Paragraph, TextInput, Provider} from "react-native-paper";
import DropDown from "../helpers/react-native-paper-dropdown";
import {
  fetchLoginUser,
  fetchTransactionByCategory,
  fetchTransactionByDate,
  setIsLogin
} from "../store/actionsFaisal";
import { getUserDetails } from "../store/actionsGaluh";
import { Picker } from "@react-native-picker/picker";
import { FAB } from 'react-native-paper';
// import Reactotron, { asyncStorage } from 'reactotron-react-native'

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHelpVisible, setModalHelpVisible] = useState(false);
  const [visible, setVisible] = React.useState(true);
  const date = new Date();
  const [monthYear, setMonthYear] = useState(monthYearFormatter(date))
  const [dataUser, setDataUser] = useState("");
  const dataTransByDate = useSelector((state) => state.transByDate);
  const dataTransByCategory = useSelector((state) => state.dataTransByCategory);
  const dataAllTransaction = useSelector((state) => state.allTransaction);
  const [displayCard, setDisplayCard] = useState("Date");
  const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isLogin = useSelector((state) => state.isLogin);
  const loadingTransaction = useSelector((state) => state.loadingTransaction);
  const [monthDropDown, setMonthDropDown] = useState(false);
  const [typeDropDown, setTypeDropDown] = useState(false);
  const [type, setType] = useState("Expense");
  const pickerRef = useRef();

  // Reactotron.log(dataTransByDate.length, 'data trans home?')
  // if (dataUser) {
  //   // Reactotron.log(AsyncStorage.getItem("@dataUser"), 'ASYNC STORAGE HOME ATAS')
  //   Reactotron.log(dataUser.data.firstName, "ini dataUser di Home");
  // } else {
  //   Reactotron.log(dataUser, 'ini data user home')
  // }
  // console.log(monthYear.name, 'month year')
  // console.log(dataTransByDate.length, 'data trans home?')
  // if(dataUser) {
  //   if (dataUser.data) {
  //     console.log('ADAAAAAAA')
  //     console.log(dataUser.data.firstName, "ini dataUser di Home");
  //   } else {
  //     console.log(dataUser, 'ini data user home')
  //   }  
  // } else {
  //   console.log('DATA USER GA ADA')
  // }

  const monthChoices = [
    { label: "January", value: {name: `January 2021`, numMonth: 1}},
    { label: "February", value: {name: `February 2021`, numMonth: 2} },
    { label: "March", value: {name: `March 2021`, numMonth: 3} },
    { label: "April", value: {name: `April 2021`, numMonth: 4} },
    { label: "May", value: {name: `May 2021`, numMonth: 5} },
    { label: "June", value: {name: `June 2021`, numMonth: 6} },
    { label: "July", value: {name: `July 2021`, numMonth: 7}},
    { label: "August", value: {name: `August 2021`, numMonth: 8} },
    { label: "September", value: {name: `Sept 2021`, numMonth: 9} },
    { label: "October", value: {name: `Oct 2021`, numMonth: 10} },
    { label: "November", value: {name: `Nov 2021`, numMonth: 11}},
    { label: "December", value: {name: `Dec 2021`, numMonth: 12} }
  ];

  function changeMonth(value) {
    setMonthYear(value)
    setModalVisible(!modalVisible)
  }

  async function getItem() {
    const dataUserAsync = await AsyncStorage.getItem("@dataUser");
    let result = JSON.parse(dataUserAsync)
    if (result) {
      if (result.access_token) {
        setIsLogin(true)
      }  
    }
    // Reactotron.log(dataUserAsync, 'ASYNC STORAGE HOME')
    setDataUser(JSON.parse(dataUserAsync));
  }

  useEffect(() => {
    let isMounted = true;
    getItem();
    return () => { isMounted = false };
  }, [isLogin]);

  useEffect(() => {
    let isMounted = true;
    if(dataUser) {
      setIsLogin(true)
    }
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (dataUser) {
      if (dataUser.access_token) {
        dispatch(getUserDetails(dataUser.data.id));
        dispatch(fetchTransactionByDate(monthYear.numMonth, dataUser.data));
        dispatch(fetchTransactionByCategory(monthYear.numMonth, dataUser.data));
      }
    }
    return () => { isMounted = false };
  }, [dataUser, monthYear]);

  let totalncome = 0;
  let totalExpense = 0;
  for (let i = 0; i < dataTransByDate.length; i++) {
    for (let j = 0; j < dataTransByDate[i].items.length; j++) {
      if (dataTransByDate[i].items[j].type === "Income") {
        totalncome += dataTransByDate[i].items[j].amount;
      } else if (dataTransByDate[i].items[j].type === "Expense") {
        totalExpense += dataTransByDate[i].items[j].amount;
      }
    }
  }

  if (!dataUser || !dataTransByDate) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.pageScrollContainer}>
        <ImageBackground
          style={{ flex: 1 }}
          source={{
            uri: "https://wallpaperaccess.com/full/126397.jpg",
          }}
        >
          <View style={styles.pageViewContainer}>
            <View style={styles.pageTitle}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                ><Text style={styles.textTop}>{monthYear.name} <Text style={styles.textTopSymbol}>▼</Text></Text>
                </TouchableOpacity>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.formTitle}>Change Month</Text>

                      <View style={{borderWidth: 1, borderColor: 'darkgrey'}}>
                      <Picker
                      style={styles.picker}
                      dropdownIconColor={"black"}
                      ref={pickerRef}
                      mode={"dropdown"}
                      selectedValue={{name: `${monthYear.name}`, numMonth: `${monthYear.numMonth}`}}
                      onValueChange={(itemValue) => changeMonth(itemValue)}
                    >
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="January 2021"
                        value={{name: `January 2021`, numMonth: 1}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="February 2021"
                        value={{name: `February 2021`, numMonth: 2}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="March 2021"
                        value={{name: `March 2021`, numMonth: 3}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="April 2021"
                        value={{name: `April 2021`, numMonth: 4}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="May 2021"
                        value={{name: `May 2021`, numMonth: 5}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="June 2021"
                        value={{name: `June 2021`, numMonth: 6}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="July 2021"
                        value={{name: `July 2021`, numMonth: 7}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="August 2021"
                        value={{name: `August 2021`, numMonth: 8}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="September 2021"
                        value={{name: `Sept 2021`, numMonth: 9}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="October 2021"
                        value={{name: `Oct 2021`, numMonth: 10}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="November 2021"
                        value={{name: `Nov 2021`, numMonth: 11}}
                      />
                      <Picker.Item
                        style={{ fontSize: 14 }}
                        fontFamily={"roboto"}
                        label="December 2021"
                        value={{name: `Dec 2021`, numMonth: 12}}
                      />
                    </Picker>
                    </View>

                      <Pressable
                      style={[styles.buttonModalClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>

                    </View>
                  </View>
                </Modal>

              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text style={styles.textTop}>
                  Hi, {dataUser.data.firstName}!
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("My Dashboard")}
                >
                  <Image
                    style={styles.userProfilePicture}
                    resizeMode="cover"
                    borderRadius={40}
                    source={{ uri: `${dataUser.data.photoProfile}` }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Card>
              <Card.Cover
                source={{
                  uri: "https://images-ext-2.discordapp.net/external/c8yxM9EXjbTRH9ssh8gEAFnX4EmSspXofQr95EQg7GI/%3FupdatedAt%3D1627546581557/https/ik.imagekit.io/77pzczg37zw/Pelit_Home_Banner-JPG_NoEZdIR5e.jpg?width=400&height=201",
                }}
                style={{ height: 150 }}
              />
            </Card>

            <View style={styles.cardTitle}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.colTitle}>Income</Text>
                <Text style={styles.colTitle}>Expense</Text>
                <Text style={styles.colTitle}>Balance</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <NumberFormat
                  value={totalncome}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={0}
                  renderText={(formattedValue) => (
                    <Text style={styles.colBodyIncome}>{formattedValue}</Text>
                  )}
                />
                <NumberFormat
                  value={totalExpense}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={0}
                  renderText={(formattedValue) => (
                    <Text style={styles.colBodyExpense}>{formattedValue}</Text>
                  )}
                />
                <NumberFormat
                  value={user.balance || 0}
                  displayType={"text"}
                  thousandSeparator={true}
                  decimalScale={0}
                  renderText={(formattedValue) => (
                    <Text style={styles.colBody}>{formattedValue}</Text>
                  )}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text style={[styles.textGroupBy, { color: "white" }]}>
                Group By:
              </Text>
              <TouchableOpacity
                style={
                  displayCard === "Date"
                    ? styles.buttonActive
                    : styles.buttonInActive
                }
                onPress={() => setDisplayCard("Date")}
              >
                <Text style={[styles.textGroupBy, { color: "black" }]}>
                  Date
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  displayCard === "Category"
                    ? styles.buttonActive
                    : styles.buttonInActive
                }
                onPress={() => setDisplayCard("Category")}
              >
                <Text style={[styles.textGroupBy, { color: "black" }]}>
                  Category
                </Text>
              </TouchableOpacity>
            </View>
            {!loadingTransaction ? (
              dataTransByDate.length > 0 ? (
                displayCard === "Date" ? (
                  <DateCard navigation={navigation} monthYear={monthYear}></DateCard>
                ) : (
                  <CategoryCard navigation={navigation} monthYear={monthYear}></CategoryCard>
                )
              ) :
                dataTransByDate == {} ? (
                <Text style={styles.textWarning}>
                  Sorry, there is an error fetching your wallet
                </Text>
              ) : (
                <Text style={styles.textWarning}>
                  You Have No Recorded Transactions
                </Text>
                )
            ) : (
              <View style={{marginTop: 30}}>
              <ActivityIndicator size="large" color="#00ff00" />
              </View>
            )}
          </View>
        </ImageBackground>
      </ScrollView>
        <FAB
          style={styles.fab}
          small
          color='white'
          icon="plus"
          onPress={() => navigation.navigate("AddRecord")}
        />
        <FAB
          style={styles.fabQuestion}
          small
          color='white'
          icon="help"
          onPress={() => setModalHelpVisible(true)}
        />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalHelpVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalHelpVisible(!modalHelpVisible);
        }}
      >
        <View style={styles.centeredViewHelp}>
          <View style={styles.modalViewHelp}>
            <Text style={styles.modalTextHelpBold}>Income & Expense</Text>
            <Text style={styles.modalTextHelp}>The total income & expense recorded for the current month only</Text>
            <Text style={styles.modalTextHelpBold}>Balance</Text>
            <Text style={styles.modalTextHelp}>The total ending balance recorded until today, includes all previous months</Text>
            <Text style={styles.modalTextHelpBold}>Individual Record Items</Text>
            <Text style={styles.modalTextHelp}>Only current month's record is shown in homepage. To change the month view, click on the month name on the upper left hand side of the page</Text>
            <Text style={styles.modalTextHelpBold}>See record details</Text>
            <Text style={styles.modalTextHelp}>To see record details, click on each of the individual items</Text>
            <Text style={styles.modalTextHelpBold}>Add a Record</Text>
            <Text style={styles.modalTextHelp}>Click on the floating + button on the bottom right hand side of the page to add a record</Text>
            <Text style={styles.modalTextHelpBold}>User Profile & Analytics</Text>
            <Text style={styles.modalTextHelp}>Navigate to user dashboard by clicking on user profile picture in homepage, or via burger button on the left side header</Text>
            <Pressable
              style={[styles.button, styles.buttonModalClose]}
              onPress={() => setModalHelpVisible(!modalHelpVisible)}
            >
              <Text style={styles.textStyle}>Understood</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#A2DBFA",
  },
  pageScrollContainer: {
    flexGrow: 1,
  },
  cardTitle: {
    // backgroundColor: "green",
    marginTop: 10,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 30,
  },
  centeredViewHelp: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalViewHelp: {
    margin: 20,
    backgroundColor: "black",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTextHelp: {
    marginBottom: 15,
    textAlign: "center",
    color: 'white'
  },
  modalTextHelpBold: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    color: 'white'
  },
  userProfilePicture: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 2,
    marginRight: 2,
  },
  textTop: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  textTopSymbol: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  colTitle: {
    width: 110,
    marginHorizontal: 7,
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  colBody: {
    width: 110,
    marginHorizontal: 7,
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  colBodyExpense: {
    width: 110,
    marginHorizontal: 7,
    fontSize: 15,
    color: "gold",
    textAlign: "center",
  },
  colBodyIncome: {
    width: 110,
    marginHorizontal: 7,
    fontSize: 15,
    color: "lightgreen",
    textAlign: "center",
  },
  textGroupBy: {
    fontSize: 14,
  },
  buttonInActive: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: "#87A7B3",
    borderRadius: 7,
  },
  buttonActive: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: "#1EAE98",
    borderRadius: 7,
  },
  textWarning: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 20,
    color: "red",
  },
  buttonAdd: {
    backgroundColor: "red",
    marginTop: 2,
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
  },
  textAdd: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
    textAlign: "center",
  },
  pageViewContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  pageTitle: {
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 3,
    justifyContent: "space-between",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    marginTop: 120,
    alignItems: "center",
  },
  modalView: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModalClose: {
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    elevation: 2,
    backgroundColor: "green",
  },
  picker: {
    marginTop: 10,
    fontSize: 10,
    borderWidth: 3,
    borderColor: 'black',
    width: 170,
    color: "black",
    marginBottom: 10,
  },
  formTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    padding: 5,
    borderBottomColor: "lightgrey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 5,
    textAlign: "center",
  },
  textStyle: {
    color: 'white'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
    backgroundColor: 'orange'
  },
  fabQuestion: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'darkred'
  },
});
