import {
  SET_TRANSACTION,
  SET_LOADING_FETCH_TRANSACTION,
} from "./actionTypes.js";
import {
  SET_USER,
  SET_BADGES,
  SET_ACTIVE_TARGET,
  TOGGLE_LOADER_PROFILE,
  SET_SPEND_BETWEEN,
} from "./actionTypesGaluh.js";
import {
  SET_ALL_TRANSACTION_USER,
  SET_TRANSACTION_BY_CATEGORY,
  SET_TRANSACTION_BY_DATE,
  SET_LOADING_TRANSACTION,
  SET_IS_LOGIN,
  SET_ERROR_LOGIN
} from "./actionTypesFaisal";

const initialState = {
  transaction: {},
  user: {},
  earnedBadges: [],
  allBadges: [],
  activeTarget: {},
  loadingProfile: true,
  spendingBetween: {},
  isLogin: false,
  allTransaction: {},
  transByCategory: {},
  transByDate: {},
  loadingTransaction: false,
  errorLogin: false
};

function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_TRANSACTION:
      return { ...state, transaction: payload };
    case SET_USER:
      return { ...state, user: payload, earnedBadges: payload.Badges };
    case SET_BADGES:
      return { ...state, allBadges: payload };
    case SET_ACTIVE_TARGET:
      return { ...state, activeTarget: payload };
    case TOGGLE_LOADER_PROFILE:
      return { ...state, loadingProfile: payload };
    case SET_SPEND_BETWEEN:
      return { ...state, spendingBetween: payload };
    case SET_IS_LOGIN:
      return { ...state, isLogin: payload };
    case SET_ALL_TRANSACTION_USER:
      return { ...state, allTransaction: payload };
    case SET_TRANSACTION_BY_CATEGORY:
      return { ...state, transByCategory: payload };
    case SET_TRANSACTION_BY_DATE:
      return { ...state, transByDate: payload };
    case SET_LOADING_TRANSACTION:
      return { ...state, loadingTransaction: payload };
    case SET_LOADING_FETCH_TRANSACTION:
      return { ...state, loadingTransaction: payload };
    case SET_ERROR_LOGIN:
      return { ...state, errorLogin: payload };
    default:
      return state;
  }
}

export default reducer;
