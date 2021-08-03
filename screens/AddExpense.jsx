import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dateFormatter, monthYearFormatter } from "../helpers/dateFormatter";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { postTransaction } from "../store/actions";
import { useForm, Controller } from "react-hook-form";
import { Provider, TextInput } from "react-native-paper";
import DropDown from "../helpers/react-native-paper-dropdown";
import {
  fetchTransactionByDate,
  fetchTransactionByCategory,
  fetchLoginUser,
} from "../store/actionsFaisal";
import { getUserDetails } from "../store/actionsGaluh";

export default function AddExpense({ navigation, route }) {
  const keyboardVerticalOffset = Platform.OS === "android" ? 100 : 0;
  const [typeDropDown, setTypeDropDown] = useState(false);
  const [categoryDropDown, setCategoryDropDown] = useState(false);
  const dispatch = useDispatch();
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState("");
  const [receiptImage, setReceiptImage] = useState("");
  const [UserId, setUserId] = useState("");
  const [dataUser, setDataUser] = useState("");
  const [note, setNote] = useState("");

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const newDate = new Date();
  const monthYear = monthYearFormatter(newDate);

  const genderList = [
    { label: "Male", value: "male" },

    { label: "Female", value: "female" },

    { label: "Others", value: "others" },
  ];

  const expenseChoices = [
    { label: "Housing", value: "Housing" },
    { label: "Transportation", value: "Transportation" },
    { label: "Food & Beverage", value: "Food & Beverage" },
    { label: "Utilities", value: "Utilities" },
    { label: "Insurance", value: "Insurance" },
    { label: "Medical & Healthcare", value: "Medical & Healthcare" },
    { label: "Invest & Debt", value: "Invest & Debt" },
    { label: "Personal Spending", value: "Personal Spending" },
    { label: "Other Expense", value: "Other Expense" },
  ];
  const incomeChoices = [
    { label: "Salary", value: "Salary" },
    { label: "Wages", value: "Wages" },
    { label: "Commission", value: "Commission" },
    { label: "Interest", value: "Interest" },
    { label: "Investments", value: "Investments" },
    { label: "Gifts", value: "Gifts" },
    { label: "Allowance", value: "Allowance" },
    { label: "Other Income", value: "Other Income" },
  ];

  const expenseItems = expenseChoices.map((ele) => ({
    label: ele,
    value: ele,
  }));
  const incomeItems = incomeChoices.map((ele) => ({ label: ele, value: ele }));

  useEffect(() => {
    (async () => {
      const dataAsyncUser = await AsyncStorage.getItem("@dataUser");
      setUserId(JSON.parse(dataAsyncUser).data.id);
      setDataUser(JSON.parse(dataAsyncUser));
      // console.log(UserId)
    })();
    // setUserId(29)

    if (route.params) {
      const {
        title: titleParam,
        total: totalParam,
        fullDate: dateParam,
      } = route.params.data;
      const image = route.params.image;
      dateParam ? setDate(new Date(dateParam)) : null;
      titleParam ? setTitle(titleParam) : null;
      totalParam ? setAmount(totalParam) : null;
      image ? setReceiptImage(image) : null;
      // console.log(receiptImage, 'receiptImage')
    }
    // console.log(route.params)
  }, []);

  async function uploadImageHandler() {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }

    const photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    console.log(photo);

    if (!photo.cancelled) {
      setReceiptImage(photo);
      // console.log(photo.uri)
    }
  }

  const dateHandler = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // setShow(Platform.OS === 'android');
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  async function submitHandler() {
    let dateParse = date.toISOString();
    // dateParse = `${dateParse[2]}-${dateParse[1]}-${dateParse[0]}`;

    const payload = new FormData();
    payload.append("type", type);
    payload.append("category", category);
    payload.append("title", title);
    payload.append("fullDate", dateParse);
    payload.append("note", note);

    payload.append("amount", amount);
    const mimeType = "image/jpeg";
    const fileName = "receiptImage";
    if (receiptImage) {
      payload.append("receiptImage", {
        uri: receiptImage.uri,
        name: fileName,
        type: mimeType,
      });
    }
    // console.log(type, category, title, dateParse, note, UserId, receiptImage.uri)
    // console.log(payload, "ini di submit handler");
    setIsLoading(true);

    await dispatch(postTransaction({ payload, UserId }));
    dispatch(fetchTransactionByDate(monthYear.numMonth, dataUser.data));
    dispatch(fetchTransactionByCategory(monthYear.numMonth, dataUser.data));
    dispatch(getUserDetails(dataUser.data.id));
    navigation.navigate("Home");
  }

  if (isLoading)
    return (
      <View style={[styles.container, styles.horizontal, styles.loading]}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );

  return (
    <>
      <Provider>
        <ScrollView contentContainerStyle={styles.container}>
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={keyboardVerticalOffset}
          >
            <View
              style={{
                marginRight: 30,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.typeDate}>Transaction Date*</Text>
              <Text>{dateFormatter(date)}</Text>
            </View>
            <Button
              onPress={showDatepicker}
              color={"blue"}
              title="Pick a date"
            />
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={dateHandler}
              />
            )}

            <View style={{ marginTop: 20 }}>
              <DropDown
                label={"Record Type*"}
                mode={"outlined"}
                value={type}
                setValue={setType}
                list={[
                  { label: "Expense", value: "Expense" },
                  { label: "Income", value: "Income" },
                ]}
                visible={typeDropDown}
                showDropDown={() => setTypeDropDown(true)}
                onDismiss={() => setTypeDropDown(false)}
                inputProps={{
                  right: <TextInput.Icon name={"menu-down"} />,
                }}
              />
            </View>

            {}
            <View style={{ marginTop: 20 }}>
              <DropDown
                label={"Category*"}
                mode={"outlined"}
                value={category}
                setValue={setCategory}
                list={type === "Expense" ? expenseChoices : incomeChoices}
                visible={categoryDropDown}
                showDropDown={() => setCategoryDropDown(true)}
                onDismiss={() => setCategoryDropDown(false)}
                inputProps={{
                  right: <TextInput.Icon name={"menu-down"} />,
                }}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <TextInput
                label="Record Title*"
                mode="outlined"
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <TextInput
                label="Amount*"
                value={"" + amount}
                mode="outlined"
                keyboardType="numeric"
                onChangeText={(text) => setAmount(text)}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <TextInput
                label="Notes"
                mode="outlined"
                value={note}
                onChangeText={(text) => setNote(text)}
              />
            </View>
          </KeyboardAvoidingView>

          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
              Receipt Image
            </Text>
            {receiptImage ? (
              <>
                <Image
                  style={styles.image}
                  source={{
                    uri: receiptImage.uri,
                  }}
                />
                <Button
                  onPress={() => setReceiptImage("")}
                  title="Clear Image"
                  color={"blue"}
                  style={styles.buttonStyle}
                />
              </>
            ) : (
              <Button
                onPress={uploadImageHandler}
                title="Upload Image"
                color={"black"}
                style={styles.buttonStyle}
              />
            )}
          </View>

          {type && category && title && amount ? (
            <View style={{ marginTop: 20, marginBottom: 30 }}>
              <Button
                onPress={submitHandler}
                color={"green"}
                title="Submit Record"
                style={styles.buttonStyle}
              />
            </View>
          ) : (
            <View style={{ marginTop: 20, marginBottom: 30 }} />
          )}
        </ScrollView>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    color: "black",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  type: {
    marginTop: 20,
    backgroundColor: "black",
    width: 100,
    color: "white",
    textAlign: "center",
    borderRadius: 5,
    height: 22,
  },
  typeDate: {
    marginTop: 20,
    // backgroundColor: "black",
    fontWeight: "bold",
    marginBottom: 10,
    // width: '80%',
    color: "black",
    textAlign: "center",
    borderRadius: 5,
    height: 22,
  },
  recordName: {
    marginTop: 18,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: "black",
    width: 225,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  selectType: {
    color: "white",
    marginLeft: 120,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    marginTop: -22,
    // width: 70,
  },
  buttonStyle: {
    backgroundColor: "green",
    color: "black",
  },
  image: {
    // width: 200,
    // height: 200,
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 4,
  },
});
