export const RESET = "RESET";
export const UPDATE_REQUEST_FIELDS = "UPDATE_REQUEST_FIELDS";

export const updateAddRequestFields = ({ modal_url, modal_method, modal_error }) => {
  console.log({
    type: UPDATE_REQUEST_FIELDS,
    payload: { modal_url, modal_method, modal_error }
  });
  return {
    type: UPDATE_REQUEST_FIELDS,
    payload: { modal_url, modal_method, modal_error }
  };
};

export const resetAddRequest = () => {
  return {
    type: RESET
  };
};
