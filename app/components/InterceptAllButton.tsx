import * as React from "react";

interface InterceptAllButtonProps {
  handleCheckedRequests: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
}

export const InterceptAllButton: React.SFC<InterceptAllButtonProps> = props => {
  return (
    <button
      id="intercept-all-btn"
<<<<<<< HEAD
      title="Intercept Selected Requests"
=======
>>>>>>> 926fd86... Fix more ts errors, correct reqId type to a string from number type
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
