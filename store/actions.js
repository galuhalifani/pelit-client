import {} from "./actionTypesGaluh.js";
import { SET_TRANSACTION } from "./actionTypes.js";
import { SET_LOADING_FETCH_TRANSACTION } from "./actionTypes.js";

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
        `https://pelit-app.herokuapp.com/transactions/${UserId}`,
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

export function putTransaction({ payload }) {
  return async (dispatch) => {
    try {
      console.log(payload, "masuk actions");
      let res = await fetch(
        `https://pelit-app.herokuapp.com/transactions/${payload.TransactionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(payload),
          body: JSON.stringify(payload),
        }
      );
      await res.json();
      // res = await res.json();
      console.log("Success:", res);
      // return res;
    } catch (error) {
      console.error("Error:", error);
    }
  };
}

export function postOcr(payload) {
  return async (dispatch) => {
    try {
      console.log(payload, "SEBELUM POST OCR");
      let res = await (
        await fetch("https://pelit-app.herokuapp.com/ocr", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // body: JSON.stringify(payload),
          body: payload,
        })
      ).json();

      // res = await res.text();
      // res = await res.json();
      console.log("Success:", res);
      return res;
    } catch (error) {
      console.error("Error:", error);
    }
  };
}

export function fetchTransaction(TransactionId) {
  return async (dispatch) => {
    try {
      dispatch(setLoadingFeTransaction(true));
      let res = await fetch(
        `https://pelit-app.herokuapp.com/transactions/expense/${TransactionId}`,
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
