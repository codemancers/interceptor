import { createStore } from 'redux'
import { RequestObj } from './request_list'

interface Action {
  type: string
  request?: RequestObj
  status ?: string,
}

const INITIAL_STATE : Array<RequestObj> = [];
const DEFAULT_ACTION : Action = { type: 'DEFAULT' };

function requestReducer (state = INITIAL_STATE, action = DEFAULT_ACTION) : Array<RequestObj> {
  switch (action.type) {
    case 'ADD_REQUEST':
      // Why was concat being used here?
      // Typescript found an issue when I substituted push here. The type
      // signature of this reducer function then became number | []RequestObj
      // which we know is wrong. This is cool! And without this action.request
      // null check, we might be adding `undefined`s or null values to the
      // array, which again was found out by TypeScript.
      return action.request ? state.concat([action.request]) : state;
    case 'CLEAR_REQUESTS':
      return INITIAL_STATE;
    case 'DEFAULT':
    default:
      return state;
  }
}

export const initializeStore = (requests: Array<RequestObj>) =>
  createStore(requestReducer, requests);
