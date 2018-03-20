import * as React from "react";

export const InterceptAllButton = props => {
  return (
    <button
    id="intercept-all-btn"
    onClick={() => {
      const enabledRequests = props.requests
        .filter(request => {
          return props.checkedReqs[request.requestId];
        })
      props.handleCheckedRequests(enabledRequests);
    }}
  >
    Intercept All
  </button>
  );
};

InterceptAllButton.defaultProps = {
  requests: [],
  checkedReqs: {}
};
