import * as React from "react";
export const Switch = function(props={isOn:false, handleToggle: () => {}}) {
	let classNames = ["switch", (props.isOn) ? "switch_is-on" : "switch_is-off"].join(" ");
	return (
		<div className={classNames} onClick={props.handleToggle}>
			<ToggleButton
				isOn={props.isOn}
			/>
		</div>
	);
}

const ToggleButton = function(props) {
  let classNames = ["toggle-button", (props.isOn) ? "toggle-button_position-right" : "toggle-button_position-left"].join(" ");
  return (<div className={classNames}></div>);
};

