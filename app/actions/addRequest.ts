export const RESET = "RESET";
export const UPDATE_REQUEST_FIELDS = "UPDATE_REQUEST_FIELDS";

export const updateAddRequestFields = (url: string, method: string, error: string) => {
  return {
    type: UPDATE_REQUEST_FIELDS,
    payload: { url, method, error }
  };
};

export const resetAddRequest = () => {
  return {
    type: RESET
  };
};
