import * as React from "react";
import * as uuid from "uuid";
import { Modal } from "./ModalWrapper";

interface AddRuleModalProps {
  addRequestDetails: Object;
  updateAddRequestFields: ((url: string, method: string, error: string) => void);
  handleClose: () => void;
  tabId: number;
  updateRequest: (tabId: number, request: chrome.webRequest.WebRequestBodyDetails) => void;
}
export default class AddRuleModal extends React.PureComponent<AddRuleModalProps, {}> {
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
    //erase the previously set error message on each re-render
    //reset the url to empty string and request method to "GET"
    props.updateAddRequestFields("", "GET", "");
    //close the modal
    props.handleClose();
  };

  handleAddRuleClick = () => {
    this.urlValid();
  };

  urlValid = () => {
    const { props } = this;
    const IsUrl: boolean = this.isUrl(props.addRequestDetails.fields.url);
    if (IsUrl) {
      const requestObject = {
        method: props.addRequestDetails.fields.method,
        requestId: uuid().replace(/-/g, ""),
        tabId: props.tabId,
        type: "xmlhttprequest",
        url: props.addRequestDetails.fields.url
      };
      props.updateRequest(props.tabId, requestObject);
      this.handleClose();
      return;
    } else {
      props.updateAddRequestFields(
        props.addRequestDetails.fields.url,
        props.addRequestDetails.fields.method,
        "Please Enter a valid URL"
      );
      return;
    }
  };
  render() {
    const { props } = this;
    return (
      <Modal handleClose={this.handleClose} modalTitle="Add Rule">
        {props.addRequestDetails.fields.error && (
          <p className="popup-error-message popup-error">
            {" "}
            {props.addRequestDetails.fields.error}{" "}
          </p>
        )}
        <div className="modal-body">
          <div className="control-group">
            <label htmlFor="url-input-modal">URL</label>
            <input
              className="form-control"
              type="text"
              name="request_url"
              defaultValue={props.addRequestDetails.fields.url}
              id="url-input-modal"
              onChange={e => {
                props.updateAddRequestFields(
                  e.target.value,
                  props.addRequestDetails.fields.method,
                  ""
                );
              }}
            />
          </div>
          <div className="control-group">
            <label htmlFor="modal-request-method">Method</label>
            <select
              name="request_method"
              id="modal-request-method"
              value={props.addRequestDetails.fields.method}
              className="modal-method form-control"
              onChange={e =>
                props.updateAddRequestFields(props.addRequestDetails.fields.url, e.target.value, "")
              }
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
