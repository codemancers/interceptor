export const RESET = "RESET";
export const UPDATE_REQUEST_FIELDS = "UPDATE_REQUEST_FIELDS";
interface requestDetails {
  modal_url?: string;
  modal_method?: string;
  modal_error?: string;
}

export const updateAddRequestFields = (requestDetails: requestDetails) => {
  const { modal_url, modal_method, modal_error } = requestDetails;
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
