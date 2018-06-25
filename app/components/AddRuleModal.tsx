import * as React from "react";
import { Modal } from "./ModalWrapper";
export const AddRuleModal: React.SFC<{}> = props => {
  const isUrl = str => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const urlValid = () => {
    const IsUrl: boolean = isUrl(props.addRequestUrl);
    IsUrl
      ? props.addRequest(props.addRequestUrl, props.addRequestMethod)
      : props.errorNotify(`Please Enter a valid URL`, props.tabId);
  };
  return (
    <Modal handleClose={props.handleClose}>
      <label htmlFor="url-input-modal">URL</label>
      <input
        className="form-control"
        type="text"
        name="request_url"
        id="url-input-modal"
        onChange={e => props.updateAddRequestUrl(e.target.value, props.tabId)}
      />
      <label htmlFor="modal-request-method">Method</label>
      <div>
        <select
          name="request_method"
          id="modal-request-method"
          defaultValue="GET"
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
      <button className="btn btn-sm btn-primary btn-add-rule" onClick={urlValid}>
        Add Rule
      </button>
    </Modal>
  );
};

AddRuleModal.displayName = "AddRuleModal";
