import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
} from "react-native";
import ModalItem from "./ModalItem";
import { monthYearFormatter, monthFormatter } from "../helpers/dateFormatter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionByCategory } from "../store/actionsFaisal";
import FieldCardCategory from "./FieldCardCategory";
import NumberFormat from "react-number-format";

export default function CategoryCard({ navigation, monthYear }) {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [dataAsyncUser, setDataAsyncUser] = useState("");
  // const date = new Date();
  // const monthYear = monthYearFormatter(date);
  let dataTransByCategory = useSelector((state) => state.transByCategory);

  async function getItem() {
    const dataAsync = await AsyncStorage.getItem("@dataUser");
    setDataAsyncUser(JSON.parse(dataAsync));
  }

  useEffect(() => {
    getItem();
  }, []);

  useEffect(() => {
    if (dataAsyncUser.access_token) {
      dispatch(
        fetchTransactionByCategory(monthYear.numMonth, dataAsyncUser.data)
      );
    }
  }, []);

  if (!dataAsyncUser || !dataTransByCategory.length) return null;

  return (
    <View style={styles.container}>
      {/* <Text style={styles.textWarning}>You Have No Recorded Transactions</Text> */}
      {dataTransByCategory.map((data, index) => (
        <View style={{ alignItems: "center" }} key={index}>
          <View style={styles.cardPerDate}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 300,
              }}
            >
              <TouchableOpacity>
                <Text style={styles.textDateCard}>{data.category}</Text>
              </TouchableOpacity>
              <NumberFormat
                value={data.total}
                displayType={"text"}
                thousandSeparator={true}
                decimalScale={0}
                renderText={(formattedValue) => (
                  <Text style={styles.textTotalCard}>{formattedValue}</Text>
                )}
              />
            </View>
            <Text style={styles.borderTitleCard}></Text>

            {data.items.map((item, index) => (
              <FieldCardCategory
                key={index}
                data={data}
                item={item}
                navigation={navigation}
                monthYear={monthYear}
              ></FieldCardCategory>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#A2DBFA",
    // borderWidth: 5
  },
  cardPerDate: {
    // borderWidth: 2,
    width: 340,
    backgroundColor: "white",
    marginTop: 10,
    paddingLeft: 5,
    borderRadius: 10,
    paddingVertical: 10,
  },
  textDateCard: {
    width: 180,
    fontSize: 15,
    paddingHorizontal: 20,
    fontWeight: "bold",
  },
  textTotalCard: {
    fontSize: 15,
    textAlign: "right",
    // paddingHorizontal: 10,
    fontWeight: "bold",
  },
  borderTitleCard: {
    height: 2,
    width: 300,
    backgroundColor: "black",
    marginHorizontal: 10,
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
  },
});
