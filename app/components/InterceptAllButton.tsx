import * as React from "react";

interface InterceptAllButtonProps{
  handleCheckedRequests :React.MouseEventHandler<HTMLButtonElement>
  disabled: boolean;
}

export const InterceptAllButton = (props:InterceptAllButtonProps) => {
  return (
    <button
    id="intercept-all-btn"
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