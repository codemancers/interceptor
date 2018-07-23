import * as React from "react";

interface InterceptAllButtonProps {
  handleCheckedRequests: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
}

export const InterceptAllButton: React.SFC<InterceptAllButtonProps> = props => {
  return (
    <button
      id="intercept-all-btn"
      title="Intercept Selected Requests"
      className="btn btn-sm btn-primary"
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
