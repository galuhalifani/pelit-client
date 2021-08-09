import {} from "./actionTypesGaluh.js";
import { SET_TRANSACTION } from "./actionTypes.js";
import { SET_LOADING_FETCH_TRANSACTION } from "./actionTypes.js";
import {
  Alert
} from "react-native";

export function setTransaction(payload) {
  return {
    type: SET_TRANSACTION,
    payload,
  };
}

export function setLoadingFeTransaction(payload) {
  return {
    type: SET_LOADING_FETCH_TRANSACTION,
    payload,
  };
}

export function postTransaction({ payload, UserId }) {
  return async (dispatch) => {
    console.log(payload, "ini payload di action");
    try {
      console.log(payload, UserId, "masuk actions");
      let res = await fetch(
        `https://pelit-finance.herokuapp.com/transactions/${UserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // body: JSON.stringify(payload),
          body: payload,
        }
      );
      // console.log(await res.text())
      res = await res.json();
      console.log("Success:", res);
    } catch (error) {
      console.error("Error:", error);
    }
  };
}

// export function putTransaction({ payload }) {
//   return async (dispatch) => {
//     try {
//       console.log(payload, "masuk actions");
//       let res = await fetch(
//         `https://pelit-finance.herokuapp.com/transactions/${payload.TransactionId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );
//       await res.json();
//       console.log("Success:", res);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
// }

export function putTransaction({ payload }) {
  return function (dispatch) {
    fetch(`https://pelit-finance.herokuapp.com/transactions/${payload.TransactionId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("success", data)
      })
      .catch((err) => {
        console.log("error edit item", err);
      });
  };
}

export function postOcr(payload) {
  return async (dispatch) => {
    try {
      console.log(payload, "SEBELUM POST OCR");
      let res = await (
        // await fetch("https://pelit-finance.herokuapp.com/ocr", {
        // await fetch("http://34.203.33.222:3000/ocr", {
          // await fetch("http://192.168.11.1:3000/ocr", {
          await fetch("http://3.90.81.18:3000/ocr", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // body: JSON.stringify(payload),
          body: payload,
        })
      ).json();
      
      if (res.message == 'image is too large') {
        console.log(res)
        return res
      } else if (!res.fullDate && !res.total && !res.title) {
        Alert.alert('Failed to scan text', 'Please input details manually')
        console.log("Success:", res);
        return res;  
      } else {
        console.log("Success:", res);
        return res;  
      }
    } catch (error) {
      console.log("Error:", error);
      return 'error timed out'
      // dispatch(setLoadingFeTransaction(false));
    }
  };
}

export function fetchTransaction(TransactionId) {
  return async (dispatch) => {
    try {
      dispatch(setLoadingFeTransaction(true));
      let res = await fetch(
        `https://pelit-finance.herokuapp.com/transactions/expense/${TransactionId}`,
        {
          method: "GET", // or 'PUT'
          // headers: {
          //     'Content-Type': 'multipart/form-data',
          // },
          // body: JSON.stringify(payload),
        }
      );
      dispatch(setLoadingFeTransaction(false));
      res = await res.json();
      dispatch(setTransaction(res));

      console.log("Success:", res);
    } catch (error) {
      console.error("Error:", error);
      dispatch(setLoadingFeTransaction(false));
    }
  };
}
