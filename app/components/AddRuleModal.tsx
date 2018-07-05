import * as React from "react";
import { Modal } from "./ModalWrapper";

interface AddRuleModalProps {
  addRequest: (url: string, method: string) => void;
  addRequestMethod: string;
  addRequestUrl: string;
  addRuleErrorNotify: (errorMessage: string, tabId: number) => void;
  handleClose: () => void;
  tabId: number;
  updateAddRequestMethod: (value: string, tabId: number) => void;
  updateAddRequestUrl: (value: string, tabId: number) => void;
}
export const AddRuleModal: React.SFC<AddRuleModalProps> = props => {
  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const urlValid = () => {
    const IsUrl: boolean = isUrl(props.addRequestUrl);
    if (IsUrl) {
      props.addRequest(props.addRequestUrl, props.addRequestMethod);
      //reset the url to empty string and request method to "GET"
      props.updateAddRequestUrl(``, props.tabId);
      props.updateAddRequestMethod(`GET`, props.tabId);
      return;
    } else {
      props.addRuleErrorNotify(`Please Enter a valid URL`, props.tabId);
      return;
    }
  };
  return (
    <Modal
      handleClose={() => {
        //erase the previously set error message on each re-render
        props.addRuleErrorNotify(``, props.tabId);
        //reset the url to empty string and request method to "GET"
        props.updateAddRequestUrl(``, props.tabId);
        props.updateAddRequestMethod(`GET`, props.tabId);
        //close the modal
        props.handleClose();
      }}
    >
      {props.addRuleError && (
        <p className="popup-error-message popup-error"> {props.addRuleError} </p>
      )}
      <label htmlFor="url-input-modal">URL</label>
      <input
        className="form-control"
        type="text"
        name="request_url"
        value={props.addRequestUrl}
        id="url-input-modal"
        onChange={e => props.updateAddRequestUrl(e.target.value, props.tabId)}
      />
      <label htmlFor="modal-request-method">Method</label>
      <div>
        <select
          name="request_method"
          id="modal-request-method"
          value={props.addRequestMethod}
          className="modal-method"
          onChange={e => props.updateAddRequestMethod(e.target.value, props.tabId)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="OPTIONS">OPTIONS</option>
          <option value="PUT">PUT</option>
        </select>
      </div>
      <button
        className="btn btn-sm btn-primary btn-add-rule"
        onClick={() => {
          //erase the previously set error message on each re-render
          props.addRuleErrorNotify(``, props.tabId);
          urlValid();
        }}
      >
        Add Rule
      </button>
    </Modal>
  );
};

AddRuleModal.displayName = "AddRuleModal";

AddRuleModal.defaultProps = {
  addRequestMethod: "GET",
  addRequestUrl: "",
  tabId: -1
};
