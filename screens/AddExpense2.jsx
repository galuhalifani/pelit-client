import React from "react";
import { View, Text, Button, StyleSheet, TextInput, Image } from "react-native"
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { dateFormatter } from "../helpers/dateFormatter";
import * as ImagePicker from 'expo-image-picker';


import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from "react";
import RNPickerSelect from 'react-native-picker-select'
import DateTimePicker from '@react-native-community/datetimepicker';
import { postTransaction } from '../store/actions'

export default function AddExpense({ navigation, route }) {
    const dispatch = useDispatch()
    const [type, setType] = useState('')
    const [category, setCategory] = useState('')
    const [name, setName] = useState('')
    const [date, setDate] = useState(new Date())
    const [amount, setAmount] = useState(0)
    const [receiptImage, setReceiptImage] = useState('')
    const [UserId, setUserId] = useState('')

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const expenseChoices = ['Housing', 'Transportation', 'Food & Beverage', 'Utilities', 'Insurance', 'Medical & Healthcare', 'Invest & Debt', 'Personal Spending', 'Other Expense']
    const incomeChoices = ['Salary', 'Wages', 'Commission', 'Interest', 'Investments', 'Gifts', 'Allowance', 'Other Income']
    const expenseItems = expenseChoices.map(ele => ({ label: ele, value: ele }))
    const incomeItems = incomeChoices.map(ele => ({ label: ele, value: ele }))

    useEffect(() => {
        // async function fetchStart() {
        //     const dataAsyncUser = await AsyncStorage.getItem('@dataUser')
        //     setUserId(dataAsyncUser.id)
        // }
        // fetchStart()
        // !dummy
        setUserId(2)

        if (route.params) {
            const { title: titleParam, total: totalParam, fullDate: dateParam } = route.params.data
            const image = route.params.image
            dateParam ? setDate(new Date(dateParam)) : null
            titleParam ? setName(titleParam) : null
            totalParam ? setAmount(totalParam) : null
            image ? setReceiptImage(image) : null
            console.log(receiptImage, 'receiptImage')
        }
        // console.log(route.params)
    }, [])

    async function uploadImageHandler() {
        console.log('gottem')
        // (async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return
            }
        }
        //   })();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            // console.log('tidak masuk', result)
            setReceiptImage(result);
            // setIsLoading(true)
            // const processedImage = await postToServer(result)
            // if (processedImage) {
            //     // e.preventDefault()
            //     console.log('siap-siap sebelum naviagate', processedImage)
            //     setIsLoading(false)
            //     navigation.navigate('Add Expense', {data: processedImage, imageUri: result.uri})
            // }
        }
    }

    const dateHandler = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        // setShow(Platform.OS === 'android');
        setShow(false)
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    // imagekit here

    async function submitHandler(e) {
        // data diubah jadi form
        // const data = { type, category, name, date, amount, receiptImage }
        // console.log(data)
        const payload = new FormData();
        payload.append("type", type);
        payload.append("category", category);
        payload.append("name", name);
        payload.append("fullDate", date.toString());
        payload.append("amount", amount);
        payload.append("receiptImage", receiptImage);

        // console.log(payload)
        dispatch(postTransaction(payload, UserId))
        // navigation.navigate('Home')
    }

    return (
        <>
            <View style={styles.test}>
                {/* <Text>{JSON.stringify(navigation?.data)}</Text> */}
                {/* <View>
                    <Button onPress={showDatepicker} title="Show date picker!" />
                </View>
                <View>
                    <Button onPress={showTimepicker} title="Show time picker!" />
                </View> */}
                {/* <Button
                    title="Type"
                    disabled
                    onPress={() => Alert.alert('Cannot press this one')}
                /> */}
                <Text>Type</Text>
                <RNPickerSelect
                    // onValueChange={(value) => setType(value)}
                    placeholder={{ label: 'Pick a type' }}
                    onValueChange={setType}
                    items={[
                        { label: 'Expense', value: 'Expense' },
                        { label: 'Income', value: 'Income' },
                    ]}
                />
                <Text>Category</Text>
                <RNPickerSelect
                    // onValueChange={(value) => setCategory(value)}
                    placeholder={{ label: 'Pick a type first' }}
                    onValueChange={setCategory}
                    items={
                        type === 'Expense'
                            ? (expenseItems)
                            : (
                                // type === 'Income'
                                incomeItems
                                // ? (incomeItems)
                                // : [{ label: 'Pick a category first', value: '' }]
                            )
                    }
                />
                <Text>RecordName</Text>
                <TextInput onChangeText={setName} />
                <Text>Date</Text>
                <Text>{dateFormatter(date)}</Text>
                <Button onPress={showDatepicker} title="Pick a date" />
                {show && (<DateTimePicker
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
                    <Text style={{ fontSize: 15, flex: 1, textAlign: 'center' }}>Rp </Text>
                    <TextInput style={{ fontSize: 15, flex: 4, textAlign: 'left' }} onChangeText={setAmount} keyboardType='numeric' />
                </View>
                <Text>Receipt Image</Text>
                {receiptImage
                    ? (<>
                    {/* <Text>{JSON.stringify(receiptImage)}</Text> */}
                        <Image 
                        style={styles.image}
                        source={{
                            uri: receiptImage.uri
                        }} />
                        <Button
                            onPress={() => setReceiptImage('')}
                            title="Clear Image"
                            style={styles.buttonStyle}
                        />
                    </>)
                    :
                    <Button
                        onPress={uploadImageHandler}
                        title="Upload Image"
                        style={styles.buttonStyle}
                    />
                }
                <Button
                    onPress={submitHandler}
                    title="Submit Record"
                    style={styles.buttonStyle}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    test: {
        flex: 1,
        backgroundColor: '#61dafb',
        color: 'black'
    },
    buttonStyle: {
        backgroundColor: 'green',
        color: 'black'
    }, 
    image: {
        // width: 200,
        // height: 200,
        flex: 1,
        marginHorizontal: 4,
        marginVertical: 4
    }
})