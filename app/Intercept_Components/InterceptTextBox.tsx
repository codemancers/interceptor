import * as React from 'react'

export const InterceptTextBox = props => {
  console.log(props)
  let responseText = "{msg:hello}";
  return (
    <div>
      <input
      name="responseText"
      type="text"
      placeholder="First Name"
      value={responseText}
    />
      <button
        value="Intercept"
        onClick={props.handleIntercept.bind(
          this,
          props.rowProps.url,
          props.rowProps.method,
          responseText,
          200
        )}
      >
        Intercept
      </button>
    </div>
  );
};