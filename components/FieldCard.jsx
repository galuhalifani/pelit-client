import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import ModalItem from "./ModalItem";
import {
  fetchDeleteTransaction,
  fetchTransactionByCategory,
  fetchTransactionByDate,
} from "../store/actionsFaisal";
import { useDispatch } from "react-redux";
import NumberFormat from "react-number-format";
import { Avatar } from "react-native-paper";
import { useEffect } from "react";
import { Icon, Overlay } from "react-native-elements";
import { monthYearFormatter } from "../helpers/dateFormatter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserDetails } from "../store/actionsGaluh";

export default function FieldCard({ item, navigation, monthYear }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [icon, setIcon] = useState("");
  const dispatch = useDispatch();
  const [dataAsyncUser, setDataAsyncUser] = useState("");
  // const date = new Date();
  // const monthYear = monthYearFormatter(date);
  let flagS = false;

  async function getItem() {
    const dataAsync = await AsyncStorage.getItem("@dataUser");
    setDataAsyncUser(JSON.parse(dataAsync));
  }
  useEffect(() => {
    getItem();
  }, [flagS, modalVisible]);

  useEffect(() => {
    dispatch(fetchTransactionByDate(monthYear.numMonth, dataAsyncUser.data));
  }, []);

  useEffect(() => {
    switch (item.category) {
      case "Food & Beverage":
        setIcon("food");
        return;
      case "Housing":
        setIcon("home");
        return;
      case "Food & Beverage":
        setIcon("train-car");
        return;
      case "Transportation":
        setIcon("train-car");
        return;
      case "Utilities":
        setIcon("flash");
        return;
      case "Insurance":
        setIcon("shield-sun");
        return;
      case "Medical & Healthcare":
        setIcon("hospital-building");
        return;
      case "Invest & Debt":
        setIcon("chart-line");
        return;
      case "Personal Spending":
        setIcon("basket");
        return;
      case "Other Expense":
        setIcon("cash-multiple");
        return;
      case "Salary":
        setIcon("currency-usd");
        return;
      case "Wages":
        setIcon("train-car");
        return;
      case "Commission":
        setIcon("hospital-building");
        return;
      case "Interest":
        setIcon("chart-line");
        return;
      case "Personal Spending":
        setIcon("basket");
        return;
      case "Other Expense":
        setIcon("cash-multiple");
        return;
      case "Salary":
        setIcon("office-building");
        return;
      case "Wages":
        setIcon("cash-plus");
        return;
      case "Investments":
        setIcon("account-cash");
        return;
      case "Gifts":
        setIcon("gift");
        return;
      case "Allowance":
        setIcon("account-cash");
        return;
      case "Other Income":
        setIcon("currency-usd");
        return;
    }
  }, []);

  function handleEditItem() {
    console.log('MASUK HANDLE EDIT')
    // console.log({ item })
    setModalVisible(!modalVisible);
    navigation.navigate("EditExpense", { item, monthYear });
  }

  async function handleDeleteItem() {
    setModalVisible(!modalVisible);
    flagS = true;
    await dispatch(fetchDeleteTransaction(item.id));
    dispatch(fetchTransactionByDate(monthYear.numMonth, dataAsyncUser.data));
    dispatch(
      fetchTransactionByCategory(monthYear.numMonth, dataAsyncUser.data)
    );
    dispatch(getUserDetails(dataAsyncUser.data.id));
    // dispatch(fetchTransactionByDate(monthYear.numMonth, dataUser.data));
    // dispatch(fetchTransactionByCategory(monthYear.numMonth, dataUser.data));
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 320,
            alignItems: "center",
            // borderWidth: 2
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: 180,
              // borderWidth: 2
            }}
          >
            <View style={styles.simbolListCard}>
              <Avatar.Icon
                size={24}
                icon={icon}
                style={
                  item.type == "Expense"
                    ? styles.iconStyleExpense
                    : styles.iconStyleIncome
                }
              />
            </View>
            <Text style={styles.textListCard}>{item.category}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <NumberFormat
              value={item.amount}
              style={styles.textListCard}
              displayType={"text"}
              thousandSeparator={true}
              decimalScale={0}
              renderText={(formattedValue) => (
                <Text style={styles.textListCardNumber}>{formattedValue}</Text>
              )}
            />
            <Icon
              name="magnifying-glass"
              size={10}
              type="entypo"
              color={"blue"}
              underlayColor={"blue"}
              style={{ marginTop: 3 }}
            />
          </View>
        </View>
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
            <ModalItem item={item} />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonEdit]}
                // onPress={() => setModalVisible(!modalVisible)}
                // onPress={() => )}
                onPress={handleEditItem}
              >
                <Text style={styles.textButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDelete]}
                onPress={handleDeleteItem}
                // onPress={() => navigation.navigate("MyProfile")}
              >
                <Text style={styles.textButton}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonBack]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textButton}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  simbolListCard: {
    fontSize: 17,
    marginLeft: 20,
    marginTop: 8,
  },
  textListCard: {
    fontSize: 15,
    marginVertical: 5,
    textAlign: "right",
    paddingHorizontal: 10,
  },
  textListCardNumber: {
    fontSize: 15,
    // borderWidth: 2,
    marginVertical: 5,
    textAlign: "right",
    paddingHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
  },
  button: {
    marginTop: 15,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
    width: 70,
  },
  buttonEdit: {
    backgroundColor: "green",
  },
  buttonDelete: {
    backgroundColor: "red",
  },
  buttonBack: {
    backgroundColor: "black",
  },
  textButton: {
    color: "white",
    textAlign: "center",
  },
  iconStyleExpense: {
    backgroundColor: "red",
  },
  iconStyleIncome: {
    backgroundColor: "green",
  },
});
