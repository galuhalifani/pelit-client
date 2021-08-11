import {
  SET_ALL_TRANSACTION_USER,
  SET_TRANSACTION_BY_CATEGORY,
  SET_TRANSACTION_BY_DATE,
  SET_LOADING_TRANSACTION,
  SET_IS_LOGIN,
  SET_ERROR_LOGIN,
  SET_ERROR
} from "./actionTypesFaisal";
import { getUserDetails } from "./actionsGaluh";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function setIsLogin(input) {
  return {
    type: SET_IS_LOGIN,
    payload: input,
  };
}

export function setErrorLogin(input) {
  return {
    type: SET_ERROR_LOGIN,
    payload: input,
  };
}

export function setError(input) {
  return {
    type: SET_ERROR,
    payload: input,
  };
}

export function setAllTransactionUser(input) {
  return {
    type: SET_ALL_TRANSACTION_USER,
    payload: input,
  };
}

export function setTransactionByCategoty(input) {
  return {
    type: SET_TRANSACTION_BY_CATEGORY,
    payload: input,
  };
}

export function setTransactionByDate(input) {
  return {
    type: SET_TRANSACTION_BY_DATE,
    payload: input,
  };
}

export function setLoadingTransaction(input) {
  return {
    type: SET_LOADING_TRANSACTION,
    payload: input,
  };
}

export function fetchLoginUser(email, password) {
  console.log(email, password, "masuk fetch login");
  let result = {};
  return async (dispatch) => {
    dispatch(setLoadingTransaction(true));
    try {
      const response = await fetch("https://pelit-finance.herokuapp.com/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.replace(" ", ""),
          password,
        }),
      });
      result = await response.json();
      if (result.access_token) {
        // await AsyncStorage.removeItem("@dataUser")
        await AsyncStorage.setItem("@dataUser", JSON.stringify(result));
        dispatch(setIsLogin(true));
        dispatch(setAllTransactionUser(result));
        dispatch(setLoadingTransaction(false));
      } else if ((result.message = "Wrong Email/Password")) {
        console.log("SALAH PASSWORD");
        dispatch(setLoadingTransaction(false));
        // console.log(result);
        Alert.alert("Wrong email/password");
        dispatch(setIsLogin(false));
      } else {
        console.log("MASIH LOADING");
      }
    } catch (err) {
      console.log("ERROR");
      console.log(err);
    }
  };
}

export function fetchRegisterUser(payload) {
  console.log(payload, "ini payload di action");
  return async (dispatch) => {
    dispatch(setLoadingTransaction(true));
    try {
      const response = await fetch("https://pelit-finance.herokuapp.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // body: JSON.stringify(payload),
        body: payload,
      });
      const result = await response.json();
      if (result.message) {
        dispatch(setLoadingTransaction(false));
        return result.message;  
      }
    } catch (err) {
      dispatch(setLoadingTransaction(false));
      console.log("error di fetch register", err);
    }
  };
}

export function fetchTransactionByDate(month, data) {
  return async (dispatch) => {
    try {
      dispatch(setLoadingTransaction(true));
      if (data) {
        const response = await fetch(
          `https://pelit-finance.herokuapp.com/transactions/date/${data.id}/${month}`
        );
        const result = await response.json();
        // console.log("result di action", result);
        dispatch(setTransactionByDate(result));
      }
    } catch (err) {
      console.log("error di fetch transaction by date", err);
      Alert.alert("Sorry, there is an error", "Please refresh the page");
    } finally {
      dispatch(setLoadingTransaction(false));
    }
  };
}

export function fetchTransactionByCategory(month, data) {
  return async (dispatch) => {
    try {
      dispatch(setLoadingTransaction(true));
      if (data) {
        const response = await fetch(
          `https://pelit-finance.herokuapp.com/transactions/category/${
            data.id
          }/${+month}`
        );
        const result = await response.json();
        dispatch(setTransactionByCategoty(result));
      }
    } catch (err) {
      console.log("error di fetch transaction by category", err);
    } finally {
      dispatch(setLoadingTransaction(false));
    }
  };
}

export function fetchDeleteTransaction(id, monthYear, userData) {
  console.log(id, "ini transaction id");
  return function (dispatch) {
      dispatch(setLoadingTransaction(true));
      fetch(`https://pelit-finance.herokuapp.com/transactions/${id}`, {
          method: "delete",
        })
      .then((response) => response.json())
      .then((data) => {
        dispatch(fetchTransactionByDate(monthYear.numMonth, userData))
        dispatch(fetchTransactionByCategory(monthYear.numMonth, userData))
        dispatch(getUserDetails(userData.id))
        console.log("success delete", data)
      })
      .catch((err) => {
        dispatch(setLoadingTransaction(false));
        console.log("error delete item", err);
      });
  };
}
