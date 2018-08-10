import * as React from "react";
import * as uuid from "uuid";
import { Modal } from "./ModalWrapper";

interface AddRuleModalProps {
  addRequestDetails: Object;
  updateAddRequestFields: ({ modal_url, modal_method, modal_error }) => void;
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

  componentDidMount() {
    //erase the previously set error message on each re-render
    //reset the url to empty string and request method to "GET"
    this.props.updateAddRequestFields({
      modal_url: "",
      modal_method: "GET",
      modal_error: ""
    });
  }

  handleClose = () => {
    const { props } = this;
    //close the modal
    props.handleClose();
  };

  handleAddRuleClick = () => {
    this.urlValid();
  };

  urlValid = () => {
    const { props } = this;
    const IsUrl: boolean = this.isUrl(props.addRequestDetails.fields.modal_url);
    if (IsUrl) {
      const requestObject = {
        method: props.addRequestDetails.fields.modal_method,
        requestId: uuid().replace(/-/g, ""),
        tabId: props.tabId,
        type: "xmlhttprequest",
        url: props.addRequestDetails.fields.modal_url
      };
      props.updateRequest(props.tabId, requestObject);
      this.handleClose();
      return;
    } else {
      props.updateAddRequestFields({
        modal_error: "Please Enter a valid URL"
      });
      return;
    }
  };

  updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.props.updateAddRequestFields({ [name]: value });
  };
  render() {
    const { props } = this;
    return (
      <Modal handleClose={this.handleClose} modalTitle="Add Rule">
        {props.addRequestDetails.fields.modal_error && (
          <p className="popup-error-message popup-error">
            {" "}
            {props.addRequestDetails.fields.modal_error}{" "}
          </p>
        )}
        <div className="modal-body">
          <div className="control-group">
            <label htmlFor="url-input-modal">URL</label>
            <input
              className="form-control"
              type="text"
              name="modal_url"
              defaultValue={props.addRequestDetails.fields.modal_url}
              id="url-input-modal"
              onChange={this.updateField}
            />
          </div>
          <div className="control-group">
            <label htmlFor="modal-request-method">Method</label>
            <select
              name="modal_method"
              id="modal_request_method"
              value={props.addRequestDetails.fields.modal_method}
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
