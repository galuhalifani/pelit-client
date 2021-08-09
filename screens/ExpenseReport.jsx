import React, { useState, useRef, useEffect } from "react";
import {
  dateFormatter,
  monthYearFormatterReport,
} from "../helpers/dateFormatter.js";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Modal,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { monthList } from "../helpers/dateBetween.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";

const Separator = () => <View style={styles.separator} />;

export default function ExpenseReport({ navigation, route }) {
  let month = new Date().getMonth() + 1;
  let endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  const screenWidth = Dimensions.get("window").width;
  const [monthArr, setMonthArr] = useState([
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
  ]);
  const [dateEnd, setDateEnd] = useState(new Date(endOfMonth));
  const [value, setValue] = useState(new Date("0"));
  const [dateStart, setDateStart] = useState(
    new Date(new Date(endOfMonth).setDate(new Date(endOfMonth).getDate() - 150))
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerStart, setPickerStart] = useState(`${dateEnd.getMonth() - 4}`);
  const [pickerEnd, setPickerEnd] = useState(`${dateEnd.getMonth()}`);
  const [modeStart, setModeStart] = useState("date");
  const [modeEnd, setModeEnd] = useState("date");
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [start, setStart] = useState(monthYearFormatterReport(dateStart));
  const [end, setEnd] = useState(monthYearFormatterReport(dateEnd));
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [nettIncome, setNetIncome] = useState([]);
  const [chart2, setChart2] = useState(false);
  const [nettIncomeChart, setNettIncomeChart] = useState(false);
  const [dataUser, setDataUser] = useState("");
  const pickerRef = useRef();
  const [selectedLanguage, setSelectedLanguage] = useState();
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  console.log('dateEnd', dateEnd)

  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  async function getItem() {
    const dataUser = await AsyncStorage.getItem("@dataUser");
    setDataUser(JSON.parse(dataUser));
  }

  useEffect(() => {
    getItem();
  }, []);

  useEffect(() => {
    if (dataUser.access_token) {
      fetch(
        `https://pelit-finance.herokuapp.com/transactions/between/${dateStart}/${dateEnd}/${dataUser.data.id}/Expense` //  // 2
      )
        .then((response) => response.json())
        .then((data) => {
          let group = [];
          let flag = true;
          data.data.forEach((ele) => {
            if (group.length > 0) {
              for (let i = 0; i < group.length; i++) {
                if (group[i].month == monthNames[ele.month - 1]) {
                  flag = true;
                  group[i].expense += ele.amount;
                } else {
                  flag = false;
                }
              }
            } else {
              flag = false;
            }

            if (flag == false) {
              group.push({
                month: monthNames[ele.month - 1],
                expense: ele.amount,
              });
            }
            return ele;
          });

          let monthExp = [];
          for (let i = 0; i < monthArr.length; i++) {
            let flag = false;
            let expense;
            for (let j = 0; j < group.length; j++) {
              if (monthArr[i] == group[j].month) {
                flag = true;
                expense = group[j].expense;
              }
            }
            if (flag == true) {
              monthExp.push((expense * -1) / 1000000);
            } else {
              monthExp.push(0);
            }
          }

          setExpenses(monthExp);
          return fetch(
            `https://pelit-finance.herokuapp.com/transactions/between/${dateStart}/${dateEnd}/${dataUser.data.id}/Income`
          );
        })
        .then((response) => response.json())
        .then((data) => {
          let group = [];
          let flag = true;
          data.data.forEach((ele) => {
            if (group.length > 0) {
              for (let i = 0; i < group.length; i++) {
                if (group[i].month == monthNames[ele.month - 1]) {
                  flag = true;
                  group[i].income += ele.amount;
                } else {
                  flag = false;
                }
              }
            } else {
              flag = false;
            }

            if (flag == false) {
              group.push({
                month: monthNames[ele.month - 1],
                income: ele.amount,
              });
            }
            return ele;
          });

          let monthInc = [];
          for (let i = 0; i < monthArr.length; i++) {
            let flag = false;
            let income;
            for (let j = 0; j < group.length; j++) {
              if (monthArr[i] == group[j].month) {
                flag = true;
                income = group[j].income;
              }
            }
            if (flag == true) {
              monthInc.push(income / 1000000);
            } else {
              monthInc.push(0);
            }
          }

          setIncome(monthInc);
        })
        .catch((err) => {
          console.log("error fetch expense/income data", err);
        });
    }
  }, [monthArr, dataUser]);

  useEffect(() => {
    if (income.length > 0 && expenses.length > 0) {
      let nett = [];
      for (let i = 0; i < monthArr.length; i++) {
        nett.push(income[i] - expenses[i]);
      }

      setNetIncome(nett);
      setChart2(true);
    }
  }, [income]);

  useEffect(() => {
    setMonthArr(monthList(start, end));
  }, [start, end]);

  const onChangeStart = (selectedDate) => {
    let month = +selectedDate;
    setDateStart(new Date(2021, month, 1));
    setPickerStart(selectedDate);
    setStart(monthYearFormatterReport(new Date(2021, month, 1)));
  };

  const onChangeEnd = (selectedDate) => {
    if (+selectedDate <= +pickerStart) {
      alert("End date can not be earlier than start date");
    } else {
      let month = +selectedDate;
      setDateEnd(new Date(2021, month + 1, 0));
      setPickerEnd(selectedDate);
      setEnd(monthYearFormatterReport(new Date(2021, month + 1, 0)));
    }
  };

  const showModeStart = (currentMode) => {
    setShowStart(true);
    setModeStart(currentMode);
  };

  const showModeEnd = (currentMode) => {
    setShowEnd(true);
    setModeEnd(currentMode);
  };

  const showDatepickerStart = () => {
    showModeStart("date");
  };

  const showDatepickerEnd = () => {
    showModeEnd("date");
  };

  function secondChart() {
    setNettIncomeChart(true);
  }

  // console.log(income, 'INCOME')
  console.log(expenses, "EXP");
  // console.log(nettIncome, 'NETT')
  // console.log(monthArr, 'MONTHARR')
  // console.log(start, end)

  // console.log(dateStart, 'START', dateEnd, 'END')

  return (
    <ScrollView contentContainerStyle={styles.pageScrollContainer}>
      <ImageBackground
        style={{ flex: 1 }}
        //We are using online image to set background
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZiUTun3fuJmLmAJfTGM7Hl32p5Wt9zVV7Ww&usqp=CAU",
        }}
      >
        <View style={styles.pageViewContainer}>
          <View style={{ alignItems: "center" }}>
            <View style={{ marginTop: 25 }}></View>

            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.dash}>From</Text>
                <Picker
                  style={styles.picker}
                  dropdownIconColor={"black"}
                  ref={pickerRef}
                  mode={"dropdown"}
                  selectedValue={pickerStart}
                  onValueChange={(itemValue) => onChangeStart(itemValue)}
                >
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="January"
                    value="0"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="February"
                    value="1"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="March"
                    value="2"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="April"
                    value="3"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="May"
                    value="4"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="June"
                    value="5"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="July"
                    value="6"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="August"
                    value="7"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="September"
                    value="8"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="October"
                    value="9"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="November"
                    value="10"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="December"
                    value="11"
                  />
                </Picker>

                <Text style={styles.dash}>To</Text>
                <Picker
                  style={styles.picker}
                  dropdownIconColor={"black"}
                  ref={pickerRef}
                  mode={"dropdown"}
                  selectedValue={pickerEnd}
                  onValueChange={(itemValue) => onChangeEnd(itemValue)}
                >
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="January"
                    value="0"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="February"
                    value="1"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="March"
                    value="2"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="April"
                    value="3"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="May"
                    value="4"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="June"
                    value="5"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="July"
                    value="6"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="August"
                    value="7"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="September"
                    value="8"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="October"
                    value="9"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="November"
                    value="10"
                  />
                  <Picker.Item
                    style={{ fontSize: 14 }}
                    fontFamily={"roboto"}
                    label="December"
                    value="11"
                  />
                </Picker>
              </View>
            </View>
          </View>

          <Text style={{ color: "white", marginTop: 30 }}>
            Monthly Nett Income (Income - Expense)
          </Text>
          {nettIncome.length > 0 ? (
            <LineChart
              data={{
                labels: monthArr,
                datasets: [
                  {
                    data: nettIncome,
                  },
                ],
              }}
              width={screenWidth * 0.9} // from react-native
              height={200}
              yAxisSuffix="Mn"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                fillShadowGradient: "white",
                fillShadowGradientOpacity: 1,
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#5854f0",
                backgroundGradientTo: "#0041ab",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
                propsForBackgroundLines: {
                  strokeWidth: "0.2",
                  stroke: "black",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          ) : (
            <ActivityIndicator size="large" color="#00ff00" />
          )}
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: "white" }}>Monthly Expense</Text>
            {expenses.length > 0 ? (
              <BarChart
                data={{
                  labels: monthArr,
                  datasets: [
                    {
                      data: expenses,
                    },
                  ],
                }}
                withDots={false}
                marginTop={"15"}
                showValuesOnTopOfBars={true}
                width={screenWidth * 0.9} // from react-native
                height={200}
                yAxisSuffix="Mn"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  fillShadowGradient: "white",
                  fillShadowGradientOpacity: 1,
                  backgroundColor: "#e26a00",
                  backgroundGradientFrom: "#5854f0",
                  backgroundGradientTo: "#0041ab",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 167, 38, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(225, 225, 225, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForBackgroundLines: {
                    r: "0",
                    strokeWidth: "0.2",
                    stroke: "black",
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            ) : (
              <ActivityIndicator size="large" color="#00ff00" />
            )}
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageScrollContainer: {
    flexGrow: 1,
  },
  pageViewContainer: {
    flex: 1,
    paddingHorizontal: 20,
    // backgroundColor: "#04009A",
    marginBottom: 100,
  },
  separator: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  seeBadges: {
    backgroundColor: "white",
    marginHorizontal: 5,
    padding: 3,
    borderRadius: 15,
    alignItems: "center",
  },
  seeBadgesText: {
    alignItems: "center",
    fontSize: 9,
    color: "black",
  },
  picker: {
    marginTop: 10,
    fontSize: 10,
    // alignItems: 'center',
    width: 130,
    color: "black",
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    alignItems: "center",
    paddingLeft: 15,
    width: 350,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "lightyellow",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  dash: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
});
