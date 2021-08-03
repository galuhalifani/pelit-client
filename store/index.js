import { createStore, applyMiddleware, compose } from 'redux'
// import { SET_USER, SET_BADGES, SET_ACTIVE_TARGET, TOGGLE_LOADER_PROFILE } from './actionTypesGaluh.js'
// import { } from './actionTypes.js'
import reducer from './reducers'
import thunk from 'redux-thunk'
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// const initialState = {
//     user: {},
//     earnedBadges: [],
//     allBadges: [],
//     activeTarget: {},
//     loadingProfile: true,
// }

// function boardReducer(state = initialState, action) {
//     if (action.type === SET_USER) {
//         return { ...state, user: action.payload, earnedBadges: action.payload.Badges}
//     } else if (action.type === SET_BADGES) {
//         return { ...state, allBadges: action.payload}
//     } else if (action.type === SET_ACTIVE_TARGET) {
//         return { ...state, activeTarget: action.payload}
//     } else if (action.type === TOGGLE_LOADER_PROFILE) {
//         return { ...state, loadingProfile: action.payload}
//     }
//     return state
// }

const store = createStore (
    reducer, applyMiddleware(thunk)
    // composeEnhancers(
    //     applyMiddleware(thunk)
    // )
)

export default store