import { newRequest, Action } from "../types";
import { RESET, UPDATE_REQUEST_FIELDS, UPDATE_FIELD } from "../actions/addRequest";

const initialState: newRequest = {
  fields: {
    url: "",
    method: ""
  },
  errorMessage: ""
};

export const addRequestReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case UPDATE_REQUEST_FIELDS:
      return {
        ...state,
        fields: {
          ...state.fields,
          ...action.payload
        }
      };
    case UPDATE_FIELD:
      return {
        ...state,
        [action.payload.name]: action.payload.value
      };
    case RESET:
      return initialState;

    default:
      return state;
  }
};

export default addRequestReducer;
