import * as uuid from "uuid";

import { newRequest, Action } from "../types";
import { RESET, UPDATE_REQUEST_FIELDS, UPDATE_REQUEST_ROOT_FIELDS } from "../actions/addRequest";

export const initialState: newRequest = {
  fields: {
    url: "",
    method: "GET",
    type: "xmlhttprequest",
    requestId: uuid().replace(/-/g, "")
  },
  error: ""
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
    case UPDATE_REQUEST_ROOT_FIELDS:
      return {
        ...state,
        ...action.payload
      };
    case RESET:
      return {
        ...initialState,
        fields: {
          ...initialState.fields,
          requestId: uuid().replace(/-/g, "")
        }
      };

    default:
      return state;
  }
};

export default addRequestReducer;
