export const RESET = "RESET";
export const UPDATE_REQUEST_FIELDS = "UPDATE_REQUEST_FIELDS";
export const UPDATE_FIELD = "UPDATE_FIELD";

export const updateAddRequestFields = (name, value) => {
  return {
    type: UPDATE_REQUEST_FIELDS,
    payload: { name, value }
  };
};

export const resetAddRequest = () => {
  return {
    type: RESET
  };
};
