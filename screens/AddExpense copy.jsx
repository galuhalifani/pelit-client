import React from "react";
import { View, Text, Button, StyleSheet, TextInput, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dateFormatter } from "../helpers/dateFormatter";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { postTransaction } from "../store/actions";
import { useForm, Controller } from "react-hook-form";

export default function AddExpense({ navigation, route }) {
    const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
        firstName: '',
        lastName: ''
    }
    });

  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [receiptImage, setReceiptImage] = useState("");
  const [UserId, setUserId] = useState("");
  const [note, setNote] = useState("");

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const expenseChoices = [
    "Housing",
    "Transportation",
    "Food & Beverage",
    "Utilities",
    "Insurance",
    "Medical & Healthcare",
    "Invest & Debt",
    "Personal Spending",
    "Other Expense",
  ];
  const incomeChoices = [
    "Salary",
    "Wages",
    "Commission",
    "Interest",
    "Investments",
    "Gifts",
    "Allowance",
    "Other Income",
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
    const dateParse = date.toLocaleDateString("id-ID");

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
    console.log(payload, "ini di submit handler");
    await dispatch(postTransaction({ payload, UserId }));
    navigation.navigate("Home");
  }

  return (
    <>
      <View style={styles.container}>
      <Controller
        control={control}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name="firstName"
        rules={{ required: true }}
      />
        <View>
          {/* <Text style={styles.type}>Type</Text> */}
          <View style={styles.selectType}>
            <Picker
              placeholder={{ label: "Pick a type" }}
              onValueChange={setType}
            >
              <Picker.Item
                style={styles.pickerItem}
                label="Expense"
                value="Expense"
              />
              <Picker.Item
                style={styles.pickerItem}
                label="Income"
                value="Income"
              />
            </Picker>
          </View>
        </View>
        <Text style={styles.type}>Category</Text>
        <RNPickerSelect
          placeholder={{ label: "Pick a type first" }}
          onValueChange={setCategory}
          items={
            type === "Expense"
              ? expenseItems
              : incomeItems
          }
        />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.type}>Record name</Text>
          <TextInput onChangeText={setTitle} style={styles.recordName} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.type}>Date</Text>
          <Text>{dateFormatter(date)}</Text>
        </View>
        <Button onPress={showDatepicker} title="Pick a date" />
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
        <Text>Amount</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 15, flex: 1, textAlign: "center" }}>
            Rp{" "}
          </Text>
          <TextInput
            style={{ fontSize: 15, flex: 4, textAlign: "left" }}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
        <Text>Receipt Image</Text>
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
              style={styles.buttonStyle}
            />
          </>
        ) : (
          <Button
            onPress={uploadImageHandler}
            title="Upload Image"
            style={styles.buttonStyle}
          />
        )}
        <Text>Note</Text>
        <TextInput
          style={{ fontSize: 15, flex: 4, textAlign: "left" }}
          onChangeText={setNote}
        />
        <input type="submit" />
        {/* <Button
          onPress={submitHandler}
          title="Submit Record"
          style={styles.buttonStyle}
        /> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
