import {
  SET_USER,
  SET_BADGES,
  SET_ACTIVE_TARGET,
  TOGGLE_LOADER_PROFILE,
  SET_SPEND_BETWEEN,
} from "./actionTypesGaluh.js";

export function setUser(input) {
  return {
    type: SET_USER,
    payload: input,
  };
}

export function setBadges(input) {
  return {
    type: SET_BADGES,
    payload: input,
  };
}

export function setActiveTarget(input) {
  return {
    type: SET_ACTIVE_TARGET,
    payload: input,
  };
}

export function toggleLoadingProfile(input) {
  return {
    type: TOGGLE_LOADER_PROFILE,
    payload: input,
  };
}

export function setTotalSpendingBetween(input) {
  return {
    type: SET_SPEND_BETWEEN,
    payload: input,
  };
}

export function getUserDetails(id) {
  // console.log('GET USER DETAILS', id)
  let userId = +id;
  // console.log(id, 'ID')
  return function (dispatch) {
    dispatch(toggleLoadingProfile(true));
    fetch(`https://pelit-app.herokuapp.com/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(toggleLoadingProfile(false));
        // console.log(data, 'DATA')
        dispatch(setUser(data));
      })
      .catch((err) => {
        dispatch(toggleLoadingProfile(false));
        console.log("error fetch user data", err);
      });
  };
}

export function getAllBadges() {
  return function (dispatch) {
    fetch(`https://pelit-app.herokuapp.com/badge`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setBadges(data));
      })
      .catch((err) => {
        console.log("error fetch badge", err);
      });
  };
}

export function getUserActiveTarget(id) {
  let userId = +id;
  return function (dispatch) {
    fetch(`https://pelit-app.herokuapp.com/target/active/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          dispatch(setActiveTarget(data[0]));
          console.log("MASUKKK");
          let startDate = data[0].startDate;
          let endDate = data[0].endDate;
          fetch(
            `https://pelit-app.herokuapp.com/transactions/between/${startDate}/${endDate}/${userId}/Expense`
          )
            .then((response) => response.json())
            .then((transactionData) => {
              dispatch(setTotalSpendingBetween(transactionData));
            })
            .catch((err) => {
              console.log("error fetch active target", err);
            });
        } else {
          dispatch(setActiveTarget({}));
        }
      })
      .catch((err) => {
        console.log("error fetch active target 2", err);
      });
  };
}

export function addPushToken(pushToken, userId) {
  console.log(pushToken, userId, "DI ACTIONS");
  let id = +userId;
  return function (dispatch) {
    fetch(`https://pelit-app.herokuapp.com/user/pushtoken/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pushToken }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("sucess set push token", data);
      })
      .catch((err) => {
        console.log("error fetch badge", err);
      });
  };
}
