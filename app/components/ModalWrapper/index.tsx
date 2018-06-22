import * as React from "react";
export const Modal = ({ handleClose, children }) => {
  return (
    <section className="modal">
      {children}
      <button className="modal-close-btn btn-sm btn" onClick={handleClose}>
        X
      </button>
    </section>
  );
};

Modal.displayName = "Modal";
