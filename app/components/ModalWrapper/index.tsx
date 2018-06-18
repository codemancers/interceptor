import * as React from "react";
export const Modal = ({ handleClose, show, children }) => {
  if (!show) {
    return null;
  }
  return (
    <section className="modal-main">
      {children}
      <button className="modal-close-btn btn-sm btn" onClick={handleClose}>
        X
      </button>
    </section>
  );
};
