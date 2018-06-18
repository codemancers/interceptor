import * as React from "react";
import { Modal } from "./ModalWrapper";
export const AddRuleModal: React.SFC<{}> = props => {
  return (
    <Modal show={props.showModal} handleClose={props.handleClose}>
      <label htmlFor="url-input-modal">URL</label>
      <input
        className="form-control"
        type="text"
        name="request_url"
        id="url-input-modal"
        onChange={props.updateModalUrl}
      />
      <label htmlFor="modal-request-method">Method</label>
      <div>
        <select
          name="request_method"
          id="modal-request-method"
          defaultValue="GET"
          value={props.modalMethod}
          className="modal-method"
          onChange={props.updateModalMethod}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="OPTIONS">OPTIONS</option>
          <option value="PUT">PUT</option>
        </select>
      </div>
      <button
        className="btn btn-sm btn-primary btn-add-rule"
        onClick={props.addRequest(props.modalUrl, props.modalMethod}
      >
        Add Rule
      </button>
    </Modal>
  );
};
