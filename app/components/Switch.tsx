import * as React from "react";
export const Switch = function(props={isOn:true, handleSwitch: () => {}}) {
	let classNames = ["switch", (props.isOn) ? "switch_is-on" : "switch_is-off"].join(" ");
	return (
    <div className="toggle-switch-container">
      <span>Toggle Interception</span>
      <div className={classNames} onClick={props.handleSwitch}>
        <ToggleButton
          isOn={props.isOn}
        />
      </div>
    </div>
	);
}

const ToggleButton = function(props) {
  let classNames = ["toggle-button", (props.isOn) ? "toggle-button_position-right" : "toggle-button_position-left"].join(" ");
  return (<div className={classNames}></div>);
};

