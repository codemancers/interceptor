import { newRequestFields, newRequest } from "../types";

export const RESET = "RESET";
export const UPDATE_REQUEST_FIELDS = "UPDATE_REQUEST_FIELDS";
export const UPDATE_REQUEST_ROOT_FIELDS = "UPDATE_REQUEST_ROOT_FIELDS";

export const updateAddRequestFields = (payload: newRequestFields) => {
  return {
    type: UPDATE_REQUEST_FIELDS,
    payload
  };
};

export const resetAddRequest = () => {
  return {
    type: RESET
  };
};

export const updateRequestRootFields = (payload: newRequest) => {
  return {
    type: UPDATE_REQUEST_ROOT_FIELDS,
    payload
  };
};
