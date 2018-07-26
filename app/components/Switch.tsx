import * as React from "react";

export const Switch: React.SFC<Switch> = props => {
  let classNames = ["switch", props.isOn ? "switch_is-on" : "switch_is-off"].join(" ");
  let interceptLabelText = props.isOn ? "Disable Interception" : "Enable Interception";
  return (
    <div className="toggle-switch-container">
      <div className={classNames} onClick={props.handleSwitchToggle}>
        <div className="tooltip" data-tooltip={interceptLabelText}>
          <ToggleButton isOn={props.isOn} />
        </div>
      </div>
    </div>
  );
};

const ToggleButton: React.SFC<ToggleButton> = props => {
  let classNames = [
    "toggle-button",
    props.isOn ? "toggle-button_position-right" : "toggle-button_position-left"
  ].join(" ");
  return <div className={classNames} />;
};

interface ToggleButton {
  isOn: boolean;
}

interface Switch {
  isOn: boolean;
  handleSwitchToggle: (event: React.MouseEvent<HTMLDivElement>) => void;
}

Switch.displayName = "Switch";

Switch.defaultProps = {
  isOn: false
};

ToggleButton.defaultProps = {
  isOn: false
};
