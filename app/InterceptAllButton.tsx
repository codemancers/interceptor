import * as React from "react";

export const InterceptAllButton = props => {
  const enabledRequests = props.requests
  .filter(request => {
    return props.checkedReqs[request.requestId];
  })
  return (
    <button
    id="intercept-all-btn"
    disabled={!enabledRequests.length}
    onClick={() => {
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
