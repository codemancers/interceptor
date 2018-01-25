import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
const logger = createLogger();

export interface PopUpInterface {
  enabled: boolean;
  errorMessage: string;
  requests: Array<Object>;
}

interface Action {
  enabled: boolean;
  label: string;
  errorMessage: string;
  requests: Array<Object>,
  type : string,
  url : string
}

const INITIAL_POPUP_STATE : PopUpInterface = { enabled: false , errorMessage: "",requests: []}

const popupReducer  = (state = INITIAL_POPUP_STATE, action: Action) : function  => {
  switch (action.type) {
    case 'START_LISTENING':
      return {...state, enabled : true, requests : action.requests}
    case 'STOP_LISTENING': 
      return {...state, enabled: false, requests : action.requests};
    case 'ERROR': 
      return {...state, errorMessage : action.errorMessage }
    default:
      return state;
  }
}

export const initializeStore = (popupState: PopUpInterface) =>
  createStore(popupReducer, popupState, applyMiddleware(logger));


