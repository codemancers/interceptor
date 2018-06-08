import * as React from "react";

export const Switch: React.SFC<Switch> = props => {
  let classNames = ["switch", props.isOn ? "switch_is-on" : "switch_is-off"].join(" ");
  return (
    <div className="toggle-switch-container">
      <span>Toggle Interception</span>
      <div className={classNames} onClick={props.handleSwitchToggle}>
        <ToggleButton isOn={props.isOn} />
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
