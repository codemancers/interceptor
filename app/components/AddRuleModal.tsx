import * as React from "react";
import { Modal } from "./ModalWrapper";

interface AddRuleModalProps {
  addRequest: (url: string, method: string) => void;
  addRequestMethod: string;
  addRequestUrl: string;
  addRuleErrorNotify: (errorMessage: string, tabId: number) => void;
  addRuleError: string;
  handleClose: () => void;
  tabId: number;
  updateAddRequestMethod: (value: string, tabId: number) => void;
  updateAddRequestUrl: (value: string, tabId: number) => void;
}
export class AddRuleModal extends React.PureComponent<AddRuleModalProps, {}> {
  isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  handleClose = () => {
    const { props } = this;
    //reset the url to empty string and request method to "GET"
    props.updateAddRequestUrl("", props.tabId);
    props.updateAddRequestMethod("GET", props.tabId);
    //Erase the previously set error on opening the modal window
    props.addRuleErrorNotify("", props.tabId);
    //close the modal
    props.handleClose();
  };

  handleAddRuleClick = () => {
    this.urlValid();
  };

  urlValid = () => {
    const { props } = this;
    const IsUrl: boolean = this.isUrl(props.addRequestUrl);
    if (IsUrl) {
      props.addRequest(props.addRequestUrl, props.addRequestMethod);
      //close the modal after adding the url successfully
      this.handleClose();
      return;
    } else {
      props.addRuleErrorNotify("Please Enter a valid URL", props.tabId);
      return;
    }
  };
  render() {
    const { props } = this;

    return (
      <Modal handleClose={this.handleClose} modalTitle="Add Rule">
        {props.addRuleError && (
          <p className="popup-error-message popup-error"> {props.addRuleError} </p>
        )}
        <div className="modal-body">
          <div className="control-group">
            <label htmlFor="url-input-modal">URL</label>
            <input
              className="form-control"
              type="text"
              name="request_url"
              defaultValue={props.addRequestUrl}
              id="url-input-modal"
              onChange={e => {
                props.updateAddRequestUrl(e.target.value, props.tabId);
              }}
            />
          </div>
          <div className="control-group">
            <label htmlFor="modal-request-method">Method</label>
            <select
              name="request_method"
              id="modal-request-method"
              value={props.addRequestMethod}
              className="modal-method form-control"
              onChange={e => props.updateAddRequestMethod(e.target.value, props.tabId)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="OPTIONS">OPTIONS</option>
              <option value="PUT">PUT</option>
            </select>
          </div>
        </div>
        <div className="modal-footer text-right">
          <button className="btn" onClick={this.handleClose}>
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

AddRuleModal.defaultProps = {
  addRequestMethod: "GET",
  addRequestUrl: "",
  tabId: -1
};
