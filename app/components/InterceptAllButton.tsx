import * as React from "react";

export const InterceptAllButton = props => {
  return (
    <button
      id="intercept-all-btn"
      title="Intercept Selected Requests"
      className="btn btn-sm btn-primary btn-clear"
      disabled={props.disabled}
      onClick={props.handleCheckedRequests}
    >
      Intercept
    </button>
  );
};

InterceptAllButton.displayName = "InterceptAllButton";

InterceptAllButton.defaultProps = {
  disabled: false
};
