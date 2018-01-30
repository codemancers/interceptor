import {PopUpState, Action} from '../types'
const INITIAL_POPUP_STATE : PopUpState = { enabled: false , errorMessage: "",requests: []}

//ACTION CONSTANTS
import * as actionType from "../actions"

export const reducer = (state = INITIAL_POPUP_STATE, action: Action) => {
  switch (action.type) {
    case actionType.START_LISTENING:
      return {...state, enabled : true}
    case actionType.UPDATE_FIELD:
      return {...state, ...action};
    case actionType.UPDATE_FIELDS:
      return {...state,  ...action.payload};
    case actionType.STOP_LISTENING: 
      return {...state, enabled: false};
    case actionType.ERROR: 
      return {...state, errorMessage: action.errorMessage }
    case actionType.CLEAR_REQUESTS : return {...state, requests: [] }
    default:
      return state;
  }
}
