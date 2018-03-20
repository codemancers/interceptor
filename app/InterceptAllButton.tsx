import * as React from "react";

export const InterceptAllButton = props => {
  return (
    <button
    id="intercept-all-btn"
    disabled={!props.enabledRequests.length}
    onClick={() => {
      props.handleCheckedRequests(props.enabledRequests);
    }}
  >
    Intercept All
  </button>
  );
};

InterceptAllButton.defaultProps = {
  enabledRequests: []
};
