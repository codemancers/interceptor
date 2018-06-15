import * as React from "react";
import { Modal } from "./ModalWrapper";
export const AddRuleModal: React.SFC<{}> = props => {
  return (
    <Modal show={props.showModal} handleClose={props.handleClose}>
      <label htmlFor="modal-url">URL</label>
      <input
        className="form-control"
        type="text"
        name="modal-url"
        id="url-input-modal"
        onChange={e => props.updateModalUrl(e.target.value)}
      />
      <label htmlFor="modal-method">Method</label>
      <div>
        <select
          defaultValue="GET"
          value={props.modalMethod}
          className="modal-method"
          onChange={e => props.updateModalMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="OPTIONS">OPTIONS</option>
          <option value="PUT">PUT</option>
        </select>
      </div>
      <button
        className="btn btn-sm btn-primary btn-add-rule"
        onClick={() => props.addRequest(props.modalUrl, props.modalMethod)}
      >
        Add Rule
      </button>
    </Modal>
  );
};
