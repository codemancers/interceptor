import * as React from 'react'

export const InterceptTextBox = props => {
  const defaultResponseText = "{msg:hello}";
  const defaultStatusCode = "200"
  const responseTextValue = props.ResponseText[props.rowProps.checkbox.requestId] || defaultResponseText
  const statusCodeValue = props.interceptStatus[props.rowProps.checkbox.requestId] || defaultStatusCode

  return (
    <div>
      <input
      name="responseText"
      type="text"
      value={responseTextValue}
      onChange={event => props.handleRespTextChange(event.target.value, props.rowProps.checkbox.requestId)}
    />
        <div>
    <select
      value={statusCodeValue}
      onChange={event => {props.handleStatusCodeChange(event.target.value, props.rowProps.checkbox.requestId)}}>
      <option value="200">OK</option>
      <option value="404">404</option>
      <option value="500">500</option>
      <option value="300">300 Redirect</option>
    </select>
    </div>

      <button
        value="Intercept"
        onClick={props.handleIntercept.bind(
          this,
          props.rowProps.url,
          props.rowProps.method,
          responseTextValue,
          statusCodeValue
        )
      }
      >
        Intercept
      </button>
    </div>
  );
};