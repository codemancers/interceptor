import * as React from "react";

export const InterceptAllButton = props => {
  return (
    <button
    id="intercept-all-btn"
    disabled={props.disabled}
    onClick={props.handleCheckedRequests}
  >
    Intercept All
  </button>
  );
};

InterceptAllButton.displayName = "InterceptAllButton";

InterceptAllButton.defaultProps = {
  disabled: false
};