import * as React from "react";

import { Modal } from "./ModalWrapper";

import { newRequest, newRequestFields, requestRootFields } from "../types";

interface AddRuleModalProps {
  addRequestDetails: newRequest;
  addRequest: (fields: newRequestFields) => void;
  updateAddRequestFields: (fields: newRequestFields) => void;
  updateRequestRootFields: (request: requestRootFields) => void;
  handleClose: () => void;
  resetAddRequest: () => void;
}
export default class AddRuleModal extends React.Component<AddRuleModalProps, {}> {
  isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  componentDidMount() {
    //erase the previously set error message on each re-render
    //reset the url to empty string and request method to "GET"
    this.props.resetAddRequest();
  }

  handleAddRuleClick = () => {
    const {
      addRequestDetails: { fields }
    } = this.props;
    const IsUrl: boolean = this.isUrl(fields.url);
    if (IsUrl) {
      this.props.addRequest(fields);
      this.props.handleClose();
    } else {
      this.props.updateRequestRootFields({
        error: "Please Enter a valid URL"
      });
    }
  };

  updateField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value, name } = e.target;
    this.props.updateAddRequestFields({ [name]: value });
  };

  render() {
    const { fields, error } = this.props.addRequestDetails;
    return (
      <Modal handleClose={this.props.handleClose} modalTitle="Add Rule">
        {Boolean(error) && <p className="popup-error-message popup-error">{error}</p>}
        <div className="modal-body">
          <div className="control-group">
            <label htmlFor="url-input-modal">URL</label>
            <input
              className="form-control"
              type="text"
              name="url"
              value={fields.url}
              id="url-input-modal"
              onChange={this.updateField}
            />
          </div>
          <div className="control-group">
            <label htmlFor="modal-request-method">Method</label>
            <select
              name="method"
              id="request_method"
              value={fields.method}
              className="modal-method form-control"
              onChange={this.updateField}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="OPTIONS">OPTIONS</option>
              <option value="PUT">PUT</option>
            </select>
          </div>
        </div>
        <div className="modal-footer text-right">
          <button className="btn" onClick={this.props.handleClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-add-rule" onClick={this.handleAddRuleClick}>
            Add Rule
          </button>
        </div>
      </Modal>
    );
  }
}
