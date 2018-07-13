import * as React from "react";
export const Modal = ({ modalTitle, handleClose, children }) => {
  return (
    <section className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span
            onClick={handleClose}
            className="modal-close">
            &times;
          </span>
          <h4>{modalTitle}</h4>
        </div>
        {children}
      </div>
    </section>
  );
};

Modal.displayName = "Modal";
