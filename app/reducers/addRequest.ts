import { newRequest, Action } from "../types";
import { RESET, UPDATE_REQUEST_FIELDS } from "../actions/addRequest";

const initialState: newRequest = {
  fields: {
    modal_url: "",
    modal_method: "GET",
    modal_error: ""
  }
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
    case RESET:
      return initialState;

    default:
      return state;
  }
};

export default addRequestReducer;
